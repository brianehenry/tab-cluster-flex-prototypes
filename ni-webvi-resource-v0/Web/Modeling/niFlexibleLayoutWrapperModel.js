"use strict";
//****************************************
// Flexible Layout Wrapper Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.FlexibleLayoutWrapperModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.FlexibleLayoutWrapperModel.MODEL_KIND = 'niFlexibleLayoutWrapper';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.FlexibleLayoutWrapperModel;
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
    proto.shouldApplyPosition = function () {
        return false;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niFlexibleLayoutWrapperModel.js.map