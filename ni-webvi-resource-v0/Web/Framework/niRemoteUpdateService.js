"use strict";
//**********************************************************
// Service that handles interaction with a Remote source
// National Instruments Copyright 2015
//**********************************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;
    // Constructor Function
    NationalInstruments.HtmlVI.RemoteUpdateService = function (config) {
        parent.call(this);
        // Public Instance Properties
        this.remoteAddress = config.remoteAddress;
        this.dcoIndexCache = undefined;
        this.enableEvents = true;
        this.socket = undefined;
        this.preferredVersion = {
            majorVersion: 0,
            minorVersion: 1,
            patchVersion: 0,
            preReleaseVersion: 'preAlpha',
            versionMetadata: 'testMetadata'
        };
        this.serverVersion = {
            majorVersion: undefined,
            minorVersion: undefined,
            patchVersion: undefined,
            preReleaseVersion: undefined,
            versionMetadata: undefined
        };
        this.socketCallbacks = {
            open: undefined,
            message: undefined,
            close: undefined,
            error: undefined
        };
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.RemoteUpdateService.MessageTypeEnum = Object.freeze({
        PROPERTY_UPDATE: 'PROPERTY_UPDATE',
        VERSION_MESSAGE: 'VERSION_MESSAGE',
        VI_STATE_UPDATE: 'VI_STATE_UPDATE',
        BATCH_UPDATE: 'BATCH_UPDATE'
    });
    NationalInstruments.HtmlVI.RemoteUpdateService.StateEnum = Object.freeze(Object.assign({
        INITIALIZING: 'INITIALIZING',
        INITIALCONNECTION: 'INITIALCONNECTION',
        CONNECTING: 'CONNECTING',
        CONNECTED: 'CONNECTED',
        RECONNECTING: 'RECONNECTING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.RemoteUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.RemoteUpdateService.StateEnum;
    var MESSAGE_TYPE_ENUM = NationalInstruments.HtmlVI.RemoteUpdateService.MessageTypeEnum;
    // Static Private Functions
    // Discussion of RT message format https://nitalk.jiveon.com/docs/DOC-229687
    var createPropertyUpdateMessage = function (viModel, controlModel, newValue, oldValue) {
        var remoteBindingInfo = controlModel.getRemoteBindingInfo();
        var messageObject = {
            messageType: MESSAGE_TYPE_ENUM.PROPERTY_UPDATE,
            viName: viModel.viName,
            dcoIndex: remoteBindingInfo.dco,
            data: {
                value: newValue
            }
        };
        var messageString = JSON.stringify(messageObject);
        return messageString;
    };
    var createVersionMessage = function (preferredVersion) {
        var messageObject = {
            messageType: MESSAGE_TYPE_ENUM.VERSION_MESSAGE,
            version: preferredVersion
        };
        var messageString = JSON.stringify(messageObject);
        return messageString;
    };
    var parseWebSocketMessage = function (messageString) {
        var messageObject;
        try {
            messageObject = JSON.parse(messageString);
        }
        catch (err) {
            NI_SUPPORT.error('Error parsing message: ' + err.message);
            messageObject = {};
        }
        return messageObject;
    };
    // Public Prototype Methods
    proto.isValidServiceState = function (state) {
        // Child states merged with parent states so only need to check child
        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    };
    proto.initialize = function () {
        var that = this;
        parent.prototype.initialize.call(that, SERVICE_STATE_ENUM.UNINITIALIZED, undefined);
        // Save references to the callback functions so they can be added and removed
        that.socketCallbacks.open = function (evt) {
            that.socketOpen(evt);
        };
        that.socketCallbacks.message = function (evt) {
            that.socketMessage(evt);
        };
        that.socketCallbacks.close = function (evt) {
            that.socketClose(evt);
        };
        that.socketCallbacks.error = function (evt) {
            that.socketError(evt);
        };
        that.setServiceState(SERVICE_STATE_ENUM.INITIALIZING);
    };
    proto.finishInitializing = function () {
        parent.prototype.finishInitializing.call(this, SERVICE_STATE_ENUM.INITIALIZING);
        this.dcoIndexCache = new NationalInstruments.HtmlVI.ControlDCOIndexCache(this.getVIModels());
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    proto.start = function () {
        var that = this;
        parent.prototype.start.call(that, SERVICE_STATE_ENUM.READY);
        setTimeout(function () {
            that.setupConnection();
        }, 0);
        that.setServiceState(SERVICE_STATE_ENUM.INITIALCONNECTION);
    };
    proto.setupConnection = function () {
        this.verifyServiceStateIs([SERVICE_STATE_ENUM.INITIALCONNECTION, SERVICE_STATE_ENUM.RECONNECTING]);
        this.createSocket();
        this.setServiceState(SERVICE_STATE_ENUM.CONNECTING);
    };
    proto.stop = function () {
        var that = this;
        parent.prototype.stop.call(that, [SERVICE_STATE_ENUM.CONNECTING, SERVICE_STATE_ENUM.CONNECTED]);
        this.removeSocket();
        that.setServiceState(SERVICE_STATE_ENUM.READY);
    };
    proto.socketOpen = function () {
        this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTING);
        // Send handshake message
        var messageString = createVersionMessage(this.preferredVersion);
        this.socket.send(messageString);
    };
    proto.socketMessage = function (evt) {
        var remoteBindingInfo, data;
        var messageObject = parseWebSocketMessage(evt.data);
        switch (messageObject.messageType) {
            case MESSAGE_TYPE_ENUM.VERSION_MESSAGE:
                this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTING);
                this.serverVersion = messageObject.version;
                if (this.preferredVersion.majorVersion !== this.serverVersion.majorVersion) {
                    NI_SUPPORT.error('HTML Panel cannot connect to server with incompatible version');
                    this.stop();
                }
                else {
                    this.setServiceState(SERVICE_STATE_ENUM.CONNECTED);
                }
                break;
            case MESSAGE_TYPE_ENUM.PROPERTY_UPDATE:
                this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTED);
                remoteBindingInfo = this.dcoIndexCache.getRemoteBindingInfo(messageObject.viName, messageObject.dcoIndex);
                data = {};
                data[remoteBindingInfo.prop] = messageObject.data.value;
                this.dispatchMessageToHTMLPanel(messageObject.viName, remoteBindingInfo.controlId, data);
                break;
            case MESSAGE_TYPE_ENUM.VI_STATE_UPDATE:
                this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTED);
                NI_SUPPORT.error('VI State update is not implemented');
                break;
            case MESSAGE_TYPE_ENUM.BATCH_UPDATE:
                this.verifyServiceStateIs(SERVICE_STATE_ENUM.CONNECTED);
                this.batchUpdate(messageObject.data);
                break;
            default:
                NI_SUPPORT.error('Unknown message format or type: ' + evt.data);
                this.setServiceState(SERVICE_STATE_ENUM.ERROR);
                break;
        }
    };
    proto.batchUpdate = function (batch) {
        window.requestAnimationFrame(() => {
            let cookie = batch.cookie;
            for (let call of batch.Calls) {
                if (call.CallName === "booleanValueChanged") {
                    this.booleanValueChanged(call.Parameters);
                }
                else if (call.CallName === "doubleValueChanged") {
                    this.doubleValueChanged(call.Parameters);
                }
                else if (call.CallName === "stringValueChanged") {
                    this.stringValueChanged(call.Parameters);
                }
                //} else if (call.CallName === "doubleArrayValueChanged") {
                //    that.windowEngineCallbacks.doubleArrayValueChanged(call.Parameters);
                //}
            }
            this.setCallResponse(cookie);
        });
    };
    proto.booleanValueChanged = function (argsArr) {
        var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
        data["value"] = newValue;
        this.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        this.setCallResponse(cookie);
    };
    proto.doubleValueChanged = function (argsArr) {
        var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
        data["value"] = newValue;
        this.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        this.setCallResponse(cookie);
    };
    proto.stringValueChanged = function (argsArr) {
        var cookie = argsArr[0], viName = argsArr[1], controlId = argsArr[2], newValue = argsArr[3], data = {};
        data["text"] = newValue;
        this.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        this.setCallResponse(cookie);
    };
    proto.controlEventOccurred = function (viModel, controlModel, eventType, eventData) {
        if (this.socket !== null) {
            controlModel = controlModel.findTopLevelControl();
            let modelIdentifier = controlModel.getEditorRuntimeBindingInfo().controlId;
            let messageObject = {
                messageType: 'controlEventOccurred',
                viName: viModel.viName,
                controlId: modelIdentifier,
                eventType: eventType,
                eventData: eventData
            };
            let messageString = JSON.stringify(messageObject);
            this.socket.send(messageString);
        }
    };
    proto.setCallResponse = function (cookie) {
        if (cookie !== 0) {
            let messageObject = {
                messageType: 'setCallResponse',
                cookie: cookie
            };
            let messageString = JSON.stringify(messageObject);
            this.socket.send(messageString);
        }
    };
    proto.socketClose = function () {
        this.reconnect();
    };
    proto.socketError = function (evt) {
        NI_SUPPORT.error('Socket Error', evt);
        this.reconnect();
    };
    proto.reconnect = function () {
        var that = this;
        that.verifyServiceStateIs([SERVICE_STATE_ENUM.CONNECTING, SERVICE_STATE_ENUM.CONNECTED]);
        // Synchronously remove the socket when an error occurs to prevent further errors
        that.removeSocket();
        // Asynchronously setuoConnecton to allow state change propagation
        setTimeout(function () {
            that.setupConnection();
        }, 0);
        that.setServiceState(SERVICE_STATE_ENUM.RECONNECTING);
    };
    proto.createSocket = function () {
        this.socket = new WebSocket(this.remoteAddress);
        this.socket.addEventListener('open', this.socketCallbacks.open);
        this.socket.addEventListener('message', this.socketCallbacks.message);
        this.socket.addEventListener('close', this.socketCallbacks.close);
        this.socket.addEventListener('error', this.socketCallbacks.error);
    };
    proto.removeSocket = function () {
        if (this.socket !== undefined) {
            this.socket.removeEventListener('open', this.socketCallbacks.open);
            this.socket.removeEventListener('message', this.socketCallbacks.message);
            this.socket.removeEventListener('close', this.socketCallbacks.close);
            this.socket.removeEventListener('error', this.socketCallbacks.error);
            this.socket.close();
            this.socket = undefined;
        }
    };
    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue, oldValue) {
        var messageString;
        if (this.checkServiceStateIs(SERVICE_STATE_ENUM.CONNECTED) === false) {
            NI_SUPPORT.error('Control property update ignored. Remote service is not connected.');
            return;
        }
        // TODO mraj To support updates from non top-level controls the Remote update service might need to serialize the top-level control to send on the wire
        if (controlModel.insideTopLevelContainer() === true) {
            throw new Error('Controls that are not top-level are currently unsupported. Cluster and Array support needs to be added.');
        }
        messageString = createPropertyUpdateMessage(viModel, controlModel, newValue, oldValue);
        this.socket.send(messageString);
    };
}(NationalInstruments.HtmlVI.UpdateService));
//# sourceMappingURL=niRemoteUpdateService.js.map