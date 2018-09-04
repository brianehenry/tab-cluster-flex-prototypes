"use strict";
//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    let NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    let NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;
    let CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel = function (element, model) {
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
    let child = NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel;
    let proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    let convertToScalePosition = function (scaleVisible, orientation) {
        let scalePosition = '';
        if (scaleVisible === true) {
            if (orientation === 'vertical') {
                scalePosition = 'near';
            }
            else {
                scalePosition = 'far';
            }
        }
        else {
            scalePosition = 'none';
        }
        return scalePosition;
    };
    let setScalePosition = function (model, renderBuffer) {
        renderBuffer.properties.scalePosition = convertToScalePosition(model.scaleVisible, model.orientation);
    };
    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        let that = this;
        let handleChange = function (event) {
            let newValue = NUM_VAL_CONVERTER.convertBack(event.detail.value, that.model.niType);
            if (that.model.value !== newValue) {
                that.model.controlChanged(newValue);
            }
        };
        that.element.addEventListener('value-changed', function (event) {
            handleChange(event);
        });
        that.element.addEventListener('change', function (event) {
            handleChange(event);
        });
    };
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'orientation' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        let that = this;
        let affectsRender = false;
        let renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'fill':
                renderBuffer.cssStyles[CSS_PROPERTIES.FILL] = this.model.fill;
                break;
            case 'orientation':
                affectsRender = true;
                renderBuffer.properties.orientation = this.model.orientation;
                setScalePosition(this.model, renderBuffer);
                break;
            case 'scaleVisible':
                // scalePosition near or none
                affectsRender = true;
                setScalePosition(this.model, renderBuffer);
                break;
            case 'minimum':
            case 'maximum':
            case 'fontSize':
            case 'fontWeight':
            case 'fontStyle':
            case 'fontFamily':
            case 'textDecoration':
            case 'majorTicksVisible':
            case 'minorTicksVisible':
            case 'labelsVisible':
            case 'rangeDivisionsMode':
            case 'format':
                // properties are set in a base class
                affectsRender = true;
                break;
        }
        if (affectsRender === true) {
            renderBuffer.postRender = function () {
                let size = that.element.getOptimalSize();
                if (that.model.orientation === 'vertical' && size.width > parseInt(that.model.width)) {
                    that.model.sizeChanged('width', size);
                }
                else if (that.model.orientation === 'horizontal' && size.height > parseInt(that.model.height)) {
                    that.model.sizeChanged('height', size);
                }
            };
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        let style;
        parent.prototype.updateModelFromElement.call(this);
        this.model.orientation = this.element.orientation;
        style = window.getComputedStyle(this.element);
        this.model.fill = style.getPropertyValue(CSS_PROPERTIES.FILL);
        if (this.element.scalePosition === 'none') {
            this.model.scaleVisible = false;
        }
        else {
            this.model.scaleVisible = true;
        }
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.orientation = this.model.orientation;
        this.element.scalePosition = convertToScalePosition(this.model.scaleVisible, this.model.orientation);
        this.element.style.setProperty(CSS_PROPERTIES.FILL, this.model.fill);
    };
}(NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel));
//# sourceMappingURL=niLinearNumericPointerViewModel.js.map