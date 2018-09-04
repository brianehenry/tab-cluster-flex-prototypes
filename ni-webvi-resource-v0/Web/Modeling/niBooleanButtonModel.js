"use strict";
//****************************************
// Boolean Button Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanButtonModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.BooleanButtonModel, 'MODEL_KIND', 'niBooleanButton');
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.BooleanButtonModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'trueBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'trueForeground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'falseBackground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'falseForeground', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'borderColor', defaultValue: '' });
    });
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.BooleanControlModel));
//# sourceMappingURL=niBooleanButtonModel.js.map