"use strict";
//**********************************************************
// Service that handles interaction with the LabVIEW Editor
// National Instruments Copyright 2014
//**********************************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;
    // Constructor Function
    NationalInstruments.HtmlVI.EditorUpdateService = function () {
        parent.call(this);
        // Public Instance Properties
        // References to callbacks registered to coherent so they can be unregistered later
        this.windowEngineCallbacks = {
            propertyChange: undefined,
            propertyChangeMultiple: undefined,
            addElement: undefined,
            addOrUpdateHtmlElement: undefined,
            removeElement: undefined,
            userInteractionChanged: undefined,
            setPanelPosition: undefined
        };
        this.keyEventHandler = {
            undoRedo: undefined
        };
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.EditorUpdateService.StateEnum = Object.freeze(Object.assign({
        INITIALIZING: 'INITIALIZING',
        LISTENING: 'LISTENING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));
    NationalInstruments.HtmlVI.EditorUpdateService.CoherentMessagesEnum = Object.freeze({
        PROPERTY_CHANGE: 'PropertyChange',
        PROPERTY_CHANGE_MULTIPLE: 'PropertyChangeMultiple',
        ADD_ELEMENT: 'AddElement',
        ADD_OR_UPDATE_HTML_ELEMENT: 'AddOrUpdateHtmlElement',
        REMOVE_ELEMENT: 'RemoveElement',
        PROCESS_MODEL_UPDATE: 'ProcessModelUpdate',
        PROCESS_INTERNAL_EVENT: 'ProcessInternalEvent',
        BOUNDS_UPDATE: 'BoundsUpdate',
        DOCUMENT_READY: 'DocumentReady',
        UPDATE_SERVICE_STARTED: 'UpdateServiceStarted',
        USERINTERACTION_CHANGED: 'UserInteractionChanged',
        SET_PANEL_POSITION: 'SetPanelPosition'
    });
    NationalInstruments.HtmlVI.EditorUpdateService.UserInteractionState = Object.freeze({
        START: 'start',
        END: 'end',
        ATOMICACTIONCOMPLETE: 'atomicactioncomplete'
    });
    NationalInstruments.HtmlVI.EditorUpdateService.InteractiveOperationKind = Object.freeze({
        CREATE: 'create',
        MOVE: 'move',
        RESIZE: 'resize'
    });
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.EditorUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.StateEnum;
    var COHERENT_MESSAGE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.CoherentMessagesEnum;
    var USER_INTERACTION_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.UserInteractionState;
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
    proto.initialize = function () {
        parent.prototype.initialize.call(this, SERVICE_STATE_ENUM.UNINITIALIZED, undefined);
        this.setServiceState(SERVICE_STATE_ENUM.INITIALIZING);
    };
    proto.finishInitializing = function () {
        parent.prototype.finishInitializing.call(this, SERVICE_STATE_ENUM.INITIALIZING);
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    proto.start = function () {
        parent.prototype.start.call(this, SERVICE_STATE_ENUM.READY);
        var that = this;
        NI_SUPPORT.logVerbose('niEditorUpdateService start()');
        that.windowEngineCallbacks.propertyChange = function (argsArr) {
            var viName = argsArr[0], controlId = argsArr[1], dataJSON = argsArr[2], data;
            data = JSON.parse(dataJSON);
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        };
        that.windowEngineCallbacks.propertyChangeMultiple = function (argsArr) {
            var viName = argsArr[0], controlIdsJSON = argsArr[1], dataValuesJSON = argsArr[2], controlIds = JSON.parse(controlIdsJSON), dataValues = JSON.parse(dataValuesJSON), i;
            for (i = 0; i < controlIds.length; i++) {
                that.dispatchMessageToHTMLPanel(viName, controlIds[i], dataValues[i], EDITOR_ADAPTERS.editorToJsModel);
            }
        };
        // NOTE: If changes are made to this function, make sure to run the Reparenting Regression Test prior to submission: https://nitalk.jiveon.com/docs/DOC-358124
        that.windowEngineCallbacks.addElement = function (argsArr) {
            var modelSettingsJSON = argsArr[0], modelSettings = JSON.parse(modelSettingsJSON), modelMetadata = {};
            // TODO mraj the C# code should be modified to emit the correct viRef
            modelSettings.viRef = '';
            // TODO mraj refactoring so modelSettings is strictly properties used by the JavaScript models and modelMetadata is everything else
            // ideally the C# side would be modified to reflect these assumptions
            modelMetadata = {
                parentId: argsArr[1],
                nextModelId: argsArr[2],
                initialLoad: argsArr[3],
                modelAttached: true,
                extras: undefined,
                kind: undefined
            };
            modelMetadata.extras = modelSettings.extras;
            modelMetadata.kind = modelSettings.kind;
            delete modelSettings.extras;
            delete modelSettings.kind;
            NI_SUPPORT.infoVerbose('add Element (editor) ' + modelMetadata.kind + '(' + modelSettings.niControlId + ') ' + modelSettings + ' ' + modelMetadata);
            // TODO mraj modelKindToTagName only works when a model has a 1 to 1 mapping to an element. In the future seetings needs to explicitly include a tagName
            var tagName = NationalInstruments.HtmlVI.NIModelProvider.modelKindToTagName(modelMetadata.kind);
            var resultElements = NationalInstruments.HtmlVI.UpdateService.createNIControlToAddToDOM(modelSettings, tagName, modelSettings.niControlId, modelSettings.viRef, modelMetadata.parentId);
            var viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(modelSettings.viRef);
            if (viViewModel.isUserInteracting(modelSettings.niControlId)) {
                resultElements.controlElement.classList.add('ni-is-being-dragged');
                if (resultElements.parentElement.tagName.toLowerCase() === 'ni-flexible-layout-component') {
                    resultElements.parentElement.classList.add('ni-is-being-dragged');
                }
            }
            resultElements.controlElement._modelMetadata = modelMetadata;
            var key;
            for (key in modelMetadata.extras) {
                if (modelMetadata.extras.hasOwnProperty(key)) {
                    resultElements.controlElement.setAttribute(key, modelMetadata.extras[key]);
                }
            }
            var insertBeforeNode;
            if (modelMetadata.nextModelId !== '') {
                insertBeforeNode = NI_SUPPORT.queryControlByNIControlId(modelSettings.viRef, modelMetadata.nextModelId);
                if (insertBeforeNode === null) {
                    NI_SUPPORT.errorVerbose('Attempting to insert new element id (' + modelSettings.niControlId + ') next to existing element id (' + modelMetadata.nextModelId + ') but the existing element cannot be found. Ignoring nextModelId and adding as child of parent.');
                    insertBeforeNode = undefined;
                }
            }
            if (resultElements.parentElement === undefined) {
                throw new Error('A child element was added to the DOM before its parent. ParentId: ' + modelMetadata.parentId + '. child to add: ' + modelSettings);
            }
            else {
                if (insertBeforeNode !== undefined) {
                    resultElements.parentElement.insertBefore(resultElements.controlElement, insertBeforeNode);
                }
                else {
                    resultElements.parentElement.appendChild(resultElements.controlElement);
                }
            }
            that.boundsUpdateEventService.onElementAdded(resultElements.controlElement, modelSettings.niControlId);
        };
        that.windowEngineCallbacks.addOrUpdateHtmlElement = function (argsArr) {
            var viName = argsArr[0], modelSettings = JSON.parse(argsArr[1]), generatedItemParentId = argsArr[2], initialLoad = argsArr[3];
            var existingControl = NI_SUPPORT.queryControlByNIControlId('', modelSettings.niControlId);
            if (existingControl === null) {
                var elementArgsArr = [argsArr[1], generatedItemParentId, '', initialLoad];
                that.windowEngineCallbacks.addElement(elementArgsArr);
            }
            else {
                delete modelSettings['kind'];
                that.dispatchMessageToHTMLPanel(viName, modelSettings.niControlId, modelSettings, EDITOR_ADAPTERS.editorToJsModel);
            }
        };
        // NOTE: If changes are made to this function, make sure to run the Reparenting Regression Test prior to submission: https://nitalk.jiveon.com/docs/DOC-358124
        that.windowEngineCallbacks.removeElement = function (argsArr) {
            var controlId = argsArr[0], modelAttached = argsArr[1], viRef = '', resultElements;
            NI_SUPPORT.infoVerbose('remove Element (editor)' + controlId + ' ' + argsArr);
            var precheckElement = NI_SUPPORT.queryControlByNIControlId(viRef, controlId);
            if (precheckElement === null) {
                NI_SUPPORT.errorVerbose('Attempted to remove an element with niControlId(' + controlId + ') but it could not be found. It is known that numerics are incorrectly removed multiple times, but if it was a different control this needs to be debugged further.');
                return;
            }
            resultElements = NationalInstruments.HtmlVI.UpdateService.findNIControlToRemoveFromDOM(controlId, viRef);
            resultElements.controlElement._modelMetadata.modelAttached = modelAttached;
            var parentNode = resultElements.controlElement.parentNode;
            parentNode.removeChild(resultElements.controlElement);
            that.boundsUpdateEventService.onElementRemoved(controlId);
        };
        that.windowEngineCallbacks.userInteractionChanged = function (argsArr) {
            var viName = argsArr[0], controlId = argsArr[1], operationKind = argsArr[2], state = argsArr[3], viModel, controlViewModel;
            viModel = that.getVIModels()[viName];
            controlViewModel = viModel.getControlViewModel(controlId);
            var viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(viModel.viRef);
            if (state === USER_INTERACTION_STATE_ENUM.START) {
                viViewModel.setUserInteracting(controlId);
            }
            else if (state === USER_INTERACTION_STATE_ENUM.END) {
                viViewModel.clearUserInteracting(controlId);
            }
            if (state !== USER_INTERACTION_STATE_ENUM.ATOMICACTIONCOMPLETE) {
                that.boundsUpdateEventService.requestSendElementBounds();
            }
            var frontPanelViewModel = viModel.getControlViewModel(NationalInstruments.HtmlVI.Models.FrontPanelModel.FrontPanelId);
            frontPanelViewModel.userInteractionChanged(state, operationKind);
            // Is possible that a VisualComponentViewModel receives this event.
            // But it cannot handle it. Shall we move userInteractionChanged to VisualComponent?
            if (controlViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualViewModel) {
                controlViewModel.userInteractionChanged(state, operationKind);
            }
        };
        that.windowEngineCallbacks.setPanelPosition = function (argsArr) {
            var position = JSON.parse(argsArr[0]), left = position[0], top = position[1], notifyOnComplete = argsArr[1], frontPanel;
            frontPanel = NationalInstruments.HtmlVI.UpdateService.getFrontPanelElement();
            let leftInPixels = `${left}px`;
            let topInPixels = `${top}px`;
            if (frontPanel === document.body) {
                return; // Do nothing if we have no front panel section
            }
            // TODO : US195693
            var frontPanelModel = viModel.getControlModel(NationalInstruments.HtmlVI.Models.FrontPanelModel.FrontPanelId);
            if (frontPanelModel !== undefined) {
                frontPanelModel.top = topInPixels;
                frontPanelModel.left = leftInPixels;
            }
            window.requestAnimationFrame(function () {
                frontPanel.style.left = leftInPixels;
                frontPanel.style.top = topInPixels;
                if (notifyOnComplete) {
                    window.requestAnimationFrame(function () {
                        window.engine.trigger('SetPanelPositionComplete');
                    });
                }
            });
        };
        // All the key events reach both C# and js.
        // For things like backspace/delete/Ctrl+A/Ctrl+V/Ctrl+X/Ctrl+C, the Html controls need these events.
        // So we block these events in C# side let the browser consume these events when an editable control is focused.
        // But for Ctrl+z/Ctrl+y/Ctrl+Shift+Z events, we never want html to handle them.
        // The C# side transaction manager will handle the undo/redo when we are not editing controls.
        // So we capture and discard the defaut undo/redo event in browser side.
        that.keyEventHandler.undoRedo = function (event) {
            // The keycode property has been deprecated and we should use key property instead.
            // but the Coherent doesn't support key property.
            // default undo key combination
            if ((event.ctrlKey && (event.keyCode === 90 || event.key === 'z')) ||
                // default redo key combination
                (event.ctrlKey && (event.keyCode === 89 || event.key === 'y')) ||
                // default redo key combination
                (event.ctrlKey && event.shiftKey && (event.keyCode === 90 || event.key === 'z'))) {
                event.preventDefault();
                event.stopPropagation();
            }
        };
        window.engine.on(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE, that.windowEngineCallbacks.propertyChange);
        window.engine.on(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE_MULTIPLE, that.windowEngineCallbacks.propertyChangeMultiple);
        window.engine.on(COHERENT_MESSAGE_ENUM.ADD_ELEMENT, that.windowEngineCallbacks.addElement);
        window.engine.on(COHERENT_MESSAGE_ENUM.ADD_OR_UPDATE_HTML_ELEMENT, that.windowEngineCallbacks.addOrUpdateHtmlElement);
        window.engine.on(COHERENT_MESSAGE_ENUM.REMOVE_ELEMENT, that.windowEngineCallbacks.removeElement);
        window.engine.on(COHERENT_MESSAGE_ENUM.USERINTERACTION_CHANGED, that.windowEngineCallbacks.userInteractionChanged);
        window.engine.on(COHERENT_MESSAGE_ENUM.SET_PANEL_POSITION, that.windowEngineCallbacks.setPanelPosition);
        var viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef('');
        var viModel = viViewModel.model;
        var frontPanelViewModel = viModel.getControlViewModel(NationalInstruments.HtmlVI.Models.FrontPanelModel.FrontPanelId);
        that.boundsUpdateEventService = new NationalInstruments.HtmlVI.Framework.NIBoundsUpdateEventService(frontPanelViewModel, (eventDataJson) => window.engine.trigger(COHERENT_MESSAGE_ENUM.BOUNDS_UPDATE, eventDataJson));
        document.addEventListener('keydown', that.keyEventHandler.undoRedo, true);
        NI_SUPPORT.logVerbose('niEditorUpdateService start() document ready');
        window.engine.call(COHERENT_MESSAGE_ENUM.DOCUMENT_READY);
        NI_SUPPORT.logVerbose('niEditorUpdateService start() update service starting');
        window.engine.call(COHERENT_MESSAGE_ENUM.UPDATE_SERVICE_STARTED);
        that.setServiceState(SERVICE_STATE_ENUM.LISTENING);
    };
    proto.stop = function () {
        parent.prototype.stop.call(this, SERVICE_STATE_ENUM.LISTENING);
        window.engine.off(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE, this.windowEngineCallbacks.propertyChange);
        window.engine.off(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE_MULTIPLE, this.windowEngineCallbacks.propertyChangeMultiple);
        window.engine.off(COHERENT_MESSAGE_ENUM.ADD_ELEMENT, this.windowEngineCallbacks.addElement);
        window.engine.off(COHERENT_MESSAGE_ENUM.ADD_OR_UPDATE_HTML_ELEMENT, this.windowEngineCallbacks.addOrUpdateHtmlElement);
        window.engine.off(COHERENT_MESSAGE_ENUM.REMOVE_ELEMENT, this.windowEngineCallbacks.removeElement);
        window.engine.off(COHERENT_MESSAGE_ENUM.USERINTERACTION_CHANGED, this.windowEngineCallbacks.userInteractionChanged);
        window.engine.off(COHERENT_MESSAGE_ENUM.SET_PANEL_POSITION, this.windowEngineCallbacks.setPanelPosition);
        document.removeEventListener('keydown', this.keyEventHandler.undoRedo, true);
        this.windowEngineCallbacks.propertyChange = undefined;
        this.windowEngineCallbacks.propertyChangeMultiple = undefined;
        this.windowEngineCallbacks.addElement = undefined;
        this.windowEngineCallbacks.addOrUpdateHtmlElement = undefined;
        this.windowEngineCallbacks.removeElement = undefined;
        this.windowEngineCallbacks.userInteractionChanged = undefined;
        this.windowEngineCallbacks.setPanelPosition = undefined;
        this.keyEventHandler.undoRedo = undefined;
        this.boundsUpdateEventService = undefined;
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    // Called by the WebAppModel
    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        var data = {};
        data[eventName] = eventData;
        // TODO mraj should check update service state before triggering event
        window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_INTERNAL_EVENT, viModel.viName, controlModel.niControlId, JSON.stringify(data));
    };
    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue, oldValue) {
        var topLevelControl, topLevelControlValue, topLevelControlValueJSON;
        if (controlModel.bindingInfo.prop === propertyName) {
            topLevelControl = controlModel.findTopLevelControl();
            topLevelControlValue = topLevelControl[topLevelControl.bindingInfo.prop];
            if (topLevelControl.propertyUsesNITypeProperty(topLevelControl.bindingInfo.prop)) {
                topLevelControlValue = EDITOR_ADAPTERS.jsModelToEditor(topLevelControlValue, topLevelControl.niType);
            }
            topLevelControlValueJSON = JSON.stringify(topLevelControlValue);
            // TODO mraj should check update service state before triggering event
            window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_MODEL_UPDATE, viModel.viName, topLevelControl.niControlId, topLevelControlValueJSON);
        }
    };
    proto.requestSendControlBounds = function () {
        this.boundsUpdateEventService.requestSendElementBounds();
    };
}(NationalInstruments.HtmlVI.UpdateService));
//# sourceMappingURL=niEditorUpdateService.js.map