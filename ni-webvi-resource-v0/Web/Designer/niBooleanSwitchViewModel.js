"use strict";
//****************************************
// Boolean Switch View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    var RENDER_BUFFER = NationalInstruments.HtmlVI.RenderBuffer;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanSwitchViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanSwitchViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'orientation' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseContentVisibility', autoElementSync: false });
    });
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
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
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'falseContentVisibility':
                renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_CONTENT_DISPLAY] = this.model.falseContentVisibility ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var style = window.getComputedStyle(this.element);
        this.model.falseContentVisibility = style.getPropertyValue(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY) !== 'none';
        this.model.textAlignment = TEXTALIGN_VAL_CONVERTER.convertFlexAlignmentToTextAlignment(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX));
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        if (!this.model.falseContentVisibility) {
            this.element.style.setProperty(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY, 'none');
        }
        this.element.switchMode = 'click';
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment));
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanSwitchModel, 'jqx-switch-button');
}(NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel));
//# sourceMappingURL=niBooleanSwitchViewModel.js.map