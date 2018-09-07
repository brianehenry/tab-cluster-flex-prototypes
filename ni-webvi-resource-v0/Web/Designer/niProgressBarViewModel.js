"use strict";
//****************************************
// Progress Bar View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class ProgressBarViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('maximum');
            this.registerAutoSyncProperty('minimum');
            this.registerAutoSyncProperty('value');
            this.registerAutoSyncProperty('indeterminate');
        }
        getReadOnlyPropertyName() {
            return 'readonly';
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'minimum':
                    renderBuffer.properties.min = this.model.minimum;
                    break;
                case 'maximum':
                    renderBuffer.properties.max = this.model.maximum;
                    break;
                case 'value':
                    renderBuffer.properties.value = this.model.value;
                    break;
                case 'indeterminate':
                    renderBuffer.properties.indeterminate = this.model.indeterminate;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.value = this.element.value;
            this.model.maximum = this.element.max;
            this.model.minimum = this.element.min;
            this.model.indeterminate = this.element.indeterminate;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.max = this.model.maximum;
            this.element.min = this.model.minimum;
            this.element.value = this.model.value;
            this.element.indeterminate = this.model.indeterminate;
        }
    }
    NationalInstruments.HtmlVI.ViewModels.ProgressBarViewModel = ProgressBarViewModel;
})();
//# sourceMappingURL=niProgressBarViewModel.js.map