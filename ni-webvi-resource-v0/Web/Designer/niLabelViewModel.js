"use strict";
//****************************************
// Label View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class LabelViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('text');
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(LabelViewModel, NationalInstruments.HtmlVI.Elements.Label, NationalInstruments.HtmlVI.Models.LabelModel);
    NationalInstruments.HtmlVI.ViewModels.LabelViewModel = LabelViewModel;
})();
//# sourceMappingURL=niLabelViewModel.js.map