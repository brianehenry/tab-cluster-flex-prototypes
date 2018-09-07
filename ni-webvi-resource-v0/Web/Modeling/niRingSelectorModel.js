"use strict";
//****************************************
// RingSelector Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.RingSelectorModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.RingSelectorModel.MODEL_KIND = 'niRingSelector';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.RingSelectorModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var validateSelectors = function (itemsAndValuesMap) {
        let displayNameValues = [];
        let values = [];
        for (let i = 0; i < itemsAndValuesMap.length; i++) {
            displayNameValues[i] = itemsAndValuesMap[i].String;
            values[i] = itemsAndValuesMap[i].Value;
            if (displayNameValues[i] === "") {
                throw new Error("Display values must not be empty.");
            }
        }
        if (displayNameValues.length !== new Set(displayNameValues).size) {
            throw new Error("Duplicate display names are not allowed.");
        }
        if (values.length !== new Set(values).size) {
            throw new Error("Duplicate values are not allowed.");
        }
    };
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'allowUndefined', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
        proto.addModelProperty(targetPrototype, { propertyName: 'numericValueWidth', defaultValue: 40 });
    });
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.value = gPropertyValue;
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(gPropertyValue);
                break;
            case GPropertyNameConstants.ITEMS_AND_VALUES:
                validateSelectors(gPropertyValue);
                this.items = gPropertyValue.map((item) => {
                    let valueAndDisplayValue = {};
                    valueAndDisplayValue.displayValue = item.String;
                    valueAndDisplayValue.value = item.Value;
                    return valueAndDisplayValue;
                });
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.ITEMS_AND_VALUES:
                return this.items.map((item) => {
                    let valueAndDisplayValue = {};
                    valueAndDisplayValue.String = item.displayValue;
                    valueAndDisplayValue.Value = item.value;
                    return valueAndDisplayValue;
                });
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.NumericValueSelectorModel));
//# sourceMappingURL=niRingSelectorModel.js.map