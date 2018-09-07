"use strict";
//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class NumericControlViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        getReadOnlyPropertyName() {
            return 'readonly';
        }
    }
    NationalInstruments.HtmlVI.ViewModels.NumericControlViewModel = NumericControlViewModel;
})();
//# sourceMappingURL=niNumericControlViewModel.js.map