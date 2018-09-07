"use strict";
//****************************************
// CartesianAxis View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Variables
    // Represents the milliseconds to offset the JS time epoch to make it align with the LV time epoch.
    // Matches the 'NITimeEpochOffsetFromJSEpoch' constant in JsonModelPropertySerializer.cs.
    const niTimeEpochOffsetFromJSEpoch = -2082844800000;
    class CartesianAxisViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('label');
            this.registerAutoSyncProperty('show');
            this.registerAutoSyncProperty('showLabel');
            this.registerAutoSyncProperty('axisPosition');
            this.registerAutoSyncProperty('autoScale');
            this.registerAutoSyncProperty('logScale');
            this.registerAutoSyncProperty('minimum');
            this.registerAutoSyncProperty('maximum');
            this.registerAutoSyncProperty('format');
            this.registerAutoSyncProperty('showTickLabels');
            this.registerAutoSyncProperty('gridLines');
            this.registerAutoSyncProperty('showTicks');
            this.registerAutoSyncProperty('showMinorTicks');
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.timeFormatEpoch = niTimeEpochOffsetFromJSEpoch;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(CartesianAxisViewModel, NationalInstruments.HtmlVI.Elements.CartesianAxis, NationalInstruments.HtmlVI.Models.CartesianAxisModel, 'ni-cartesian-axis');
    NationalInstruments.HtmlVI.ViewModels.CartesianAxisViewModel = CartesianAxisViewModel;
})();
//# sourceMappingURL=niCartesianAxisViewModel.js.map