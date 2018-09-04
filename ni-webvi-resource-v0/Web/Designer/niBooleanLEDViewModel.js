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
    NationalInstruments.HtmlVI.ViewModels.BooleanLEDViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanLEDViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'shape' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueBackground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueForeground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseBackground', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseForeground', autoElementSync: false });
    });
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.element.addEventListener('change', function (e) {
            if (that.model.readOnly === true || e.detail.changeType === 'api') {
                return;
            }
            var newValue = e.detail.value;
            if (newValue !== that.model.value) {
                that.model.controlChanged(newValue);
            }
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'trueBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_BACKGROUND] = this.model.trueBackground;
                break;
            case 'trueForeground':
                renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_FOREGROUND_COLOR] = this.model.trueForeground;
                break;
            case 'falseBackground':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_BACKGROUND] = this.model.falseBackground;
                break;
            case 'falseForeground':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_FOREGROUND_COLOR] = this.model.falseForeground;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var style = window.getComputedStyle(this.element);
        this.model.trueBackground = style.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND);
        this.model.trueForeground = style.getPropertyValue(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR);
        this.model.falseBackground = style.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND);
        this.model.falseForeground = style.getPropertyValue(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR);
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.style.setProperty(CSS_PROPERTIES.TRUE_BACKGROUND, this.model.trueBackground);
        this.element.style.setProperty(CSS_PROPERTIES.TRUE_FOREGROUND_COLOR, this.model.trueForeground);
        this.element.style.setProperty(CSS_PROPERTIES.FALSE_BACKGROUND, this.model.falseBackground);
        this.element.style.setProperty(CSS_PROPERTIES.FALSE_FOREGROUND_COLOR, this.model.falseForeground);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanLEDModel, 'jqx-led');
}(NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel));
//# sourceMappingURL=niBooleanLEDViewModel.js.map