"use strict";
//****************************************
// Boolean Button View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class TabControlViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('tabStripPlacement');
        }
        bindToView() {
            super.bindToView();
            let that = this;
            that.element.addEventListener('selected-index-changed', function (event) {
                if (event.target === that.element) {
                    let newValue = event.detail.selectedIndex;
                    that.model.controlChanged(newValue);
                }
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'selectedIndex':
                    renderBuffer.properties.selectedIndexNonSignaling = this.model.selectedIndex;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.selectedIndex = this.element.selectedIndex;
            this.model.defaultValue = this.element.selectedIndex;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.selectedIndex = this.model.selectedIndex;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(TabControlViewModel, NationalInstruments.HtmlVI.Elements.TabControl, NationalInstruments.HtmlVI.Models.TabControlModel);
    NationalInstruments.HtmlVI.ViewModels.TabControlViewModel = TabControlViewModel;
})();
//# sourceMappingURL=niTabControlViewModel.js.map