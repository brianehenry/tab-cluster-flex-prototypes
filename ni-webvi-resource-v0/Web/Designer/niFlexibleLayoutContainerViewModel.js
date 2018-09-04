"use strict";
//****************************************
// Flexible Layout Container View Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.FlexibleLayoutContainerViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.FlexibleLayoutContainerViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'direction' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'horizontalContentAlignment' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'verticalContentAlignment' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'direction':
            case 'horizontalContentAlignment':
            case 'verticalContentAlignment':
                this.model.requestSendControlBounds();
                break;
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.FlexibleLayoutContainerModel, 'ni-flexible-layout-container');
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niFlexibleLayoutContainerViewModel.js.map