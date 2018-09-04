"use strict";
//****************************************
// Custom Element Extensions
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var COMMON_EXTENSIONS = NationalInstruments.HtmlVI.CommonElementExtensions;
    var NI_VIEW_MODELS = NationalInstruments.HtmlVI.ViewModels;
    // The list of jqx elements that we support along with their element info
    var _elements = {};
    var addElementInfo = function (tagName, elementInfo) {
        if (elementInfo === undefined) {
            elementInfo = {};
        }
        elementInfo.tagName = tagName;
        if (elementInfo.isTextEditFocusable === undefined) {
            elementInfo.isTextEditFocusable = false;
        }
        if (elementInfo.propertyName !== undefined && elementInfo.attributeName === undefined) {
            elementInfo.attributeName = elementInfo.propertyName;
        }
        _elements[tagName] = elementInfo;
    };
    addElementInfo('jqx-numeric-text-box', { propertyName: 'value', eventName: 'change', isTextEditFocusable: true });
    addElementInfo('jqx-multiline-text-box', { propertyName: 'value', eventName: 'change', isTextEditFocusable: true });
    addElementInfo('jqx-progress-bar', { propertyName: 'value', eventName: ' ' });
    addElementInfo('jqx-circular-progress-bar', { propertyName: 'value', eventName: ' ' });
    addElementInfo('jqx-tank', { propertyName: 'value', eventName: 'change' });
    addElementInfo('jqx-slider', { propertyName: 'value', eventName: 'change' });
    addElementInfo('jqx-gauge', { propertyName: 'value', eventName: 'change' });
    addElementInfo('jqx-date-time-picker', { propertyName: 'value', eventName: 'change', isTextEditFocusable: true, viewReady: NI_VIEW_MODELS.TimeStampTextBoxViewModel.viewReady });
    addElementInfo('jqx-toggle-button', { propertyName: 'checked', eventName: 'change' });
    addElementInfo('jqx-switch-button', { propertyName: 'checked', eventName: 'change' });
    addElementInfo('jqx-power-button', { propertyName: 'checked', eventName: 'change' });
    addElementInfo('jqx-led', { propertyName: 'checked', eventName: 'change' });
    addElementInfo('jqx-check-box', { propertyName: 'checked', eventName: 'change' });
    addElementInfo('jqx-list-box', { propertyName: 'selectedIndexes', eventName: 'change' });
    addElementInfo('jqx-drop-down-list', { propertyName: 'selectedIndexes', eventName: 'change' });
    addElementInfo('ni-cartesian-axis');
    addElementInfo('ni-color-scale');
    addElementInfo('ni-cartesian-plot');
    addElementInfo('ni-cartesian-plot-renderer');
    addElementInfo('ni-cursor');
    addElementInfo('ni-cartesian-graph');
    addElementInfo('ni-chart');
    addElementInfo('ni-intensity-graph');
    addElementInfo('ni-graph-tools');
    addElementInfo('ni-plot-legend');
    addElementInfo('ni-scale-legend');
    addElementInfo('ni-cursor-legend');
    addElementInfo('ni-hyperlink', { propertyName: 'href', eventName: 'href-changed ' });
    addElementInfo('ni-flexible-layout-component');
    addElementInfo('ni-flexible-layout-container');
    addElementInfo('ni-flexible-layout-group');
    addElementInfo('ni-flexible-layout-wrapper');
    addElementInfo('ni-front-panel');
    var create = function (element, elementInfo) {
        var bindingInfo;
        Object.defineProperty(element, 'niElementInstanceId', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: NI_SUPPORT.uniqueId()
        });
        // update internal properties from attribute values
        element.niControlId = element.getAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID);
        element.labelId = element.getAttribute(COMMON_EXTENSIONS.LABEL_ID);
        bindingInfo = element.getAttribute(COMMON_EXTENSIONS.BINDING_INFO);
        if (bindingInfo !== null && typeof bindingInfo === 'string') {
            bindingInfo = JSON.parse(bindingInfo);
            element.bindingInfo = bindingInfo;
        }
        element.viRef = element.getAttribute(COMMON_EXTENSIONS.VI_REF);
        element._temporarySettingsHolder = {};
        Object.defineProperty(element, 'isTextEditFocusable', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function () {
                return elementInfo.isTextEditFocusable;
            }
        });
        // The cartesian-axis, cursors and legends have their own
        // setFont property, so don't overwrite it.
        if (!('setFont' in element)) {
            Object.defineProperty(element, 'setFont', {
                configurable: false,
                enumerable: false,
                writable: false,
                value: function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
                    this.style.fontSize = fontSize;
                    this.style.fontFamily = fontFamily;
                    this.style.fontWeight = fontWeight;
                    this.style.fontStyle = fontStyle;
                    this.style.textDecoration = textDecoration;
                }
            });
        }
    };
    var setup = function (element) {
        var viViewModel, controlModelViewModel, viewReady;
        element.viRef = '';
        element.removeAttribute('data-ni-base-style');
        if (!NationalInstruments.JQXElement.isJQXElementSubPart(element)) {
            if (element._preventModelCreation !== true) {
                viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(element.viRef);
                controlModelViewModel = viViewModel.attachElementToModelAndViewModel(element);
                controlModelViewModel.controlViewModel.bindToView();
            }
            viewReady = _elements[element.tagName.toLowerCase()].viewReady;
            if (typeof viewReady === 'function') {
                viewReady(element);
            }
        }
    };
    var attach = function (element) {
        if (!element.firstAttach) {
            element.firstAttach = true;
            return;
        }
        // this is for reparenting. Properties set in attach will not be applied to the elements appearance
        // (but during reparenting they are not changing anyway)
        setup(element);
    };
    var ready = function (element) {
        element.firstAttach = false;
        // this is for first time setup - the properties set here will be applied to the elements appearance
        setup(element);
    };
    var detach = function (element) {
        var viViewModel;
        if (element._preventModelCreation !== true && !NationalInstruments.JQXElement.isJQXElementSubPart(element)) {
            viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(element.viRef);
            viViewModel.detachElementFromModelAndViewModel(element);
        }
    };
    var addProperties = function (proto, elementInfo) {
        proto.clearExtensionProperties = NationalInstruments.HtmlVI.CommonElementExtensions.generateClearExtensionProperties();
        Object.defineProperty(proto, 'elementInfo', {
            configurable: false,
            enumerable: true,
            value: { tagName: elementInfo.tagName },
            writable: true
        });
        /* Not all elements fall into the "control with one attribute" pattern. The property name, attributeName and eventName are optional.*/
        if (elementInfo.propertyName !== undefined) {
            NI_SUPPORT.setValuePropertyDescriptor(proto, elementInfo.attributeName, elementInfo.propertyName, elementInfo.propertyName, elementInfo.eventName);
        }
        Object.defineProperty(proto, COMMON_EXTENSIONS.NICONTROLID, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._NICONTROLID] !== undefined) {
                    return this[COMMON_EXTENSIONS._NICONTROLID];
                }
                else {
                    this[COMMON_EXTENSIONS._NICONTROLID] = this.getAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID);
                    return this[COMMON_EXTENSIONS._NICONTROLID];
                }
            },
            set: function (value) {
                this._niControlId = value;
                this.setAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID, value);
            }
        });
        Object.defineProperty(proto, COMMON_EXTENSIONS.VIREF, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._VIREF] !== undefined) {
                    return this[COMMON_EXTENSIONS._VIREF];
                }
                else {
                    this[COMMON_EXTENSIONS._VIREF] = this.getAttribute(COMMON_EXTENSIONS.VI_REF);
                    return this[COMMON_EXTENSIONS._VIREF];
                }
            },
            set: function (value) {
                this._viRef = value;
                this.setAttribute(COMMON_EXTENSIONS.VI_REF, value);
            }
        });
        Object.defineProperty(proto, COMMON_EXTENSIONS.BINDINGINFO, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._BINDINGINFO] !== undefined) {
                    return this[COMMON_EXTENSIONS._BINDINGINFO];
                }
                else {
                    return {
                        prop: '',
                        field: '',
                        sync: false,
                        dco: -1,
                        dataItem: '',
                        accessMode: '',
                        unplacedOrDisabled: false,
                        isLatched: false // Indicates whether the control has latching enabled.
                    };
                }
            },
            set: function (value) {
                this[COMMON_EXTENSIONS._BINDINGINFO] = value;
                this.setAttribute(COMMON_EXTENSIONS.BINDING_INFO, JSON.stringify(value));
            }
        });
        Object.defineProperty(proto, COMMON_EXTENSIONS.LABELID, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._LABELID] !== undefined) {
                    return this[COMMON_EXTENSIONS._LABELID];
                }
                else {
                    this[COMMON_EXTENSIONS._LABELID] = this.getAttribute(COMMON_EXTENSIONS.LABEL_ID);
                    return this[COMMON_EXTENSIONS._LABELID];
                }
            },
            set: function (value) {
                this[COMMON_EXTENSIONS._LABELID] = value;
                this.setAttribute(COMMON_EXTENSIONS.LABEL_ID, value);
            }
        });
    };
    // Extensions to multiple prototypes
    var toReg;
    var handleRegistered = function (proto, elementInfo) {
        addProperties(proto, elementInfo);
        proto.onReady = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                create(this, elementInfo); // Can't call this from the .onCreated callback, as that is now called from within the .ctor of JQX which
                // prohibits the setting of attributes (which this callback handler sets)
                ready(this);
            }
        };
        proto.onAttached = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                attach(this);
            }
        };
        proto.onDetached = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                detach(this);
            }
        };
    };
    var whenRegistered = function (elementInfo) {
        window.JQX.Elements.whenRegistered(elementInfo.tagName, function (proto) {
            handleRegistered(proto, elementInfo);
        });
    };
    for (toReg in _elements) {
        if (_elements.hasOwnProperty(toReg)) {
            whenRegistered(_elements[toReg]);
        }
    }
    NationalInstruments.JQXElement.isJQXElementSubPart = function (element) {
        return element.niControlId === 'null' || element.niControlId === null;
    };
    NationalInstruments.JQXElement.addHandlersForMouseWheel = function (element) {
        // TA282243 : JQX enableMouseWheelAction takes effect even when the control isn't focused.
        // We should ask them to change the behavior or add a new property indicating that mouse
        // wheel actions will only take effect when the control is focused, which is what we want.
        element.addEventListener('focus', function (evt) {
            element.enableMouseWheelAction = true;
        }, true);
        element.addEventListener('blur', function (evt) {
            element.enableMouseWheelAction = false;
        }, true);
    };
    NationalInstruments.JQXElement._registerElements = function () {
        window.JQX.Elements.registerElements();
    };
}());
//# sourceMappingURL=jqxElementExtensions.js.map