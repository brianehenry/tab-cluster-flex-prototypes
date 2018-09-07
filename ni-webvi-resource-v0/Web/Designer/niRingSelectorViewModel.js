"use strict";
//****************************************
// RingSelector View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    const TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    // Static Private Variables
    const numericValueWidthCssVariable = '--ni-numeric-value-width';
    class RingSelectorViewModel extends NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('allowUndefined');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'textAlignment':
                    // TextAlignmentCssVariable is for drop down container whereas flexAlignmentCssVariable is for flex container inside drop down.
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                    break;
                case 'numericValueWidth':
                    renderBuffer.cssStyles[numericValueWidthCssVariable] = this.model.numericValueWidth + "px";
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let elementStyle = window.getComputedStyle(this.element);
            this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
            this.model.numericValueWidth = parseFloat(elementStyle.getPropertyValue(numericValueWidthCssVariable));
        }
        applyModelToElement() {
            super.applyModelToElement();
            let justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
            this.element.style.setProperty(numericValueWidthCssVariable, this.model.numericValueWidth + "px");
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(RingSelectorViewModel, NationalInstruments.HtmlVI.Elements.RingSelector, NationalInstruments.HtmlVI.Models.RingSelectorModel);
    NationalInstruments.HtmlVI.ViewModels.RingSelectorViewModel = RingSelectorViewModel;
})();
//# sourceMappingURL=niRingSelectorViewModel.js.map