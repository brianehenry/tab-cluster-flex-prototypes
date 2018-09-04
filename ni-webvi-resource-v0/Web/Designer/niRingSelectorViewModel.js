"use strict";
//****************************************
// RingSelector View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    let NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    let TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    let CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.RingSelectorViewModel = function (element, model) {
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
    let child = NationalInstruments.HtmlVI.ViewModels.RingSelectorViewModel;
    let proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    const numericValueWidthCssVariable = '--ni-numeric-value-width';
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowUndefined' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        let renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
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
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        let elementStyle = window.getComputedStyle(this.element);
        this.model.textAlignment = elementStyle.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        this.model.numericValueWidth = parseFloat(elementStyle.getPropertyValue(numericValueWidthCssVariable));
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        let justifyContent = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, justifyContent);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        this.element.style.setProperty(numericValueWidthCssVariable, this.model.numericValueWidth + "px");
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.RingSelector, NationalInstruments.HtmlVI.Models.RingSelectorModel);
}(NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel));
//# sourceMappingURL=niRingSelectorViewModel.js.map