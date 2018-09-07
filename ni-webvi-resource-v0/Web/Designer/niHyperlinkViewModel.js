"use strict";
//****************************************
// Hyperlink View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    class HyperlinkViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('content');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'href':
                    renderBuffer.properties.href = this.model.href;
                    break;
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let model = this.model, element = this.element;
            model.defaultValue = element.href;
            model.href = element.href;
            let style = window.getComputedStyle(this.element);
            this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.href = this.model.href;
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(HyperlinkViewModel, null, NationalInstruments.HtmlVI.Models.HyperlinkModel, 'ni-hyperlink');
    NationalInstruments.HtmlVI.ViewModels.HyperlinkViewModel = HyperlinkViewModel;
})();
//# sourceMappingURL=niHyperlinkViewModel.js.map