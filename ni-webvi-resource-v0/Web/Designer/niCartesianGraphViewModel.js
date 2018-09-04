"use strict";
//****************************************
// CartesianGraph View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CartesianGraphViewModel = function (element, model) {
        parent.call(this, element, model);
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.CartesianGraphViewModel;
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
        this.model.value = this.element.value;
        this.model.defaultValue = this.element.value;
        this.model.plotAreaMargin = this.element.plotAreaMargin;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.value = this.model.value;
        this.element.plotAreaMargin = this.model.plotAreaMargin;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.CartesianGraph, NationalInstruments.HtmlVI.Models.CartesianGraphModel, 'ni-cartesian-graph');
}(NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel));
//# sourceMappingURL=niCartesianGraphViewModel.js.map