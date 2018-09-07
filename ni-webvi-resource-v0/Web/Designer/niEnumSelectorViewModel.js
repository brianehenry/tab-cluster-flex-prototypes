"use strict";
//****************************************
// EnumSelector View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    class EnumSelectorViewModel extends NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel {
        modelPropertyChanged(propertyName) {
            let that = this;
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(that.model.textAlignment);
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = that.model.textAlignment;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let elementStyle = window.getComputedStyle(this.element);
            this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        }
        applyModelToElement() {
            super.applyModelToElement();
            let justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(EnumSelectorViewModel, NationalInstruments.HtmlVI.Elements.EnumSelector, NationalInstruments.HtmlVI.Models.EnumSelectorModel);
    NationalInstruments.HtmlVI.ViewModels.EnumSelectorViewModel = EnumSelectorViewModel;
})();
//# sourceMappingURL=niEnumSelectorViewModel.js.map