"use strict";
//****************************************
// Chart View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class ChartViewModel extends NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel {
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.historySize = this.element.bufferSize;
            this.model.value = this.element.value;
            this.model.defaultValue = this.element.value;
            /* the history buffer is owned by the chart model. In the case the chart is created by loading it from the HTML document,
            here is the only place we can make sure that the element is informed which history buffer to use. */
            this.element.setHistoryBuffer(this.model.historyBuffer); // make sure the history buffer is shared between element and model
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.setHistoryBuffer(this.model.historyBuffer);
            this.element.value = this.model.value;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(ChartViewModel, NationalInstruments.HtmlVI.Elements.Chart, NationalInstruments.HtmlVI.Models.ChartModel, 'ni-chart');
    NationalInstruments.HtmlVI.ViewModels.ChartViewModel = ChartViewModel;
})();
//# sourceMappingURL=niChartViewModel.js.map