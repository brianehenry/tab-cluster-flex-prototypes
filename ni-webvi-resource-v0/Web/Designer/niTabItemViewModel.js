"use strict";
//****************************************
// TabItem View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class TabItemViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('header');
            this.registerAutoSyncProperty('tabPosition');
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(TabItemViewModel, NationalInstruments.HtmlVI.Elements.TabItem, NationalInstruments.HtmlVI.Models.TabItemModel);
    NationalInstruments.HtmlVI.ViewModels.TabItemViewModel = TabItemViewModel;
})();
//# sourceMappingURL=niTabItemViewModel.js.map