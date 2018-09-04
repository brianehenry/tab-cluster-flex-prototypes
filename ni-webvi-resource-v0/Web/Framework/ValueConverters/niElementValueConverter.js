"use strict";
(function () {
    'use strict';
    // Static private reference aliases.
    var NIType = window.NIType;
    // Static private variables.
    // None
    // Static private methods.
    var findConverterForElementName = function (elemName) {
        elemName = elemName.toLowerCase();
        switch (elemName) {
            // Numerics
            case 'jqx-numeric-text-box':
            case 'jqx-gauge':
            case 'jqx-tank':
            case 'jqx-slider':
                return NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;
            case 'ni-ring-selector':
            case 'ni-enum-selector':
            case 'ni-radio-button-group':
                return NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
            case 'jqx-drop-down-list':
                return NationalInstruments.HtmlVI.ValueConverters.DropDownValueConverter;
            case 'jqx-list-box':
                return NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;
            case 'ni-path-selector':
            case 'ni-cartesian-graph':
                return NationalInstruments.HtmlVI.ValueConverters.JsonValueConverter;
            case 'jqx-date-time-picker':
                return NationalInstruments.HtmlVI.ValueConverters.JQXDateTimeValueConverter;
            default:
                return NationalInstruments.HtmlVI.ValueConverters.ValueConverter;
        }
    };
    var getParametersForElement = function (element) {
        var elemName = element.tagName.toLowerCase();
        switch (elemName) {
            case 'jqx-numeric-text-box':
            case 'jqx-gauge':
            case 'jqx-tank':
            case 'jqx-slider':
                return NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter.convertJQXTypeToNI(element);
            case 'ni-ring-selector':
            case 'ni-enum-selector':
            case 'ni-radio-button-group':
                return new NIType(element.niType);
            case 'jqx-list-box':
                return NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter.convertJQXToNISelectionMode(element.selectionMode);
            case 'jqx-date-time-picker':
                return element;
            default:
                return undefined;
        }
    };
    NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter = {};
    NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter.FindValueConverter = function (element) {
        return findConverterForElementName(element.tagName);
    };
    NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter.GetConverterParameters = function (element) {
        return getParametersForElement(element);
    };
    NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter.Convert = function (element, value) {
        var elementName = element.tagName, converter = findConverterForElementName(elementName);
        return converter.convert(value, getParametersForElement(element));
    };
    NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter.ConvertBack = function (element, value) {
        var elementName = element.tagName, converter = findConverterForElementName(elementName);
        return converter.convertBack(value, getParametersForElement(element));
    };
}());
//# sourceMappingURL=niElementValueConverter.js.map