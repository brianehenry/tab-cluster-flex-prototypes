"use strict";
//**********************************************************
// Service that handles interaction with Vireo
// National Instruments Copyright 2014
//**********************************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;
    var $ = NationalInstruments.Globals.jQuery;
    var VIREO_STATIC_HELPERS = NationalInstruments.HtmlVI.VireoStaticHelpers;
    var VIREO_PEEKER = NationalInstruments.HtmlVI.VireoPeeker;
    var VIREO_POKER = NationalInstruments.HtmlVI.VireoPoker;
    var GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.LocalUpdateService = function (config) {
        parent.call(this);
        // Public Instance Properties
        this.vireo = undefined;
        this.vireoTimer = undefined;
        this.syncControlsCache = {};
        this.propertyTypesCache = {};
        this.vireoSource = config.vireoSource;
        this.ideMode = config.runningInIDE === true;
        this.vireoText = undefined;
        this.dataItemCache = undefined;
        this.vireoTotalMemory = config.vireoTotalMemory;
        this.eventRegistrationService = new NationalInstruments.HtmlVI.NIEventRegistrationService();
        this.eventDataWriter = undefined;
        // References to callbacks registered to coherent so they can be unregistered later
        this.windowEngineCallbacks = {
            start: undefined,
            diagramValueChanged: undefined,
            finishedSendingUpdates: undefined,
            abortVI: undefined
        };
        // Private Instance Properties
        this._updateHTMLControlsTimer = undefined;
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.LocalUpdateService.StateEnum = Object.freeze(Object.assign({
        DOWNLOADING: 'DOWNLOADING',
        SYNCHRONIZING: 'SYNCHRONIZING',
        RUNNING: 'RUNNING',
        STOPPING: 'STOPPING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));
    NationalInstruments.HtmlVI.LocalUpdateService.InitTasksEnum = Object.freeze(Object.assign({
        DOWNLOADING: 'DOWNLOADING',
        VIREOLOADED: 'VIREOLOADED'
    }, parent.InitTasksEnum));
    NationalInstruments.HtmlVI.LocalUpdateService.CoherentMessagesEnum = Object.freeze({
        DIAGRAM_VALUE_CHANGED: 'DiagramValueChanged',
        FINISHED_SENDING_UPDATES: 'FinishedSendingUpdates',
        READY_FOR_UPDATES: 'ReadyForUpdates',
        ABORT_VI: 'AbortVI',
        FINISHED_RUNNING: 'FinishedRunning',
        PANEL_CONTROL_CHANGED: 'PanelControlChanged',
        START: 'Start',
        DOCUMENT_READY: 'DocumentReady',
        UPDATE_SERVICE_STARTED: 'UpdateServiceStarted',
        PROCESS_INTERNAL_EVENT: 'ProcessInternalEvent',
        NAVIGATION_ATTEMPTED: 'NavigationAttempted',
        LOG_ERROR: 'LogError'
    });
    NationalInstruments.HtmlVI.LocalUpdateService.AccessModesEnum = Object.freeze({
        READ_ONLY: 'readOnly',
        WRITE_ONLY: 'writeOnly',
        READ_WRITE: 'readWrite'
    });
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.LocalUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.LocalUpdateService.StateEnum;
    var INIT_TASKS_ENUM = NationalInstruments.HtmlVI.LocalUpdateService.InitTasksEnum;
    var COHERENT_MESSAGE_ENUM = NationalInstruments.HtmlVI.LocalUpdateService.CoherentMessagesEnum;
    var ACCESS_MODES = NationalInstruments.HtmlVI.LocalUpdateService.AccessModesEnum;
    var MAXIMUM_VIREO_EXECUTION_TIME_MS = 4;
    var SLICE_SETS_PER_TIME_CHECK = 10000;
    // Static Private Functions
    var reportFailedToLoadVireoSource = function () {
        var element = document.getElementById('ni-failed-to-load-vireo-source');
        if (element !== null) {
            // It would be preferable to add or remove a class from the element instead
            // However since this case is trying to handle failed network conditions it is possible css, etc, fails to load as well
            // So setting as inline style to reduce external dependencies for showing this message
            element.style.display = 'block';
        }
    };
    var hasReadAccessor = function (localBindingInfo) {
        return localBindingInfo.accessMode === ACCESS_MODES.READ_ONLY || localBindingInfo.accessMode === ACCESS_MODES.READ_WRITE;
    };
    var hasWriteAccessor = function (localBindingInfo) {
        return localBindingInfo.accessMode === ACCESS_MODES.WRITE_ONLY || localBindingInfo.accessMode === ACCESS_MODES.READ_WRITE;
    };
    var controlCanTriggerValueChange = function (controlModel) {
        // Only Top level controls trigger value change; containers (cluster and array) are responsible for their children
        // Only controls (inputs) and controls with both read/write terminals can trigger value changes.
        return controlModel.isTopLevelAndPlacedAndEnabled() && hasReadAccessor(controlModel.getLocalBindingInfo());
    };
    var controlCanTriggerEvent = function (controlModel) {
        // Only statically created controls that have a localBindingInfo during page generation. ie cursors created at runtime are ignored
        // Only Top level controls trigger value change; containers (cluster and array) are responsible for their children
        return controlModel.getLocalBindingInfo() !== undefined && controlModel.insideTopLevelContainer() === false;
    };
    var controlAcceptsDiagramUpdates = function (controlModel) {
        // Only update Top level controls; containers (cluster and array) are responsible for their children
        // Only update indicators (outputs) and controls with both read/write terminals
        // Only update controls with latching enabled
        var localBindingInfo = controlModel.getLocalBindingInfo();
        return controlModel.isTopLevelAndPlacedAndEnabled() && (hasWriteAccessor(localBindingInfo) || localBindingInfo.isLatched === true);
    };
    /**
     * Iterates through all control models in all VI models in the current web application.
     * Stops if callback returns a value different than 'undefined' and returns that value.
     * @param {Array} viModels - The VI models to scan. Typically localUpdateService.getVIModels().
     * @param {function} callback - Function to call with each control model and its correspondent owner VI model.
     * @returns {Object} returnVal - The obejct returned in the callback or undefined if none was returned.
     */
    var forEachControlModelInEachVIModel = function (viModels, callback) {
        var viName, viModel, controlModels, controlId, controlModel, returnVal;
        for (viName in viModels) {
            if (viModels.hasOwnProperty(viName)) {
                viModel = viModels[viName];
                controlModels = viModel.getAllControlModels();
                for (controlId in controlModels) {
                    if (controlModels.hasOwnProperty(controlId)) {
                        controlModel = controlModels[controlId];
                        returnVal = callback(viModel, controlModel);
                        if (returnVal !== undefined) {
                            return returnVal;
                        }
                    }
                }
            }
        }
        return undefined;
    };
    /* Tries to find a html control given a front-panel id (Data item) and returns a
     * string used for debugging that contains information about that control
     * @param {string} fpId - Front panel id (Data Item)
     * @param {Array} viModels - The VI models to scan
     */
    var getControlDebuggingInfo = function (fpId, viModels) {
        var result = forEachControlModelInEachVIModel(viModels(), function (viModel, controlModel) {
            var additionalErrorInfo;
            var localBindingInfo = controlModel.getLocalBindingInfo();
            if (localBindingInfo !== undefined && localBindingInfo.dataItem === fpId) {
                additionalErrorInfo = `id=${controlModel.niControlId}, acceptsDiagramUpdates=${controlAcceptsDiagramUpdates(controlModel)}, ` +
                    `sync=${localBindingInfo.sync}, insideTopLevelContainer=${controlModel.insideTopLevelContainer()}, `;
                if (localBindingInfo === undefined) {
                    additionalErrorInfo += 'localBindingInfo=undefined';
                }
                else {
                    additionalErrorInfo += `localBindingInfo.unplacedOrDisabled=${localBindingInfo.unplacedOrDisabled}, localbindingInfo.isLatched=${localBindingInfo.isLatched}, hasWriteAccessor=${hasWriteAccessor(localBindingInfo)}`;
                }
                return additionalErrorInfo;
            }
            return undefined;
        });
        return result === undefined ? 'Data item does not exist' : result;
    };
    // Public Prototype Methods
    proto.isValidServiceState = function (state) {
        // Child states merged with parent states so only need to check child
        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    };
    proto.isInIdeMode = function () {
        return this.ideMode;
    };
    // Functions for State transitions
    proto.initialize = function () {
        var initTaskTracker = parent.prototype.initialize.call(this, SERVICE_STATE_ENUM.UNINITIALIZED, INIT_TASKS_ENUM), encodedVireoSourceUrl = this.vireoSource, that = this;
        // Change state prior to starting download
        // The crossDomain: true setting is to prevent jquery from adding the X-Requested-With header which changes the XHR request from a simple CORS request
        // to a CORS request with a preflight. This fails for some CDNs that redirect requests to a different domain (ie rawgit.com -> raw.githubusercontent.com)
        $.ajax({
            url: encodedVireoSourceUrl,
            dataType: 'text',
            crossDomain: true,
            complete: function (jqXHR, status) {
                if (status === 'success' || status === 'notmodified') {
                    that.vireoText = jqXHR.responseText;
                    initTaskTracker.complete(INIT_TASKS_ENUM.DOWNLOADING);
                }
                else {
                    NI_SUPPORT.error('Error retrieving vireo source from url (' + that.vireoSource + ') with status (' + status + ')');
                    reportFailedToLoadVireoSource();
                    that.setServiceState(SERVICE_STATE_ENUM.ERROR);
                }
            }
        });
        VIREO_STATIC_HELPERS.whenVireoLoaded(function () {
            initTaskTracker.complete(INIT_TASKS_ENUM.VIREOLOADED);
        });
        that.setServiceState(SERVICE_STATE_ENUM.DOWNLOADING);
    };
    proto.lookupLocalBindingInfo = function (viName, controlId) {
        var viModels = this.getVIModels();
        var viModel = viModels[viName];
        var controlModel = viModel.getControlModel(controlId);
        var localBindingInfo = controlModel.getLocalBindingInfo();
        if (localBindingInfo === undefined) {
            return undefined;
        }
        // TODO remove this check and replace with eggShell function to safely search for a path
        // instead of relying on exception handling
        try {
            this.vireo.eggShell.findValueRef(localBindingInfo.encodedVIName, localBindingInfo.runtimePath);
        }
        catch (ex) {
            if (typeof ex.message === 'string' && ex.message.indexOf('ObjectNotFoundAtPath') !== -1) {
                return undefined;
            }
            else {
                throw ex;
            }
        }
        return localBindingInfo;
    };
    proto.finishInitializing = function () {
        parent.prototype.finishInitializing.call(this, SERVICE_STATE_ENUM.DOWNLOADING);
        var that = this;
        // Vireo is not necessarily available statically at initialization
        // so we reference the constructor function only when trying to construct
        var Vireo = NationalInstruments.Vireo.Vireo;
        var config = {};
        var vireoTotalMemoryParsed = parseInt(that.vireoTotalMemory, 10);
        if (isNaN(vireoTotalMemoryParsed) === false) {
            config.customModule = {
                TOTAL_MEMORY: vireoTotalMemoryParsed
            };
        }
        that.vireo = new Vireo(config);
        that.vireo.coreHelpers.setFPSyncFunction(function (fpId) {
            that.updateSyncHTMLControl(fpId);
        });
        var setObjectReferenceInvalidError = function (jsAPI) {
            jsAPI.setLabVIEWError(true, 1055, NI_SUPPORT.i18n('msg_INVALID_OBJECT_REFERENCE'));
        };
        that.vireo.javaScriptInvoke.registerInternalFunctions({
            ControlReference_GetControlObject: function (viName, id) {
                var viModels = that.getVIModels(); // gets all top level VI models
                var viModel = viModels[viName];
                if (!(viModel instanceof NationalInstruments.HtmlVI.Models.VirtualInstrumentModel)) {
                    return undefined;
                }
                return viModel.getControlModel(id);
            },
            PropertyNode_PropertyRead: function (controlModel, propertyName, jsAPI) {
                if (!(controlModel instanceof NationalInstruments.HtmlVI.Models.VisualModel)) {
                    setObjectReferenceInvalidError(jsAPI);
                    return undefined;
                }
                var value = controlModel.getGPropertyValue(propertyName, jsAPI);
                return value;
            },
            PropertyNode_PropertyWrite: function (controlModel, propertyName, value, jsAPI) {
                if (!(controlModel instanceof NationalInstruments.HtmlVI.Models.VisualModel)) {
                    setObjectReferenceInvalidError(jsAPI);
                    return;
                }
                controlModel.setGPropertyValue(propertyName, value, jsAPI);
            }
        });
        that.vireo.eggShell.setPrintFunction(function (text) {
            NI_SUPPORT.debug(text + '\n');
        });
        that.vireo.eggShell.setPrintErrorFunction(function (text) {
            NI_SUPPORT.debug(text + '\n');
        });
        that.vireo.propertyNode.setPropertyReadFunction(function (controlRefVIName, controlId, propertyName, tempVarValueRef) {
            var propertyValue, localBindingInfo;
            var viName = Vireo.decodeIdentifier(controlRefVIName);
            if (controlId !== undefined) {
                if (propertyName === GPropertyNameConstants.VALUE) {
                    localBindingInfo = that.lookupLocalBindingInfo(viName, controlId);
                    if (localBindingInfo === undefined) {
                        propertyValue = that.getGPropertyValue(viName, controlId, propertyName);
                    }
                    else {
                        propertyValue = VIREO_PEEKER.peek(that.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath);
                    }
                }
                else {
                    propertyValue = that.getGPropertyValue(viName, controlId, propertyName);
                }
                VIREO_POKER.pokeValueRef(that.vireo, tempVarValueRef, propertyValue);
            }
            else {
                throw new Error('Could not find control with control id: ' + controlId + ' in vi: ' + viName);
            }
        });
        that.vireo.propertyNode.setPropertyWriteFunction(function (controlRefVIName, controlId, propertyName, tempVarValueRef) {
            var propertyValue, localBindingInfo;
            var viName = Vireo.decodeIdentifier(controlRefVIName);
            if (controlId !== undefined) {
                propertyValue = VIREO_PEEKER.peekValueRef(that.vireo, tempVarValueRef);
                that.setGPropertyValue(viName, controlId, propertyName, propertyValue);
                if (propertyName === GPropertyNameConstants.VALUE) {
                    localBindingInfo = that.lookupLocalBindingInfo(viName, controlId);
                    if (localBindingInfo !== undefined) {
                        VIREO_POKER.poke(that.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath, propertyValue);
                    }
                }
            }
            else {
                throw new Error('Could not find control with control id: ' + controlId + ' in vi: ' + viName);
            }
        });
        that.vireo.eventHelpers.setRegisterForControlEventsFunction(function (viName, controlId, eventId, eventOracleIndex) {
            that.eventRegistrationService.registerForControlEvents(viName, controlId, eventId, eventOracleIndex);
        });
        that.vireo.eventHelpers.setUnRegisterForControlEventsFunction(function (viName, controlId, eventId, eventOracleIndex) {
            that.eventRegistrationService.unRegisterForControlEvents(viName, controlId, eventId, eventOracleIndex);
        });
        that.vireo.eggShell.setExecuteSlicesWakeUpCallback(function () {
            if (that.checkServiceStateIs(SERVICE_STATE_ENUM.RUNNING)) {
                window.clearTimeout(that.vireoTimer);
                that.vireoTimer = undefined;
                that.executeVireoRuntime();
            }
        });
        that.dataItemCache = new NationalInstruments.HtmlVI.ControlDataItemCache(that.getVIModels());
        that.eventDataWriter = function (valueRef, eventData) {
            VIREO_POKER.pokeValueRef(that.vireo, valueRef, eventData);
        };
        if (that.ideMode === true) {
            window.engine.call(COHERENT_MESSAGE_ENUM.DOCUMENT_READY);
        }
        that.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    proto.start = function () {
        parent.prototype.start.call(this, SERVICE_STATE_ENUM.READY);
        var that = this;
        that.vireo.eggShell.loadVia(that.vireoText);
        if (that.ideMode === true) {
            window.engine.off(COHERENT_MESSAGE_ENUM.START, that.windowEngineCallbacks.start);
            that.windowEngineCallbacks.start = undefined;
            setTimeout(function () {
                that.synchronize();
            }, 0);
            that.setServiceState(SERVICE_STATE_ENUM.SYNCHRONIZING);
        }
        else {
            that.startVireoRuntime();
        }
    };
    proto.synchronize = function () {
        var that = this, remainingVIsToSync, i;
        that.verifyServiceStateIs(SERVICE_STATE_ENUM.SYNCHRONIZING);
        if (that.ideMode === false) {
            NI_SUPPORT.error('HTML Panel synchronization steps should only be run when inside the editor');
            that.setServiceState(SERVICE_STATE_ENUM.ERROR);
            return;
        }
        // Create list of VIs to sync
        remainingVIsToSync = Object.keys(that.getVIModels());
        // Create property update listener
        that.windowEngineCallbacks.diagramValueChanged = function (argsArr) {
            // Coherent message will identify the control by its C# data item name and a property called 'value'
            // but HTML panel update message needs control to be identified by control ID and a specific property name for each model.
            var viName = argsArr[0], dataItem = argsArr[1], editorRuntimeBindingInfo = that.dataItemCache.getEditorRuntimeBindingInfo(viName, dataItem), controlId = editorRuntimeBindingInfo.controlId, dataJSON = argsArr[2], parsedData = JSON.parse(dataJSON), data = {};
            data[editorRuntimeBindingInfo.prop] = parsedData;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        };
        // create VI panel complete listener
        that.windowEngineCallbacks.finishedSendingUpdates = function (argsArr) {
            var i, viName;
            viName = argsArr[0];
            for (i = 0; i < remainingVIsToSync.length; i = i + 1) {
                if (remainingVIsToSync[i] === viName) {
                    remainingVIsToSync.splice(i, 1);
                    break;
                }
            }
            if (remainingVIsToSync.length === 0) {
                window.engine.off(COHERENT_MESSAGE_ENUM.DIAGRAM_VALUE_CHANGED, that.windowEngineCallbacks.diagramValueChanged);
                window.engine.off(COHERENT_MESSAGE_ENUM.FINISHED_SENDING_UPDATES, that.windowEngineCallbacks.finishedSendingUpdates);
                that.windowEngineCallbacks.diagramValueChanged = undefined;
                that.windowEngineCallbacks.finishedSendingUpdates = undefined;
                that.startVireoRuntime();
            }
        };
        window.engine.on(COHERENT_MESSAGE_ENUM.DIAGRAM_VALUE_CHANGED, that.windowEngineCallbacks.diagramValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.FINISHED_SENDING_UPDATES, that.windowEngineCallbacks.finishedSendingUpdates);
        window.onbeforeunload = function () {
            window.engine.call(COHERENT_MESSAGE_ENUM.NAVIGATION_ATTEMPTED);
        };
        // Send requests for VI updates
        for (i = 0; i < remainingVIsToSync.length; i = i + 1) {
            window.engine.trigger(COHERENT_MESSAGE_ENUM.READY_FOR_UPDATES, remainingVIsToSync[i]);
        }
    };
    proto.startVireoRuntime = function () {
        var that = this;
        that.verifyServiceStateIs([SERVICE_STATE_ENUM.READY, SERVICE_STATE_ENUM.SYNCHRONIZING]);
        if (that.ideMode === true) {
            that.windowEngineCallbacks.abortVI = function () {
                that.stop();
            };
            window.engine.on(COHERENT_MESSAGE_ENUM.ABORT_VI, that.windowEngineCallbacks.abortVI);
        }
        setTimeout(function () {
            that.loadCurrentControlValuesIntoRuntime();
            that.executeVireoRuntime();
            that.scheduleUpdateHTMLControls();
        }, 0);
        that.setServiceState(SERVICE_STATE_ENUM.RUNNING);
        if (that.ideMode === true) {
            window.engine.call(COHERENT_MESSAGE_ENUM.UPDATE_SERVICE_STARTED);
        }
    };
    proto.executeVireoRuntime = function () {
        var that = this;
        var execSlicesResult = 0;
        if (that.checkServiceStateIs(SERVICE_STATE_ENUM.RUNNING)) {
            try {
                execSlicesResult = that.vireo.eggShell.executeSlicesUntilWait(SLICE_SETS_PER_TIME_CHECK, MAXIMUM_VIREO_EXECUTION_TIME_MS);
            }
            catch (ex) {
                if (that.ideMode === true) {
                    window.engine.trigger(COHERENT_MESSAGE_ENUM.LOG_ERROR, ex.toString());
                }
                NI_SUPPORT.error('Vireo Failed to execute: ' + ex.toString());
            }
            if (execSlicesResult > 0) {
                that.vireoTimer = setTimeout(that.executeVireoRuntime.bind(that), execSlicesResult);
            }
            else if (execSlicesResult < 0) {
                that.vireoTimer = setTimeout(that.executeVireoRuntime.bind(that), 0);
            }
            else {
                window.clearTimeout(that.vireoTimer);
                that.vireoTimer = undefined;
                that.stop();
                setTimeout(that.executeVireoRuntime.bind(that), 0);
            }
        }
        else if (that.checkServiceStateIs(SERVICE_STATE_ENUM.STOPPING)) {
            setTimeout(function () {
                that.finishStopping();
            }, 0);
        }
        else {
            NI_SUPPORT.error('Web Application expected to be RUNNING or STOPPING');
            that.setServiceState(SERVICE_STATE_ENUM.ERROR);
        }
    };
    proto.scheduleUpdateHTMLControls = function () {
        var that = this;
        if (that.checkServiceStateIs(SERVICE_STATE_ENUM.RUNNING) === false) {
            return;
        }
        // First schedule reading from controls during each requestAnimationFrame
        // This makes sure we are not reading from controls faster than a frame renders
        requestAnimationFrame(function () {
            that.scheduleUpdateHTMLControls();
        });
        if (that._updateHTMLControlsTimer !== undefined) {
            return;
        }
        // Second we don't want to do the actual work of reading data from vireo in rAF
        // So we schedule the work to run as soon as possible after rAF
        that._updateHTMLControlsTimer = setTimeout(function () {
            that._updateHTMLControlsTimer = undefined;
            if (that.checkServiceStateIs(SERVICE_STATE_ENUM.RUNNING) === false) {
                return;
            }
            that.updateHTMLControls();
        }, 0);
    };
    proto.stop = function () {
        parent.prototype.stop.call(this, SERVICE_STATE_ENUM.RUNNING);
        if (this.ideMode === true) {
            window.engine.off(COHERENT_MESSAGE_ENUM.ABORT_VI, this.windowEngineCallbacks.abortVI);
            this.windowEngineCallbacks.abortVI = undefined;
            window.onbeforeunload = null;
        }
        this.setServiceState(SERVICE_STATE_ENUM.STOPPING);
    };
    proto.finishStopping = function () {
        var that = this;
        this.verifyServiceStateIs(SERVICE_STATE_ENUM.STOPPING);
        // Make sure the latest control values are retrieved before completely stopping
        this.updateHTMLControls();
        if (this.ideMode === true) {
            // Send control values back to editor.
            // TODO: We should probably do this during run, not just at the end of run.
            // This would be necessary for the C# data context to remain up to date so that features
            // like Capture Data work correctly
            this.sendControlValuesToEditor();
            window.engine.trigger(COHERENT_MESSAGE_ENUM.FINISHED_RUNNING, 'Function');
            this.windowEngineCallbacks.start = function () {
                that.start();
            };
            window.engine.on(COHERENT_MESSAGE_ENUM.START, that.windowEngineCallbacks.start);
        }
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    // Functions for service <-> MVVM interconnect
    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue, oldValue) {
        if (this.checkServiceStateIs(SERVICE_STATE_ENUM.RUNNING) === false) {
            return;
        }
        var localBindingInfo = controlModel.getLocalBindingInfo();
        if (controlCanTriggerValueChange(controlModel)) {
            VIREO_POKER.poke(this.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath, newValue);
        }
        if (controlCanTriggerEvent(controlModel)) {
            var eventOracleIndex = this.eventRegistrationService.getEventOracleIndex(controlModel);
            if (this.eventRegistrationService.isControlRegisteredForEvent(localBindingInfo.encodedVIName, eventOracleIndex, NationalInstruments.HtmlVI.EventIds.ValueChanged)) {
                var typeValueRef = this.vireo.eggShell.findValueRef(localBindingInfo.encodedVIName, "valueChangedEventData" + localBindingInfo.dataItem);
                var eventData = { "Old Value": oldValue, "New Value": newValue };
                this.vireo.eventHelpers.occurEvent(eventOracleIndex, controlModel.niControlId, NationalInstruments.HtmlVI.EventIds.ValueChanged, this.eventDataWriter, typeValueRef, eventData);
            }
        }
    };
    // Called by the WebAppModel
    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        var data = {};
        data[eventName] = eventData;
        if (this.ideMode === true) {
            window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_INTERNAL_EVENT, viModel.viName, controlModel.niControlId, JSON.stringify(data));
        }
    };
    proto.sendControlValuesToEditor = function () {
        forEachControlModelInEachVIModel(this.getVIModels(), function (viModel, controlModel) {
            var data, hbType, bindingInfo = controlModel.getEditorRuntimeBindingInfo();
            // Currently we only send messages to the editor when values change on the page, not any other property.
            // Eventually we may want to send messages if the user changes other properties (e.g. by editing min/max in place)
            if (bindingInfo !== undefined && bindingInfo.dataItem !== undefined && bindingInfo.prop !== undefined &&
                bindingInfo.dataItem !== '' && bindingInfo.prop !== '') {
                if (controlModel.hasOwnProperty('historyBuffer')) {
                    data = controlModel.historyBuffer.toJSON();
                    hbType = controlModel.getHistoryBufferInnerType(controlModel.niType, data.width);
                    data.data = EDITOR_ADAPTERS.jsModelToEditor(data.data, hbType);
                }
                else {
                    data = controlModel[bindingInfo.prop];
                    if (controlModel.propertyUsesNITypeProperty(bindingInfo.prop)) {
                        data = EDITOR_ADAPTERS.jsModelToEditor(data, controlModel.niType);
                    }
                }
                window.engine.trigger(COHERENT_MESSAGE_ENUM.PANEL_CONTROL_CHANGED, viModel.viName, bindingInfo.dataItem, JSON.stringify(data));
            }
        });
    };
    proto.loadCurrentControlValuesIntoRuntime = function () {
        var that = this;
        forEachControlModelInEachVIModel(that.getVIModels(), function (viModel, controlModel) {
            var data, localBindingInfo = controlModel.getLocalBindingInfo();
            if (controlModel.isTopLevelAndPlacedAndEnabled()) {
                data = controlModel[localBindingInfo.prop];
                if (data !== undefined) {
                    VIREO_POKER.poke(that.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath, data);
                }
            }
        });
    };
    proto.updateHTMLControls = function () {
        var that = this;
        forEachControlModelInEachVIModel(that.getVIModels(), function (viModel, controlModel) {
            var messageData, peekResult, localBindingInfo = controlModel.getLocalBindingInfo();
            if (controlAcceptsDiagramUpdates(controlModel) && localBindingInfo.sync === false) {
                messageData = {};
                peekResult = VIREO_PEEKER.peek(that.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath);
                messageData[localBindingInfo.prop] = peekResult;
                that.dispatchMessageToHTMLPanel(viModel.viName, controlModel.niControlId, messageData);
            }
        });
    };
    /* Tries to find a html control given a front-panel id (Data item) and returns an
     * object containing its localBindingInfo, owner viName, and controlId.
     * @param {string} fpId - Front panel id (Data Item)
     */
    proto.findSyncHTMLControl = function (fpId) {
        return forEachControlModelInEachVIModel(this.getVIModels(), function (viModel, controlModel) {
            var localBindingInfo = controlModel.getLocalBindingInfo();
            if (controlAcceptsDiagramUpdates(controlModel) && localBindingInfo.dataItem === fpId && localBindingInfo.sync === true) {
                return {
                    localBindingInfo: localBindingInfo,
                    viName: viModel.viName,
                    controlId: controlModel.niControlId
                };
            }
            return undefined;
        });
    };
    proto.updateSyncHTMLControl = function (fpId) {
        var localBindingInfo, viName, controlId, messageData, peekResult, additionalErrorInfo;
        if (this.syncControlsCache[fpId] === undefined) {
            this.syncControlsCache[fpId] = this.findSyncHTMLControl(fpId);
        }
        if (this.syncControlsCache[fpId] !== undefined) {
            localBindingInfo = this.syncControlsCache[fpId].localBindingInfo;
            viName = this.syncControlsCache[fpId].viName;
            controlId = this.syncControlsCache[fpId].controlId;
            messageData = {};
            peekResult = VIREO_PEEKER.peek(this.vireo, localBindingInfo.encodedVIName, localBindingInfo.runtimePath);
            messageData[localBindingInfo.prop] = peekResult;
            this.dispatchMessageToHTMLPanel(viName, controlId, messageData);
        }
        else {
            additionalErrorInfo = getControlDebuggingInfo(fpId, this.getVIModels());
            NI_SUPPORT.error('Trying to update synchronous control with data item id ' + fpId + ' but failed to locate control. ' + additionalErrorInfo);
        }
    };
    /**
     * Sets the property of control model to the given value.
     * @param {string} viName - The name of VI.
     * @param {string} controlId - The control ID.
     * @param {string} gPropertyName - Name of property to be updated.
     * @param {string/number} gPropertyValue - Value of property.
     * @throws will throw if the VI, control or property is not found.
     */
    proto.setGPropertyValue = function (viName, controlId, gPropertyName, gPropertyValue) {
        var that = this;
        var viModels = that.getVIModels();
        var viModel = viModels[viName];
        if (viModel !== undefined) {
            viModel.processControlUpdateToSetGPropertyValue(controlId, gPropertyName, gPropertyValue);
        }
        else {
            throw new Error('No VI found with name: ' + viName + ' to send control property update');
        }
    };
    /**
     * Gets the value of property of control.
     * @param {string} viName - The name of VI.
     * @param {string} controlId - The control ID.
     * @param {string} gPropertyName - Property name for which value is to be returned.
     * @returns {string/number} value of property.
     * @throws will throw if the VI, control or property is not found.
     */
    proto.getGPropertyValue = function (viName, controlId, gPropertyName) {
        var that = this;
        var viModels = that.getVIModels();
        var viModel = viModels[viName];
        if (viModel !== undefined) {
            return viModel.processControlUpdateToGetGPropertyValue(controlId, gPropertyName);
        }
        else {
            throw new Error('No VI found with name: ' + viName + ' to get control property value');
        }
    };
}(NationalInstruments.HtmlVI.UpdateService));
//# sourceMappingURL=niLocalUpdateService.js.map