"use strict";
//****************************************
// Flexible Layout Group Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.FlexibleLayoutGroupModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.FlexibleLayoutGroupModel.MODEL_KIND = 'niFlexibleLayoutGroup';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.FlexibleLayoutGroupModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto);
    proto.shouldApplyHeight = function () {
        return false;
    };
    proto.shouldApplyWidth = function () {
        return false;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niFlexibleLayoutGroupModel.js.map