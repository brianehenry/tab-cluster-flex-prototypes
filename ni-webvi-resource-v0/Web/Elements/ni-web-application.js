"use strict";
//****************************************
// Web Application Prototype
// DOM Registration: HTMLNIWebApplication
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    var SERVICE_STATE_ENUM = Object.freeze({
        UNINITIALIZED: 'UNINITIALIZED',
        READY: 'READY',
        ERROR: 'ERROR'
    });
    // Keep in sync with serializer in DOMModel.cs
    var PANEL_ENGINE_ENUM = Object.freeze({
        NATIVE: 'NATIVE',
        VIREO: 'VIREO'
    });
    // Keep in sync with serializer in DOMModel.cs
    var PANEL_LOCATION_ENUM = Object.freeze({
        IDE_EDIT: 'IDE_EDIT',
        IDE_RUN: 'IDE_RUN',
        BROWSER: 'BROWSER'
    });
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var createWebAppFrontend = function () {
        //<div class="ni-execution-buttons-box disabled">
        //    <button class="ni-execution-button ni-start-button disabled hidden" type="button">Start</button>
        //    <button class="ni-execution-button ni-abort-button disabled hidden" type="button">Abort</button>
        //</div>
        var uiControls = document.createElement('div');
        uiControls.classList.add('ni-execution-buttons-box');
        var startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.type = 'button';
        startButton.classList.add('ni-execution-button', 'ni-start-button', 'disabled');
        var abortButton = document.createElement('button');
        abortButton.textContent = 'Abort';
        abortButton.type = 'button';
        abortButton.classList.add('ni-execution-button', 'ni-abort-button', 'disabled');
        uiControls.appendChild(startButton);
        uiControls.appendChild(abortButton);
        var enableButtons = function (enableStart, enableAbort) {
            if (enableStart) {
                startButton.classList.remove('disabled');
            }
            else {
                startButton.classList.add('disabled');
            }
            if (enableAbort) {
                abortButton.classList.remove('disabled');
            }
            else {
                abortButton.classList.add('disabled');
            }
        };
        return {
            uiControls: uiControls,
            startButton: startButton,
            abortButton: abortButton,
            enableButtons: enableButtons
        };
    };
    var updateUIButtons = function (frontEndElements, serviceState) {
        if (serviceState === 'READY') {
            frontEndElements.enableButtons(true, false);
        }
        else if (serviceState === 'RUNNING' || serviceState === 'CONNECTING' || serviceState === 'CONNECTED' || serviceState === 'LISTENING') {
            frontEndElements.enableButtons(false, true);
        }
        else {
            frontEndElements.enableButtons(false, false);
        }
    };
    var updateConnectingDialog = function (serviceState) {
        if (serviceState === 'CONNECTED') {
            NI_SUPPORT.info('CONNECTED');
        }
        else {
            NI_SUPPORT.info('CONNECTING');
        }
    };
    class WebApplication extends NationalInstruments.HtmlVI.Elements.NIElement {
        // Static Private Variables
        // Static Private Functions
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = WebApplication.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'engine',
                defaultValue: ''
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'location',
                defaultValue: ''
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'vireoSource',
                defaultValue: ''
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'remoteAddress',
                defaultValue: ''
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'testMode',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'disableAutoStart',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'serviceState',
                defaultValue: SERVICE_STATE_ENUM.UNINITIALIZED,
                fireEvent: true
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'vireoTotalMemory',
                defaultValue: ''
            });
        }
        createdCallback() {
            super.createdCallback();
            // Public Instance Properties
            // None
            // Private Instance Properties
            this._enableConnectionDialog = false;
            this._frontEndElements = undefined;
            // If the DOM had a different value, override it
            this.serviceState = SERVICE_STATE_ENUM.UNINITIALIZED;
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            var frontEndElements, that = this;
            NI_SUPPORT.logVerbose('ni-web-application attachedCallback()' +
                ' firstCall=' + firstCall +
                ' disableAutoStart=' + that.disableAutoStart +
                ' engine=' + that.engine +
                ' location=' + that.location);
            NationalInstruments.HtmlVI.webApplicationModelsService.register(that);
            if (firstCall === true) {
                if (that.disableAutoStart === false && that.engine === 'NATIVE' && that.location === 'BROWSER') {
                    that._enableConnectionDialog = true;
                    updateConnectingDialog(that.serviceState);
                }
                if (that.disableAutoStart === true) {
                    frontEndElements = createWebAppFrontend();
                    frontEndElements.startButton.addEventListener('click', function () {
                        if (frontEndElements.startButton.classList.contains('disabled') === false) {
                            that.start();
                        }
                    });
                    frontEndElements.abortButton.addEventListener('click', function () {
                        if (frontEndElements.abortButton.classList.contains('disabled') === false) {
                            that.stop();
                        }
                    });
                    that._frontEndElements = frontEndElements;
                    updateUIButtons(that._frontEndElements, that.serviceState);
                    that.appendChild(frontEndElements.uiControls);
                }
            }
            return firstCall;
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'serviceState':
                    if (this._enableConnectionDialog === true) {
                        updateConnectingDialog(this.serviceState);
                    }
                    if (this.disableAutoStart === true) {
                        updateUIButtons(this._frontEndElements, this.serviceState);
                    }
                    break;
            }
        }
        detachedCallback() {
            NationalInstruments.HtmlVI.webApplicationModelsService.unregister(this);
        }
        start() {
            this.dispatchEvent(new CustomEvent('requested-start', {
                bubbles: true,
                cancelable: true,
                detail: {
                    element: this
                }
            }));
        }
        stop() {
            this.dispatchEvent(new CustomEvent('requested-stop', {
                bubbles: true,
                cancelable: true,
                detail: {
                    element: this
                }
            }));
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(WebApplication.prototype, 'ni-web-application', 'HTMLNIWebApplication');
    NationalInstruments.HtmlVI.Elements.WebApplication = WebApplication;
    NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum = SERVICE_STATE_ENUM;
    NationalInstruments.HtmlVI.Elements.WebApplication.PanelEngineEnum = PANEL_ENGINE_ENUM;
    NationalInstruments.HtmlVI.Elements.WebApplication.PanelLocationEnum = PANEL_LOCATION_ENUM;
}());
//# sourceMappingURL=ni-web-application.js.map