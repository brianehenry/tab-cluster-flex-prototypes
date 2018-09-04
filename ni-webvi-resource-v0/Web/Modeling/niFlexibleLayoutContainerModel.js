"use strict";
//****************************************
// Flexible Layout Container Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.FlexibleLayoutContainerModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.FlexibleLayoutContainerModel.MODEL_KIND = 'niFlexibleLayoutContainer';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.FlexibleLayoutContainerModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'direction', defaultValue: 'row' });
        proto.addModelProperty(targetPrototype, { propertyName: 'horizontalContentAlignment', defaultValue: 'flex-start' });
        proto.addModelProperty(targetPrototype, { propertyName: 'verticalContentAlignment', defaultValue: 'flex-start' });
    });
    proto.shouldApplyHeight = function () {
        return false;
    };
    proto.shouldApplyWidth = function () {
        return false;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niFlexibleLayoutContainerModel.js.map