"use strict";
//****************************************
// Graph Base Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.GraphBaseModel = function (id) {
        parent.call(this, id);
        this.niType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: NITypeNames.DOUBLE });
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.GraphBaseModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, {
            propertyName: 'value',
            defaultValue: [],
            customSetter: function (oldValue, newValue) {
                if (typeof newValue === 'string') {
                    return JSON.parse(newValue);
                }
                else {
                    return newValue;
                }
            }
        });
        proto.addModelProperty(targetPrototype, { propertyName: 'plotAreaMargin', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'graphRef', defaultValue: '' });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        parent.prototype.controlChanged.call(this, 'value', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.value = gPropertyValue;
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(gPropertyValue);
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.value;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niGraphBaseModel.js.map