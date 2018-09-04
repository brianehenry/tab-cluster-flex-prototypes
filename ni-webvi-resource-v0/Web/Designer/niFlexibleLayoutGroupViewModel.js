"use strict";
//****************************************
// Flexible Layout Group View Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.FlexibleLayoutGroupViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.FlexibleLayoutGroupViewModel;
    /* var proto = */ NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    // None
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.FlexibleLayoutGroupModel, 'ni-flexible-layout-group');
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niFlexibleLayoutGroupViewModel.js.map