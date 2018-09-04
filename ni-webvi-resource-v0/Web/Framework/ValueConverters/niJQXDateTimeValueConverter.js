"use strict";
(function () {
    'use strict';
    // Static private reference aliases
    NationalInstruments.HtmlVI.ValueConverters.JQXDateTimeValueConverter = function () {
        // Private variables
        this._fallbackVal = new JQX.Utilities.DateTime(new Date(-2082844800000)); // LV epoch
    };
    var dateTimeValueConverter = NationalInstruments.HtmlVI.ValueConverters.JQXDateTimeValueConverter;
    // Public methods
    /**
     * Convert a date/ time value from Model to Element format.
     * @param {string} val - A date/ time string "seconds:fractionalSeconds"
     * @returns {Object} A JQX DateTime object
     */
    dateTimeValueConverter.convert = function (val) {
        let jsDate = new window.NITimestamp(val).toDate();
        if (isNaN(jsDate.getTime())) {
            // avoid an exception calling toISOString on dates that are outside the range of JS Date
            return new JQX.Utilities.DateTime(jsDate);
        }
        var jqxDate = new JQX.Utilities.DateTime(jsDate.toISOString(), 'UTC');
        return jqxDate;
    };
    /**
     * Convert a DateTime value from Element to Model format.
     * @param {Object} val - A JQX DateTime object, or a string representing a JQX DateTime
     * @param {Object} element - a reference to the control element
     * @returns {string} A date/ time string "seconds:fractionalSeconds"
     */
    dateTimeValueConverter.convertBack = function (val, element) {
        if (typeof val === 'string') {
            // jqxdatetimepicker._validateInitialPropertyValues happens after applyModelToElement, so we can get
            // string values that haven't been turned into the corresponding JQX.Utilities.DateTime objects yet
            val = JQX.Utilities.DateTime.validateDate(val, dateTimeValueConverter._fallbackVal);
        }
        return new window.NITimestamp(new Date(val.toTimeZone('UTC').toString('yyyy-MM-ddTHH:mm:ss') + 'Z')).toString();
    };
}());
//# sourceMappingURL=niJQXDateTimeValueConverter.js.map