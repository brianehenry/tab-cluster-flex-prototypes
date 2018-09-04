"use strict";
//****************************************
// Boolean Button View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanButtonViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanButtonViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var setBorderColor = function (color, renderBuffer) {
        // Border in button supports both solid color as well as linear-gradient color.
        // We need to use border-image and border-color as different properties because,
        // there is no shorthand property for them in CSS.
        // We should change border-image to none/initial/unset when we want to set border-color
        // because border-image takes precedence over border-color and setting border-image
        // to none makes it fallback on border-color.
        let borderColorValue, borderImageValue;
        if (color.indexOf('gradient') >= 0) {
            borderImageValue = color;
            borderColorValue = 'unset';
        }
        else {
            borderColorValue = color;
            borderImageValue = 'unset';
        }
        renderBuffer.cssStyles[CSS_PROPERTIES.BORDER_COLOR] = borderColorValue;
        renderBuffer.cssStyles[CSS_PROPERTIES.BORDER_GRADIENT] = borderImageValue;
    };
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueBackground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueForeground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseBackground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseForeground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'borderColor', autoElementSync: false });
    });
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        let that = this;
        that.element.addEventListener('change', function (e) {
            if (that.model.readOnly === true || e.detail.changeType === 'api') {
                return;
            }
            var newValue = e.detail.value;
            if (that.model.value !== newValue) {
                that.model.controlChanged(newValue);
            }
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        let model = this.model;
        let renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'content':
                renderBuffer.properties.content = model.content;
                break;
            case 'value':
                renderBuffer.properties.checked = model.value;
                break;
            case 'trueBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_BACKGROUND] = model.trueBackground;
                break;
            case 'trueForeground':
                renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_FOREGROUND_COLOR] = model.trueForeground;
                break;
            case 'falseBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_BACKGROUND] = model.falseBackground;
                break;
            case 'falseForeground':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_FOREGROUND_COLOR] = model.falseForeground;
                break;
            case 'borderColor':
                setBorderColor(model.borderColor, renderBuffer);
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        let model = this.model;
        let element = this.element;
        parent.prototype.updateModelFromElement.call(this);
        let childElement = element.firstElementChild;
        let contentSpan = childElement.querySelector('.ni-text');
        if (contentSpan !== null) {
            this.model.contentVisible = contentSpan.classList.contains('ni-hidden') !== true;
        }
        model.value = element.value;
        let elementStyle = window.getComputedStyle(element);
        model.content = contentSpan.textContent;
        model.trueBackground = elementStyle.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND);
        model.trueForeground = elementStyle.getPropertyValue(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR);
        model.falseBackground = elementStyle.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND);
        model.falseForeground = elementStyle.getPropertyValue(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR);
        var borderColor = elementStyle.getPropertyValue(CSS_PROPERTIES.BORDER_GRADIENT);
        if (borderColor.indexOf('gradient') === -1) {
            borderColor = elementStyle.getPropertyValue(CSS_PROPERTIES.BORDER_COLOR);
        }
        model.borderColor = borderColor;
    };
    proto.applyModelToElement = function () {
        let model = this.model;
        let element = this.element;
        parent.prototype.applyModelToElement.call(this);
        element.content = model.content;
        element.checked = model.value;
        element.style.setProperty(CSS_PROPERTIES.TRUE_BACKGROUND, model.trueBackground);
        element.style.setProperty(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR, model.trueForeground);
        element.style.setProperty(CSS_PROPERTIES.FALSE_BACKGROUND, model.falseBackground);
        element.style.setProperty(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR, model.falseForeground);
        let borderColor = model.borderColor;
        if (borderColor.indexOf('gradient') >= 0) {
            element.style.setProperty(CSS_PROPERTIES.BORDER_GRADIENT, borderColor);
        }
        else {
            element.style.setProperty(CSS_PROPERTIES.BORDER_COLOR, borderColor);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanButtonModel, 'jqx-toggle-button');
}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));
//# sourceMappingURL=niBooleanButtonViewModel.js.map