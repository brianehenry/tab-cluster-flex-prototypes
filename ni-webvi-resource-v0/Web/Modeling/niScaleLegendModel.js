"use strict";
//****************************************
// Scale legend Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.ScaleLegendModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ScaleLegendModel.MODEL_KIND = 'niScaleLegend';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ScaleLegendModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'graphRef', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'isInEditMode', defaultValue: false });
    });
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niScaleLegendModel.js.map