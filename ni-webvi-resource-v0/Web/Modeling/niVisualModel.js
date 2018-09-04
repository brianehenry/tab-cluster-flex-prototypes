"use strict";
//****************************************
// Visual Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.VisualModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        this.localBindingInfo = null;
        this.defaultValue = undefined;
        // TODO mraj I will buy the team a keg if we agree to stop introducing supression flags
        this.suppressControlChanged = false;
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.VisualModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'top', defaultValue: '0px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'left', defaultValue: '0px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'width', defaultValue: '100px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'height', defaultValue: '100px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'foreground', defaultValue: 'rgb(0, 0, 0)' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontSize', defaultValue: '12px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontFamily', defaultValue: 'sans-serif' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontWeight', defaultValue: 'normal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontStyle', defaultValue: 'normal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textDecoration', defaultValue: 'none' });
        proto.addModelProperty(targetPrototype, { propertyName: 'visible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'readOnly', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'labelId', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'enabled', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'bindingInfo', defaultValue: {} });
        proto.addModelProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: undefined,
            customSetter: function (oldVal, newVal) {
                if (newVal instanceof NIType) {
                    return newVal;
                }
                return new NIType(newVal);
            }
        });
    });
    // This method is meant to be overriden by all of our JS control models that set their niType property.
    // The common case is a control with a 'value' property: it should override this, and return true if propertyName === 'value'.
    // For controls that have multiple typed properties (e.g. numerics; value=ComplexDouble implies min/max/interval are also ComplexDouble),
    // this method should return true for all of those property names.
    proto.propertyUsesNITypeProperty = function (propertyName) {
        if (this.niType !== undefined) {
            throw new Error('Any control model that sets niType must override propertyUsesNITypeProperty()');
        }
        return false;
    };
    proto.setMultipleProperties = function (settings, typedValueAdapter) {
        if (settings.hasOwnProperty('niType')) {
            // We need to apply the NIType before other properties. It's also used for our editor->model
            // data conversion below so we need the latest NIType for that too.
            this.niType = settings.niType;
            delete settings.niType; // We've already handled niType, so setMultipleProperties doesn't need to, below
        }
        if (typedValueAdapter !== undefined) {
            for (var propertyName in settings) {
                if (settings.hasOwnProperty(propertyName) && this.propertyUsesNITypeProperty(propertyName)) {
                    settings[propertyName] = typedValueAdapter(settings[propertyName], this.niType);
                }
            }
        }
        parent.prototype.setMultipleProperties.call(this, settings);
    };
    proto.setBindingInfo = function (bindingInfo) {
        this.bindingInfo = bindingInfo;
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.DISABLED: {
                this.enabled = !gPropertyValue;
                this.updateLabelDisabledState(gPropertyValue);
                break;
            }
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.DISABLED:
                return !this.enabled;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    proto.updateLabelDisabledState = function (disabled) {
        var viModel = this.getRoot();
        if (viModel !== undefined) {
            if (this.labelId !== '') {
                viModel.controlModels[this.labelId].enabled = !disabled;
            }
        }
    };
    proto.getBindingInfo = function () {
        return this.bindingInfo;
    };
    proto.getRemoteBindingInfo = function () {
        return {
            prop: this.bindingInfo.prop,
            dco: this.bindingInfo.dco,
            controlId: this.niControlId
        };
    };
    proto.getEditorRuntimeBindingInfo = function () {
        return {
            prop: this.bindingInfo.prop,
            dataItem: this.bindingInfo.dataItem,
            controlId: this.niControlId
        };
    };
    proto.getLocalBindingInfo = function () {
        if (this.localBindingInfo === null) {
            this.localBindingInfo = this.generateLocalBindingInfo();
        }
        return this.localBindingInfo;
    };
    proto.getDefaultValue = function () {
        return this.defaultValue;
    };
    proto.setDefaultValue = function (defaultValue) {
        this.defaultValue = defaultValue;
    };
    proto.generateVireoPath = function () {
        if (this.insideTopLevelContainer()) {
            return undefined;
        }
        else {
            return this.getBindingInfo().dataItem;
        }
    };
    // DO NOT USE DIRECTLY: Use getLocalBindingInfo instead for cached value
    proto.generateLocalBindingInfo = function () {
        var bindingInfo = this.getBindingInfo();
        var localBindingInfo = {
            runtimePath: '',
            encodedVIName: '',
            prop: '',
            sync: false,
            dataItem: '',
            accessMode: '',
            isLatched: false
        };
        localBindingInfo.runtimePath = this.generateVireoPath();
        localBindingInfo.encodedVIName = this.getRoot().getNameVireoEncoded();
        localBindingInfo.prop = (typeof bindingInfo.prop === 'string') ? bindingInfo.prop : '';
        localBindingInfo.sync = (typeof bindingInfo.sync === 'boolean') ? bindingInfo.sync : false;
        localBindingInfo.dataItem = (typeof bindingInfo.dataItem === 'string') ? bindingInfo.dataItem : '';
        localBindingInfo.accessMode = (typeof bindingInfo.accessMode === 'string') ? bindingInfo.accessMode : '';
        localBindingInfo.isLatched = (typeof bindingInfo.isLatched === 'boolean') ? bindingInfo.isLatched : false;
        if (localBindingInfo.runtimePath === '') {
            return undefined;
        }
        return Object.freeze(localBindingInfo);
    };
    proto.getNITypeString = function () {
        if (!this.niType.isAggregateType()) {
            return this.niType.getName();
        }
        return this.niType.toShortJSON();
    };
    // Control changed is only used for controls that have binding info (ie VisualModels)
    proto.controlChanged = function (propertyName, newValue, oldValue) {
        var viModel = this.getRoot();
        if (this.suppressControlChanged === false) {
            viModel.controlChanged(this, propertyName, newValue, oldValue);
        }
    };
    // Event occured is only used for controls that have binding info (ie VisualModels)
    proto.controlEventOccurred = function (eventType, eventData) {
        var viModel = this.getRoot();
        viModel.controlEventOccurred(this, eventType, eventData);
    };
    // This method is meant to be overriden by all our JS control models that don't want JS to sync Height between the Model/ViewModel/Element layers.
    // The default value is true.  Any control that doesn't want the Height set should override and set to false.
    proto.shouldApplyHeight = function () {
        return true;
    };
    // This method is meant to be overriden by all our JS control models that don't want JS to sync Width between the Model/ViewModel/Element layers.
    // The default value is true.  Any control that doesn't want the Width set should override and set to false.
    proto.shouldApplyWidth = function () {
        return true;
    };
    // This method is meant to be overriden by all our JS control models that don't want JS to sync Top/Left between the Model/ViewModel/Element layers.
    // The default value is true.  Any control that doesn't want the Top/Left set should override and set to false.
    proto.shouldApplyPosition = function () {
        return true;
    };
}(NationalInstruments.HtmlVI.Models.VisualComponentModel));
//# sourceMappingURL=niVisualModel.js.map