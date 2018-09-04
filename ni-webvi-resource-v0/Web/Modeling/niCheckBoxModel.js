"use strict";
//****************************************
// CheckBox Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.CheckBoxModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.CheckBoxModel.MODEL_KIND = 'niCheckBox';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.CheckBoxModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
        proto.addModelProperty(targetPrototype, { propertyName: 'trueBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'falseBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textColor', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'checkMarkColor', defaultValue: '' });
    });
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.BooleanControlModel));
//# sourceMappingURL=niCheckBoxModel.js.map