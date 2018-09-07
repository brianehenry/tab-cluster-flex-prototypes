"use strict";
//****************************************
// Selector View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class SelectorViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'source':
                    renderBuffer.properties.source = JSON.stringify(this.model.source);
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            if (this.element.source !== undefined) {
                this.model.source = JSON.parse(this.element.source);
            }
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.source = JSON.stringify(this.model.source);
        }
    }
    NationalInstruments.HtmlVI.ViewModels.SelectorViewModel = SelectorViewModel;
})();
//# sourceMappingURL=niSelectorViewModel.js.map