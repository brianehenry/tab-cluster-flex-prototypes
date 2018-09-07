"use strict";
//****************************************
// CartesianPlot View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class CartesianPlotViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('label');
            this.registerAutoSyncProperty('show');
            this.registerAutoSyncProperty('xaxis');
            this.registerAutoSyncProperty('yaxis');
            this.registerAutoSyncProperty('enableHover');
            this.registerAutoSyncProperty('hoverFormat');
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(CartesianPlotViewModel, NationalInstruments.HtmlVI.Elements.CartesianPlot, NationalInstruments.HtmlVI.Models.CartesianPlotModel, 'ni-cartesian-plot');
    NationalInstruments.HtmlVI.ViewModels.CartesianPlotViewModel = CartesianPlotViewModel;
})();
//# sourceMappingURL=niCartesianPlotViewModel.js.map