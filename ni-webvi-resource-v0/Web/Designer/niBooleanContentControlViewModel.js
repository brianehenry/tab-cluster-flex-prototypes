"use strict";
//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    var RENDER_BUFFER = NationalInstruments.HtmlVI.RenderBuffer;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueContent' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseContent' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'contentVisible':
                renderBuffer.cssStyles[CSS_PROPERTIES.CONTENT_DISPLAY] = this.model.contentVisible ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                break;
            case 'value':
                renderBuffer.properties.checked = this.model.value;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var style = window.getComputedStyle(this.element);
        this.model.contentVisible = style.getPropertyValue(CSS_PROPERTIES.CONTENT_DISPLAY) !== 'none';
        this.model.value = this.element.checked;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        if (!this.model.contentVisible) {
            this.element.style.setProperty(CSS_PROPERTIES.CONTENT_DISPLAY, 'none');
        }
        this.element.checked = this.model.value;
    };
}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));
//# sourceMappingURL=niBooleanContentControlViewModel.js.map