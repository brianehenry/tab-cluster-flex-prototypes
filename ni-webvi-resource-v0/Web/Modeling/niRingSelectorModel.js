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
    // None
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
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.NumericValueSelectorModel));
//# sourceMappingURL=niRingSelectorModel.js.map