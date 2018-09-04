"use strict";
//****************************************
// RadioButtonGroupModel Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var ORIENTATION_ENUM = NationalInstruments.HtmlVI.Elements.RadioButtonGroup.OrientationEnum;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.RadioButtonGroupModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.RadioButtonGroupModel.MODEL_KIND = 'niRadioButtonGroup';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.RadioButtonGroupModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: ORIENTATION_ENUM.VERTICAL });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedButtonBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'unselectedButtonBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textColor', defaultValue: '' });
    });
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case 'Items':
                throw new Error("Property " + gPropertyName + " not supported for enum control.");
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case 'Items':
                throw new Error("Property " + gPropertyName + " not supported for enum control.");
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.NumericValueSelectorModel));
//# sourceMappingURL=niRadioButtonGroupModel.js.map