"use strict";
//****************************************
// RingSelector Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    // var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var JQX_NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NIType = window.NIType;
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    class RingSelector extends NationalInstruments.HtmlVI.Elements.NumericValueSelector {
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = RingSelector.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'allowUndefined',
                defaultValue: false
            });
        }
        attachedCallback() {
            var firstCall = super.attachedCallback(), that = this;
            if (firstCall === true) {
                var dropDownContainer = document.createElement('jqx-drop-down-list');
                this.appendChild(dropDownContainer);
                var numericInput = document.createElement('jqx-numeric-text-box');
                this.appendChild(numericInput);
                var niValueType = new NIType(this.niType);
                var inputFormat = JQX_NUM_VAL_CONVERTER.convertNITypeToJQX(niValueType);
                numericInput.setAttribute('input-format', inputFormat);
                if (inputFormat === 'integer') {
                    numericInput.setAttribute('word-length', niValueType.getName().toLowerCase());
                }
                if (this.readOnly === true) {
                    numericInput.setAttribute('readonly', '');
                }
                numericInput.setAttribute('value', JQX_NUM_VAL_CONVERTER.convert(NUM_VAL_CONVERTER.convertBack(this.value, niValueType), niValueType));
                var data = this.getSourceAndSelectedIndexFromSource();
                var selectedIndex = data.selectedIndex;
                if (selectedIndex === -1) {
                    selectedIndex = this.addUndefinedValue(dropDownContainer);
                }
                var source = this.createSource();
                dropDownContainer.setAttribute('selection-mode', 'one');
                dropDownContainer.setAttribute('data-source', JSON.stringify(source));
                dropDownContainer.setAttribute('selected-indexes', JSON.stringify([selectedIndex]));
                dropDownContainer.setAttribute('drop-down-height', 'auto');
                dropDownContainer.disabled = this.disabled;
                if (this.readOnly === true) {
                    dropDownContainer.setAttribute('readonly', '');
                }
                dropDownContainer.setAttribute('drop-down-open-mode', this.popupEnabled ? 'default' : 'none');
                dropDownContainer.addEventListener('change', function (event) {
                    var args = event.detail;
                    if (args && !that._itemsUpdating) {
                        var displayValue = args.label;
                        var itemValue = that.selectChangedHandler(displayValue);
                        numericInput.value = itemValue;
                    }
                    event.stopPropagation();
                });
                numericInput.addEventListener('change', function (event) {
                    var niType = new NIType(that.niType);
                    var value = JQX_NUM_VAL_CONVERTER.convertBack(numericInput.value, niType);
                    that.value = NUM_VAL_CONVERTER.convert(value, niType, true);
                    event.stopPropagation();
                });
                // Add CSS class names
                numericInput.classList.add('ni-ring-numeric-input');
                customElements.whenDefined(numericInput.localName).then(function () {
                    that.numericInputDefined = true;
                });
                this.setDisabledIndexes(dropDownContainer);
            }
            return firstCall;
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            var numericInput = this.querySelector('jqx-numeric-text-box');
            var dropdown = this.querySelector('jqx-drop-down-list');
            var niType;
            switch (propertyName) {
                case 'items':
                    if (this._hasUndefinedValue) {
                        this._hasUndefinedValue = false;
                        this.itemsArray.pop();
                    }
                    this.propertyUpdatedHelper(propertyName, dropdown, false);
                    break;
                case 'readOnly':
                    this.propertyUpdatedHelper(propertyName, dropdown, false);
                    break;
                case 'value':
                    niType = new NIType(this.niType);
                    // Note: We're using allowCreateNewSelectedItem = true (instead of this.allowUndefined) here intentionally.
                    // When a new value is set programmatically that doesn't map to any existing item,
                    // the control will accept that value and show it as "<newValue>", even if
                    // allowUndefined is false. This matches the behavior of the WPF control.
                    this.propertyUpdatedHelper(propertyName, dropdown, true);
                    if (this.numericInputDefined) {
                        numericInput.properties.value.notify = false;
                    }
                    numericInput.value =
                        JQX_NUM_VAL_CONVERTER.convert(NUM_VAL_CONVERTER.convertBack(this.value, niType), niType);
                    if (this.numericInputDefined) {
                        numericInput.properties.value.notify = true;
                    }
                    break;
                case 'allowUndefined':
                    if (!this.allowUndefined) {
                        this.removeUndefinedValue(dropdown);
                    }
                    break;
                case 'niType':
                    niType = new NIType(this.niType);
                    var inputFormat = JQX_NUM_VAL_CONVERTER.convertNITypeToJQX(niType);
                    numericInput.inputFormat = inputFormat;
                    if (inputFormat === 'integer') {
                        numericInput.wordLength = niType.getName().toLowerCase();
                    }
                    break;
                case 'disabled':
                    this.propertyUpdatedHelper(propertyName, dropdown, false);
                    numericInput.disabled = this.disabled;
                    break;
                case 'disabledIndexes':
                    this.propertyUpdatedHelper(propertyName, dropdown, false);
                    break;
                default:
                    break;
            }
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(RingSelector.prototype, 'ni-ring-selector', 'HTMLNIRingSelector');
    NationalInstruments.HtmlVI.Elements.RingSelector = RingSelector;
}());
//# sourceMappingURL=ni-ring-selector.js.map