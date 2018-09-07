"use strict";
//****************************************
// IntensityGraph View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class IntensityGraphViewModel extends NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel {
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            let that = this;
            switch (propertyName) {
                case 'value':
                    renderBuffer.postRender = function () {
                        that.element.setData(that.model.value);
                    };
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let element = this.element, model = this.model;
            model.value = element.value;
            model.defaultValue = element.value;
        }
        applyModelToElement() {
            super.applyModelToElement();
            let element = this.element, model = this.model;
            element.value = model.value;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(IntensityGraphViewModel, NationalInstruments.HtmlVI.Elements.IntensityGraph, NationalInstruments.HtmlVI.Models.IntensityGraphModel, 'ni-intensity-graph');
    NationalInstruments.HtmlVI.ViewModels.IntensityGraphViewModel = IntensityGraphViewModel;
})();
//# sourceMappingURL=niIntensityGraphViewModel.js.map