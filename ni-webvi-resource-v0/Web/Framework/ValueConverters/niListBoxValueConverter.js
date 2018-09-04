"use strict";
(function () {
    'use strict';
    // Static private reference aliases
    var LISTBOX_SELECTION_ENUM = NationalInstruments.HtmlVI.NIListBox.SelectionModeEnum;
    NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter = function () {
        // Private variables
    };
    var listBoxValueConverter = NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;
    // Public methods
    listBoxValueConverter.convertNIToJQXSelectionMode = function (selectionMode) {
        switch (selectionMode) {
            case LISTBOX_SELECTION_ENUM.ZERO_OR_ONE:
                return 'zeroOrOne';
            case LISTBOX_SELECTION_ENUM.ONE:
                return 'one';
            case LISTBOX_SELECTION_ENUM.ZERO_OR_MORE:
                return 'zeroOrMany';
            case LISTBOX_SELECTION_ENUM.ONE_OR_MORE:
                return 'oneOrMany';
        }
    };
    listBoxValueConverter.convertJQXToNISelectionMode = function (selectionMode) {
        switch (selectionMode) {
            case 'zeroOrOne':
                return LISTBOX_SELECTION_ENUM.ZERO_OR_ONE;
            case 'one':
                return LISTBOX_SELECTION_ENUM.ONE;
            case 'oneOrMany':
                return LISTBOX_SELECTION_ENUM.ONE_OR_MORE;
            case 'zeroOrMany':
                return LISTBOX_SELECTION_ENUM.ZERO_OR_MORE;
        }
    };
    // Model -> Element
    listBoxValueConverter.convert = function (selectedIndex, selectionMode) {
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
    listBoxValueConverter.convertBack = function (selectedIndex, selectionMode) {
        var result;
        result = selectedIndex;
        if ((selectionMode === LISTBOX_SELECTION_ENUM.ZERO_OR_ONE || selectionMode === LISTBOX_SELECTION_ENUM.ONE) && Array.isArray(selectedIndex)) {
            result = result.length > 0 ? result[0] : -1;
        }
        else if (!Array.isArray(selectedIndex)) {
            result = result >= 0 ? [result] : [];
        }
        return result;
    };
}());
//# sourceMappingURL=niListBoxValueConverter.js.map