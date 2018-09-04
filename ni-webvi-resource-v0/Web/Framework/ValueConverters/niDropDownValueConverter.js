"use strict";
(function () {
    'use strict';
    // Static private reference aliases
    NationalInstruments.HtmlVI.ValueConverters.DropDownValueConverter = function () {
        // Private variables
    };
    var dropDownValueConverter = NationalInstruments.HtmlVI.ValueConverters.DropDownValueConverter;
    // Public methods
    // Model -> Element
    dropDownValueConverter.convert = function (selectedIndex) {
        var result = selectedIndex;
        if (!Array.isArray(selectedIndex)) {
            result = selectedIndex >= 0 ? [selectedIndex] : [];
        }
        else {
            result = selectedIndex;
        }
        return result;
    };
    // Element -> Model
    dropDownValueConverter.convertBack = function (selectedIndex) {
        var result;
        result = selectedIndex;
        if (Array.isArray(selectedIndex)) {
            result = result.length > 0 ? result[0] : -1;
        }
        else {
            result = result >= 0 ? [result] : [];
        }
        return result;
    };
}());
//# sourceMappingURL=niDropDownValueConverter.js.map