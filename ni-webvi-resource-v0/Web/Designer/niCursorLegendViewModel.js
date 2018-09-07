"use strict";
//****************************************
// CursorLegend View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class CursorLegendViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('graphRef');
            this.registerAutoSyncProperty('isInEditMode');
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            // TODO mraj what is this about?
            this.model.height = 'auto';
            this.element.style.height = 'auto';
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(CursorLegendViewModel, NationalInstruments.HtmlVI.Elements.CursorLegend, NationalInstruments.HtmlVI.Models.CursorLegendModel, 'ni-cursor-legend');
    NationalInstruments.HtmlVI.ViewModels.CursorLegendViewModel = CursorLegendViewModel;
})();
//# sourceMappingURL=niCursorLegendViewModel.js.map