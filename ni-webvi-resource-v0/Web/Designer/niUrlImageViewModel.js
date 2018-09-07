"use strict";
//****************************************
// Url Image View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class UrlImageViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('alternate');
            this.registerAutoSyncProperty('stretch');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'source':
                    renderBuffer.properties.sourceNonSignaling = this.model.source;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.defaultValue = this.element.source;
            this.model.source = this.element.source;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.sourceNonSignaling = this.model.source;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(UrlImageViewModel, NationalInstruments.HtmlVI.Elements.UrlImage, NationalInstruments.HtmlVI.Models.UrlImageModel);
    NationalInstruments.HtmlVI.ViewModels.UrlImageViewModel = UrlImageViewModel;
})();
//# sourceMappingURL=niUrlImageViewModel.js.map