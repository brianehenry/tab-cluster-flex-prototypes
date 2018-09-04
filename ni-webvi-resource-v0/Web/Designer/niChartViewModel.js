"use strict";
//****************************************
// Chart View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ChartViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ChartViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.historySize = this.element.bufferSize;
        this.model.value = this.element.value;
        this.model.defaultValue = this.element.value;
        /* the history buffer is owned by the chart model. In the case the chart is created by loading it from the HTML document,
        here is the only place we can make sure that the element is informed which history buffer to use. */
        this.element.setHistoryBuffer(this.model.historyBuffer); // make sure the history buffer is shared between element and model
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.setHistoryBuffer(this.model.historyBuffer);
        this.element.value = this.model.value;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Chart, NationalInstruments.HtmlVI.Models.ChartModel, 'ni-chart');
}(NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel));
//# sourceMappingURL=niChartViewModel.js.map