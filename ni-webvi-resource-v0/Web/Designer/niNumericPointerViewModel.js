"use strict";
//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var convertToTicksVisibility = function (majorTicksVisible, minorTicksVisible) {
        var ticksVisibility = '';
        if (majorTicksVisible && minorTicksVisible) {
            ticksVisibility = 'minor';
        }
        else if (majorTicksVisible && !minorTicksVisible) {
            ticksVisibility = 'major';
        }
        else {
            ticksVisibility = 'none';
        }
        return ticksVisibility;
    };
    var convertToLabelsVisibility = function (labelsVisible, rangeDivisionsMode) {
        var labelsVisibility = '';
        if (labelsVisible === true && rangeDivisionsMode === 'auto') {
            labelsVisibility = 'all';
        }
        else if (labelsVisible === true && rangeDivisionsMode === 'count(2)') {
            labelsVisibility = 'endPoints';
        }
        else {
            labelsVisibility = 'none';
        }
        return labelsVisibility;
    };
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'scaleVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'majorTicksVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'minorTicksVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'labelsVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'coercionMode' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'rangeDivisionsMode' });
    });
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'significantDigits':
                if (this.model.significantDigits === -1) {
                    renderBuffer.properties.significantDigits = null;
                }
                else {
                    renderBuffer.properties.significantDigits = this.model.significantDigits;
                }
                break;
            case 'precisionDigits':
                if (this.model.precisionDigits === -1) {
                    renderBuffer.properties.precisionDigits = null;
                }
                else {
                    renderBuffer.properties.precisionDigits = this.model.precisionDigits;
                }
                break;
            case 'minimum':
                renderBuffer.properties.min = NUM_VAL_CONVERTER.convert(this.model.minimum, this.model.niType);
                break;
            case 'maximum':
                renderBuffer.properties.max = NUM_VAL_CONVERTER.convert(this.model.maximum, this.model.niType);
                break;
            case 'interval':
                renderBuffer.properties.interval = NUM_VAL_CONVERTER.convert(this.model.interval, this.model.niType);
                break;
            case 'value':
                renderBuffer.properties.value = NUM_VAL_CONVERTER.convert(this.model.value, this.model.niType);
                break;
            case 'niType':
                renderBuffer.properties.scaleType = NUM_VAL_CONVERTER.convertNITypeToJQX(this.model.niType);
                if (renderBuffer.properties.scaleType === 'integer') {
                    renderBuffer.properties.wordLength = this.model.niType.getName().toLowerCase();
                }
                break;
            case 'majorTicksVisible':
            case 'minorTicksVisible':
                renderBuffer.properties.ticksVisibility = convertToTicksVisibility(this.model.majorTicksVisible, this.model.minorTicksVisible);
                break;
            case 'labelsVisible':
            case 'rangeDivisionsMode':
                renderBuffer.properties.labelsVisibility = convertToLabelsVisibility(this.model.labelsVisible, this.model.rangeDivisionsMode);
                break;
            case 'format':
                if (this.model.format === 'scientific') {
                    renderBuffer.properties.scientificNotation = true;
                }
                else {
                    renderBuffer.properties.scientificNotation = false;
                }
                break;
            case 'coercionMode':
                renderBuffer.properties.coerce = this.model.coercionMode;
                break;
            case 'mechanicalAction':
                renderBuffer.properties.mechanicalAction = this.model.mechanicalAction;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.niType = NUM_VAL_CONVERTER.convertJQXTypeToNI(this.element);
        this.model.value = NUM_VAL_CONVERTER.convertBack(this.element.value, this.model.niType);
        this.model.maximum = NUM_VAL_CONVERTER.convertBack(this.element.max, this.model.niType);
        this.model.minimum = NUM_VAL_CONVERTER.convertBack(this.element.min, this.model.niType);
        this.model.interval = NUM_VAL_CONVERTER.convertBack(this.element.interval, this.model.niType);
        if (this.element.significantDigits !== null) {
            this.model.significantDigits = this.element.significantDigits;
            this.model.precisionDigits = -1;
        }
        else if (this.element.precisionDigits !== null) {
            this.model.precisionDigits = this.element.precisionDigits;
            this.model.significantDigits = -1;
        }
        this.model.coercionMode = this.element.coerce;
        if (this.element.ticksVisibility === 'minor') {
            this.model.majorTicksVisible = true;
            this.model.minorTicksVisible = true;
        }
        else if (this.element.ticksVisibility === 'major') {
            this.model.majorTicksVisible = true;
            this.model.minorTicksVisible = false;
        }
        else {
            this.model.majorTicksVisible = false;
            this.model.minorTicksVisible = false;
        }
        if (this.element.labelsVisibility === 'none') {
            this.model.labelsVisible = false;
        }
        else {
            this.model.labelsVisible = true;
            if (this.element.labelsVisibility === 'all') {
                this.model.rangeDivisionsMode = 'auto';
            }
            else {
                this.model.rangeDivisionsMode = 'count(2)';
            }
        }
        if (this.element.scientificNotation === true) {
            this.model.format = 'scientific';
        }
        else {
            this.model.format = '';
        }
        this.model.mechanicalAction = this.element.mechanicalAction;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.max = NUM_VAL_CONVERTER.convert(this.model.maximum, this.model.niType);
        this.element.min = NUM_VAL_CONVERTER.convert(this.model.minimum, this.model.niType);
        this.element.interval = NUM_VAL_CONVERTER.convert(this.model.interval, this.model.niType);
        this.element.value = NUM_VAL_CONVERTER.convert(this.model.value, this.model.niType);
        this.element.scaleType = NUM_VAL_CONVERTER.convertNITypeToJQX(this.model.niType);
        if (this.element.scaleType === 'integer') {
            this.element.wordLength = this.model.niType.getName().toLowerCase();
        }
        if (this.model.significantDigits >= 0) {
            this.element.significantDigits = this.model.significantDigits;
            this.element.precisionDigits = null;
        }
        else if (this.model.precisionDigits >= 0) {
            this.element.precisionDigits = this.model.precisionDigits;
            this.element.significantDigits = null;
        }
        this.element.coerce = this.model.coercionMode;
        this.element.ticksVisibility = convertToTicksVisibility(this.model.majorTicksVisible, this.model.minorTicksVisible);
        this.element.labelsVisibility = convertToLabelsVisibility(this.model.labelsVisible, this.model.rangeDivisionsMode);
        if (this.model.format === 'scientific') {
            this.element.scientificNotation = true;
        }
        this.element.mechanicalAction = this.model.mechanicalAction;
    };
}(NationalInstruments.HtmlVI.ViewModels.NumericControlViewModel));
//# sourceMappingURL=niNumericPointerViewModel.js.map