"use strict";
//****************************************
// Time Stamp Text Box View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var DATETIME_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXDateTimeValueConverter;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.TimeStampTextBoxViewModel = function (element, model) {
        parent.call(this, element, model);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    NationalInstruments.HtmlVI.ViewModels.TimeStampTextBoxViewModel.viewReady = function (element) {
        var calendar;
        NationalInstruments.JQXElement.addHandlersForMouseWheel(element);
        // Workaround for bug where at edit-time you can only click-to-highlight a time field once, without clicking out
        // of then back into the control. Timing issue in-editor where focused event happens before click event, and in
        // the browser it's the other way around.
        if (NationalInstruments.HtmlVI.viReferenceService.getWebAppModelByVIRef(element.viRef).updateService.isInIdeMode()) {
            element.addEventListener('focus', function (evt) {
                evt.stopPropagation();
            }, true);
        }
        // JQX DateTimePicker currently hardcodes selectionMode = 'zeroOrOne', which means clicking the selected date
        // unselects it and the value goes back to the default (today's date). SelectionMode = One disables that.
        calendar = element.querySelector("jqx-calendar");
        if (calendar !== null) {
            calendar.selectionMode = "one";
        }
    };
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.TimeStampTextBoxViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var computeEditMode = function (viewModel) {
        return viewModel.computeReadOnlyForElement() ? 'full' : 'default'; // 'full' prevents the click-select of individual date/time segments when an indicator, which isn't wanted
    };
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
    });
    proto.getReadOnlyPropertyName = function () {
        return 'readonly';
    };
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.bindTextFocusEventListener();
        that.element.addEventListener('change', function (event) {
            if (event.target === that.element) {
                var newValue = DATETIME_VAL_CONVERTER.convertBack(event.detail.value, that.element);
                that.model.controlChanged(newValue);
            }
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'value':
                renderBuffer.properties.value = DATETIME_VAL_CONVERTER.convert(this.model.value);
                break;
            case 'minimum':
                renderBuffer.properties.min = DATETIME_VAL_CONVERTER.convert(this.model.minimum);
                break;
            case 'maximum':
                renderBuffer.properties.max = DATETIME_VAL_CONVERTER.convert(this.model.maximum);
                break;
            case 'showCalendarButton':
                renderBuffer.properties.calendarButton = this.model.showCalendarButton;
                break;
            case 'spinButtons':
                renderBuffer.properties.spinButtons = this.model.spinButtons;
                break;
            case 'formatString':
                renderBuffer.attributes['format-string'] = this.model.formatString; // TA282253 - Using attribute instead of property due to JQX bug with handling slashes in values
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.value = DATETIME_VAL_CONVERTER.convertBack(this.element.value, this.element);
        this.model.minimum = DATETIME_VAL_CONVERTER.convertBack(this.element.min, this.element);
        this.model.maximum = DATETIME_VAL_CONVERTER.convertBack(this.element.max, this.element);
        this.model.spinButtons = this.element.spinButtons;
        this.model.showCalendarButton = this.element.calendarButton;
        this.model.formatString = this.element.formatString;
        var style = window.getComputedStyle(this.element);
        this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.value = DATETIME_VAL_CONVERTER.convert(this.model.value);
        this.element.min = DATETIME_VAL_CONVERTER.convert(this.model.minimum);
        this.element.max = DATETIME_VAL_CONVERTER.convert(this.model.maximum);
        this.element.spinButtons = this.model.spinButtons;
        this.element.setAttribute('format-string', this.model.formatString); // TA282253 - Using attribute instead of property due to JQX bug with handling slashes in values
        this.element.showCalendarButton = this.model.showCalendarButton;
        this.element.spinButtonsPosition = 'left';
        this.element.spinButtonsInitialDelay = 500;
        this.element.dropDownDisplayMode = 'classic';
        this.element.displayKind = 'local';
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        this.element.editMode = computeEditMode(this);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel, 'jqx-date-time-picker');
    // Inheritance is different from C# view model (where time stamp is a numeric) so that min/max/value properties can have a different datatype
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niTimeStampTextBoxViewModel.js.map