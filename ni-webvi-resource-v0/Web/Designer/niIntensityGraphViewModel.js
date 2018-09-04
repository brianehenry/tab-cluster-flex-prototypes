"use strict";
//****************************************
// IntensityGraph View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.IntensityGraphViewModel = function (element, model) {
        parent.call(this, element, model);
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.IntensityGraphViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        var that = this;
        switch (propertyName) {
            case 'value':
                renderBuffer.postRender = function () {
                    that.element.setData(that.model.value);
                };
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var element = this.element, model = this.model;
        model.value = element.value;
        model.defaultValue = element.value;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        var element = this.element, model = this.model;
        element.value = model.value;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.IntensityGraph, NationalInstruments.HtmlVI.Models.IntensityGraphModel, 'ni-intensity-graph');
}(NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel));
//# sourceMappingURL=niIntensityGraphViewModel.js.map