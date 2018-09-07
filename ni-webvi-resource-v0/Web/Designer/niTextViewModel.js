"use strict";
//****************************************
// Text View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    class TextViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('text');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let model = this.model, element = this.element;
            let style = window.getComputedStyle(element);
            model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
            model.defaultValue = element.text;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(TextViewModel, NationalInstruments.HtmlVI.Elements.Text, NationalInstruments.HtmlVI.Models.TextModel);
    NationalInstruments.HtmlVI.ViewModels.TextViewModel = TextViewModel;
})();
//# sourceMappingURL=niTextViewModel.js.map