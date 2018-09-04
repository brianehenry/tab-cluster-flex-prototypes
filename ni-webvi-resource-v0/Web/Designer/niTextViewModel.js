"use strict";
//****************************************
// Text View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.TextViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.TextViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'text' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var model = this.model, element = this.element;
        var style = window.getComputedStyle(element);
        model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        model.defaultValue = element.text;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Text, NationalInstruments.HtmlVI.Models.TextModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niTextViewModel.js.map