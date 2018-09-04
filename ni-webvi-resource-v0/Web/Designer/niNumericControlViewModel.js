"use strict";
//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.NumericControlViewModel = function (element, model) {
        parent.call(this, element, model);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.NumericControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    proto.getReadOnlyPropertyName = function () {
        return 'readonly';
    };
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    // None
    // (Note: Currently handling for Min/Max/Value/etc changes are handled in the derived viewmodels, since the properties
    //        they map to on the JQX Elements aren't identical across all of the numerics.)
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niNumericControlViewModel.js.map