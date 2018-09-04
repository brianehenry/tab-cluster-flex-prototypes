"use strict";
//****************************************
// Slider View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.SliderViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.SliderViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    // None
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'showTooltip':
                renderBuffer.properties.showTooltip = this.model.showTooltip;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.showTooltip = this.element.showTooltip;
        this.model.mechanicalAction = this.element.mechanicalAction;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.showTooltip = this.model.showTooltip;
        this.element.mechanicalAction = this.model.mechanicalAction;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.SliderModel, 'jqx-slider');
}(NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel));
//# sourceMappingURL=niSliderViewModel.js.map