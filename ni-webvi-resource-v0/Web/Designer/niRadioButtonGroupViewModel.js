"use strict";
//****************************************
// RadioButtonGroupViewModel View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.RadioButtonGroupViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.RadioButtonGroupViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'orientation' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectedButtonBackground' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'unselectedButtonBackground' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'textColor' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        var model = this.model;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
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
    };
    proto.updateModelFromElement = function () {
        let model = this.model;
        let element = this.element;
        parent.prototype.updateModelFromElement.call(this);
        let style = window.getComputedStyle(element);
        model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        model.selectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.SELECTED_BACKGROUND);
        model.unselectedButtonBackground = style.getPropertyValue(CSS_PROPERTIES.UNSELECTED_BACKGROUND);
        model.textColor = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
    };
    proto.applyModelToElement = function () {
        let model = this.model;
        let element = this.element;
        parent.prototype.applyModelToElement.call(this);
        element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, model.textAlignment);
        element.style.setProperty(CSS_PROPERTIES.SELECTED_BACKGROUND, model.selectedButtonBackground);
        element.style.setProperty(CSS_PROPERTIES.UNSELECTED_BACKGROUND, model.unselectedButtonBackground);
        element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.textColor);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.RadioButtonGroup, NationalInstruments.HtmlVI.Models.RadioButtonGroupModel);
}(NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel));
//# sourceMappingURL=niRadioButtonGroupViewModel.js.map