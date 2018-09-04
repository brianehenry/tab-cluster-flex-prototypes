"use strict";
//**********************************************************
// Service that handles interaction to a running non-Vireo VI in the editor
// National Instruments Copyright 2015
//**********************************************************
(function (parent) {
    'use strict';
    /* global browserMessaging:false */
    /* global flatbuffers:false */
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;
    // Constructor Function
    NationalInstruments.HtmlVI.EditorRuntimeUpdateService = function () {
        parent.call(this);
        // Public Instance Properties
        this.dataItemCache = undefined;
        this.enableEvents = true;
        this.windowEngineCallbacks = {
            diagramValueChanged: undefined,
            doubleValueChanged: undefined,
            booleanValueChanged: undefined,
            stringValueChanged: undefined,
            doubleArrayValueChanged: undefined,
            batchUpdate: undefined
        };
        // Private Instance Properties
        this.responseArrays = {};
        this.responseBuffers = {};
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.EditorRuntimeUpdateService.StateEnum = Object.freeze(Object.assign({
        INITIALIZING: 'INITIALIZING',
        LISTENING: 'LISTENING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));
    NationalInstruments.HtmlVI.EditorRuntimeUpdateService.CoherentMessagesEnum = Object.freeze({
        READY_FOR_UPDATES: 'ReadyForUpdates',
        PANEL_CONTROL_CHANGED: 'PanelControlChanged',
        DIAGRAM_VALUE_CHANGED: 'DiagramValueChanged',
        DOUBLE_VALUE_CHANGED: 'doubleValueChanged',
        BOOLEAN_VALUE_CHANGED: 'booleanValueChanged',
        STRING_VALUE_CHANGED: 'stringValueChanged',
        DOUBLE_ARRAY_VALUE_CHANGED: 'doubleArrayValueChanged',
        DOCUMENT_READY: 'DocumentReady',
        UPDATE_SERVICE_STARTED: 'UpdateServiceStarted',
        PANEL_CONTROL_EVENT_OCCURRED: 'PanelControlEventOccurred',
        PROCESS_INTERNAL_EVENT: 'ProcessInternalEvent',
        NAVIGATION_ATTEMPTED: 'NavigationAttempted',
        SET_CALL_RESPONSE: 'setCallResponse',
        BATCH_UPDATE: 'batchUpdate',
        UPDATE_FROM_PACKED_DATA: 'UpdateFromPackedData',
        SET_GPROPERTY_PROPERTY_VALUE: 'setGPropertyValue',
        GET_GPROPERTY_PROPERTY_VALUE: 'getGPropertyValue'
    });
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.EditorRuntimeUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.EditorRuntimeUpdateService.StateEnum;
    var INIT_TASKS_ENUM = NationalInstruments.HtmlVI.EditorRuntimeUpdateService.InitTasksEnum;
    var COHERENT_MESSAGE_ENUM = NationalInstruments.HtmlVI.EditorRuntimeUpdateService.CoherentMessagesEnum;
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.isValidServiceState = function (state) {
        // Child states merged with parent states so only need to check child
        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    };
    proto.isInIdeMode = function () {
        return true;
    };
    // Functions for state transitions
    proto.initialize = function () {
        parent.prototype.initialize.call(this, SERVICE_STATE_ENUM.UNINITIALIZED, INIT_TASKS_ENUM);
        this.setServiceState(SERVICE_STATE_ENUM.INITIALIZING);
    };
    proto.finishInitializing = function () {
        parent.prototype.finishInitializing.call(this, SERVICE_STATE_ENUM.INITIALIZING);
        this.dataItemCache = new NationalInstruments.HtmlVI.ControlDataItemCache(this.getVIModels());
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    proto.start = function () {
        parent.prototype.start.call(this, SERVICE_STATE_ENUM.READY);
        var that = this;
        that.windowEngineCallbacks.diagramValueChanged = function (argsArr) {
            // Coherent message will identify the control by its C# data item name and a property called 'value'
            // but HTML panel update message needs control to be identified by control ID and a specific property name for each model.
            var viName = argsArr[0], dataItem = argsArr[1], editorRuntimeBindingInfo = that.dataItemCache.getEditorRuntimeBindingInfo(viName, dataItem), controlId = editorRuntimeBindingInfo.controlId, dataJSON = argsArr[2], parsedData = JSON.parse(dataJSON), data = {};
            data[editorRuntimeBindingInfo.prop] = parsedData;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        };
        that.windowEngineCallbacks.doubleValueChanged = function (argsArr) {
            var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
            data["value"] = newValue;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
            if (cookie !== 0) {
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            }
        };
        that.windowEngineCallbacks.booleanValueChanged = function (argsArr) {
            var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
            data["value"] = newValue;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
            if (cookie !== 0) {
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            }
        };
        that.windowEngineCallbacks.stringValueChanged = function (argsArr) {
            var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
            data["text"] = newValue;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
            if (cookie !== 0) {
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            }
        };
        that.windowEngineCallbacks.doubleArrayValueChanged = function (argsArr) {
            var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValueKey = argsArr[3], newValueName = argsArr[4], data = {};
            let response = that.responseArrays[newValueKey];
            let buffer = that.responseBuffers[newValueKey];
            if (buffer === undefined) {
                buffer = [];
                that.responseBuffers[newValueKey] = buffer;
            }
            response = browserMessaging.getSharedData(newValueKey, newValueName, response);
            that.responseArrays[newValueKey] = response;
            var view = new Float64Array(response);
            var length = view.length;
            for (let x = 0; x < length; x += 1) {
                buffer[x] = view[x];
            }
            data["value"] = buffer;
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
            if (cookie !== 0) {
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            }
        };
        that.windowEngineCallbacks.UpdateFromPackedData = function (args) {
            window.requestAnimationFrame(() => {
                let cookie = args[0];
                try {
                    let viName = args[1];
                    let controlId = args[2];
                    let position = args[3];
                    let length = args[4];
                    let newValueKey = args[5];
                    let newValueName = args[6];
                    let response = browserMessaging.getSharedData(newValueKey, newValueName);
                    let view = new Uint8Array(response, position - 8, length - position);
                    let data = {};
                    data["value"] = view;
                    that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.packedDataToJsModel);
                }
                catch (error) {
                    if (cookie !== 0) {
                        window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
                    }
                    throw error;
                }
                if (cookie !== 0) {
                    window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
                }
            });
        };
        that.windowEngineCallbacks.batchUpdate = function (args) {
            window.requestAnimationFrame(() => {
                let cookie = args[0];
                let position = args[1];
                let length = args[2];
                let newValueKey = args[3];
                let newValueName = args[4];
                let response = browserMessaging.getSharedData(newValueKey, newValueName);
                let view = new Uint8Array(response, position - 8, length - position);
                let buffer = new flatbuffers.ByteBuffer(view);
                let batch = NationalInstruments.Web.Interop.Batch.getRootAsBatch(buffer);
                let numItems = batch.itemsLength();
                try {
                    for (let x = 0; x < numItems; ++x) {
                        let batchItem = batch.items(x);
                        let name = batchItem.callName();
                        let json = batchItem.callJson();
                        let parameters = JSON.parse(json);
                        if (name === "booleanValueChanged") {
                            that.windowEngineCallbacks.booleanValueChanged(parameters);
                        }
                        else if (name === "doubleValueChanged") {
                            that.windowEngineCallbacks.doubleValueChanged(parameters);
                        }
                        else if (name === "stringValueChanged") {
                            that.windowEngineCallbacks.stringValueChanged(parameters);
                        }
                        else if (name === "doubleArrayValueChanged") {
                            that.windowEngineCallbacks.doubleArrayValueChanged(parameters);
                        }
                    }
                }
                catch (error) {
                    if (cookie !== 0) {
                        window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
                    }
                    throw error;
                }
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            });
        };
        that.windowEngineCallbacks.setGPropertyValue = function (argsArr) {
            let cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], gPropertyName = argsArr[3], gPropertyValue = argsArr[4];
            let viModels = that.getVIModels();
            let viModel = viModels[viName];
            if (viModel !== undefined) {
                viModel.processControlUpdateToSetGPropertyValue(controlId, gPropertyName, gPropertyValue);
            }
            else {
                throw new Error('No VI found with name: ' + viName + ' to send control property update');
            }
            if (cookie !== 0) {
                window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, 1);
            }
        };
        that.windowEngineCallbacks.getGPropertyValue = function (argsArr) {
            let cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], gPropertyName = argsArr[3];
            let viModels = that.getVIModels();
            let viModel = viModels[viName];
            let result = {};
            if (viModel !== undefined) {
                result = viModel.processControlUpdateToGetGPropertyValue(controlId, gPropertyName);
            }
            else {
                throw new Error('No VI found with name: ' + viName + ' to get control property value');
            }
            window.engine.trigger(COHERENT_MESSAGE_ENUM.SET_CALL_RESPONSE, cookie, result);
        };
        window.engine.on(COHERENT_MESSAGE_ENUM.DIAGRAM_VALUE_CHANGED, that.windowEngineCallbacks.diagramValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.DOUBLE_VALUE_CHANGED, that.windowEngineCallbacks.doubleValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.BOOLEAN_VALUE_CHANGED, that.windowEngineCallbacks.booleanValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.STRING_VALUE_CHANGED, that.windowEngineCallbacks.stringValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.DOUBLE_ARRAY_VALUE_CHANGED, that.windowEngineCallbacks.doubleArrayValueChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.BATCH_UPDATE, that.windowEngineCallbacks.batchUpdate);
        window.engine.on(COHERENT_MESSAGE_ENUM.UPDATE_FROM_PACKED_DATA, that.windowEngineCallbacks.UpdateFromPackedData);
        window.engine.on(COHERENT_MESSAGE_ENUM.SET_GPROPERTY_PROPERTY_VALUE, that.windowEngineCallbacks.setGPropertyValue);
        window.engine.on(COHERENT_MESSAGE_ENUM.GET_GPROPERTY_PROPERTY_VALUE, that.windowEngineCallbacks.getGPropertyValue);
        window.onbeforeunload = function () {
            window.engine.call(COHERENT_MESSAGE_ENUM.NAVIGATION_ATTEMPTED);
        };
        window.engine.call(COHERENT_MESSAGE_ENUM.DOCUMENT_READY);
        // Send requests for VI updates
        var i, visToSync;
        visToSync = Object.keys(that.getVIModels());
        for (i = 0; i < visToSync.length; i = i + 1) {
            window.engine.trigger(COHERENT_MESSAGE_ENUM.READY_FOR_UPDATES, visToSync[i]);
        }
        window.engine.call(COHERENT_MESSAGE_ENUM.UPDATE_SERVICE_STARTED);
        that.setServiceState(SERVICE_STATE_ENUM.LISTENING);
    };
    proto.stop = function () {
        parent.prototype.stop.call(this, SERVICE_STATE_ENUM.LISTENING);
        window.engine.off(COHERENT_MESSAGE_ENUM.DIAGRAM_VALUE_CHANGED, this.windowEngineCallbacks.diagramValueChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.DOUBLE_VALUE_CHANGED, this.windowEngineCallbacks.doubleValueChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.BOOLEAN_VALUE_CHANGED, this.windowEngineCallbacks.booleanValueChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.STRING_VALUE_CHANGED, this.windowEngineCallbacks.stringValueChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.DOUBLE_ARRAY_VALUE_CHANGED, this.windowEngineCallbacks.doubleArrayValueChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.BATCH_UPDATE, this.windowEngineCallbacks.batchUpdate);
        window.engine.off(COHERENT_MESSAGE_ENUM.UPDATE_FROM_PACKED_DATA, this.windowEngineCallbacks.UpdateFromPackedData);
        window.engine.off(COHERENT_MESSAGE_ENUM.SET_GPROPERTY_PROPERTY_VALUE, this.windowEngineCallbacks.setGPropertyValue);
        window.engine.off(COHERENT_MESSAGE_ENUM.GET_GPROPERTY_PROPERTY_VALUE, this.windowEngineCallbacks.getGPropertyValue);
        window.onbeforeunload = null;
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue, oldValue) {
        // Currently we only send messages to the editor when values change on the page, not any other property.
        // Eventually we may want to send messages if the user changes other properties (e.g. by editing min/max in place)
        if (controlModel.bindingInfo.prop === propertyName && controlModel.bindingInfo.dataItem !== '') {
            controlModel = controlModel.findTopLevelControl();
            newValue = controlModel[controlModel.bindingInfo.prop];
            if (controlModel.propertyUsesNITypeProperty(controlModel.bindingInfo.prop)) {
                newValue = EDITOR_ADAPTERS.jsModelToEditor(newValue, controlModel.niType);
            }
            window.engine.trigger(COHERENT_MESSAGE_ENUM.PANEL_CONTROL_CHANGED, viModel.viName, controlModel.bindingInfo.dataItem, JSON.stringify(newValue));
        }
    };
    // Called by the WebAppModel
    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        var data = {};
        data[eventName] = eventData;
        window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_INTERNAL_EVENT, viModel.viName, controlModel.niControlId, JSON.stringify(data));
    };
    // Called by the WebAppModel
    proto.controlEventOccurred = function (viModel, controlModel, eventType, eventData) {
        controlModel = controlModel.findTopLevelControl();
        var modelIdentifier = controlModel.getEditorRuntimeBindingInfo().controlId;
        window.engine.trigger(COHERENT_MESSAGE_ENUM.PANEL_CONTROL_EVENT_OCCURRED, viModel.viName, modelIdentifier, eventType, JSON.stringify(eventData));
    };
}(NationalInstruments.HtmlVI.UpdateService));
//# sourceMappingURL=niEditorRuntimeUpdateService.js.map