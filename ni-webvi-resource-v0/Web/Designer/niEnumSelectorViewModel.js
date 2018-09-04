"use strict";
//****************************************
// EnumSelector View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    let NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    let TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    let CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.EnumSelectorViewModel = function (element, model) {
        parent.call(this, element, model);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    let child = NationalInstruments.HtmlVI.ViewModels.EnumSelectorViewModel;
    let proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
    });
    proto.modelPropertyChanged = function (propertyName) {
        let that = this;
        let renderBuffer = parent.prototype.modelPropertyChanged.call(that, propertyName);
        switch (propertyName) {
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(that.model.textAlignment);
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = that.model.textAlignment;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        let elementStyle = window.getComputedStyle(this.element);
        this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        let justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.EnumSelector, NationalInstruments.HtmlVI.Models.EnumSelectorModel);
}(NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel));
//# sourceMappingURL=niEnumSelectorViewModel.js.map