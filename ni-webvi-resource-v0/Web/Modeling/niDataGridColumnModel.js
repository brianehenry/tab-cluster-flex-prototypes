"use strict";
//****************************************
// Data Grid Column Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.DataGridColumnModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.DataGridColumnModel.MODEL_KIND = 'niDataGridColumn';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.DataGridColumnModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'index', defaultValue: -1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'header', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'width', defaultValue: 50 });
        proto.addModelProperty(targetPrototype, { propertyName: 'fieldName', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'pinned', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'aggregates', defaultValue: {} });
    });
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualComponentModel));
//# sourceMappingURL=niDataGridColumnModel.js.map