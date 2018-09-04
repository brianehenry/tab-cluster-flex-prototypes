"use strict";
//****************************************
// CheckBox View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CheckBoxViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.CheckBoxViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.element.addEventListener('change', function () {
            if (that.model.readOnly === true) {
                return;
            }
            var newValue = that.element.checked;
            if (that.model.value !== newValue) {
                that.model.controlChanged(newValue);
            }
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var model = this.model;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'content':
                renderBuffer.properties.content = model.content;
                break;
            case 'value':
                renderBuffer.properties.checked = model.value;
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = model.textAlignment;
                break;
            case 'trueBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_BACKGROUND] = model.trueBackground;
                break;
            case 'falseBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_BACKGROUND] = model.falseBackground;
                break;
            case 'textColor':
                renderBuffer.cssStyles[CSS_PROPERTIES.FOREGROUND_COLOR] = model.textColor;
                break;
            case 'checkMarkColor':
                renderBuffer.cssStyles[CSS_PROPERTIES.CHECK_MARK_COLOR] = model.checkMarkColor;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        let contentSpan = this.element.querySelector('.ni-text');
        if (contentSpan !== null) {
            this.model.contentVisible = contentSpan.classList.contains('ni-hidden') !== true;
        }
        this.model.readOnly = this.element.readonly;
        this.model.value = this.element.checked;
        let style = window.getComputedStyle(this.element);
        this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        this.model.trueBackground = style.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND);
        this.model.falseBackground = style.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND);
        this.model.textColor = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
        this.model.checkMarkColor = style.getPropertyValue(CSS_PROPERTIES.CHECK_MARK_COLOR);
    };
    proto.applyModelToElement = function () {
        let element = this.element;
        let model = this.model;
        parent.prototype.applyModelToElement.call(this);
        element.content = model.content;
        element.checked = model.value;
        element.enableContainerClick = true;
        element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, model.textAlignment);
        element.style.setProperty(CSS_PROPERTIES.TRUE_BACKGROUND, model.trueBackground);
        element.style.setProperty(CSS_PROPERTIES.FALSE_BACKGROUND, model.falseBackground);
        element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.textColor);
        element.style.setProperty(CSS_PROPERTIES.CHECK_MARK_COLOR, model.checkMarkColor);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.CheckBoxModel, 'jqx-check-box');
}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));
//# sourceMappingURL=niCheckBoxViewModel.js.map