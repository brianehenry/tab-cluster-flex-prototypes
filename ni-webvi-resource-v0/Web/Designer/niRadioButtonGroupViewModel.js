"use strict";
//****************************************
// RadioButtonGroupViewModel View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    class RadioButtonGroupViewModel extends NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('orientation');
            this.registerAutoSyncProperty('selectedButtonBackground');
            this.registerAutoSyncProperty('unselectedButtonBackground');
            this.registerAutoSyncProperty('textColor');
        }
        modelPropertyChanged(propertyName) {
            let model = this.model;
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = model.textAlignment;
                    break;
                case 'selectedButtonBackground':
                    renderBuffer.cssStyles[CSS_PROPERTIES.SELECTED_BACKGROUND] = model.selectedButtonBackground;
                    break;
                case 'unselectedButtonBackground':
                    renderBuffer.cssStyles[CSS_PROPERTIES.UNSELECTED_BACKGROUND] = model.unselectedButtonBackground;
                    break;
                case 'textColor':
                    renderBuffer.cssStyles[CSS_PROPERTIES.FOREGROUND_COLOR] = model.textColor;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            let model = this.model;
            let element = this.element;
            super.updateModelFromElement();
            let style = window.getComputedStyle(element);
            model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
            model.selectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.SELECTED_BACKGROUND);
            model.unselectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.UNSELECTED_BACKGROUND);
            model.textColor = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
        }
        applyModelToElement() {
            let model = this.model;
            let element = this.element;
            super.applyModelToElement();
            element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, model.textAlignment);
            element.style.setProperty(CSS_PROPERTIES.SELECTED_BACKGROUND, model.selectedButtonBackground);
            element.style.setProperty(CSS_PROPERTIES.UNSELECTED_BACKGROUND, model.unselectedButtonBackground);
            element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.textColor);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(RadioButtonGroupViewModel, NationalInstruments.HtmlVI.Elements.RadioButtonGroup, NationalInstruments.HtmlVI.Models.RadioButtonGroupModel);
    NationalInstruments.HtmlVI.ViewModels.RadioButtonGroupViewModel = RadioButtonGroupViewModel;
})();
//# sourceMappingURL=niRadioButtonGroupViewModel.js.map