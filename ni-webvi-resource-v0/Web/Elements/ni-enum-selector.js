"use strict";
//****************************************
// EnumSelector Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    class EnumSelector extends NationalInstruments.HtmlVI.Elements.NumericValueSelector {
        attachedCallback() {
            var firstCall = super.attachedCallback(), that = this;
            if (firstCall === true) {
                var dropDownChildElement = document.createElement('jqx-drop-down-list');
                this.innerHTML = '';
                var data = this.getSourceAndSelectedIndexFromSource();
                var selectedIndex = data.selectedIndex === -1 ? [0] : [data.selectedIndex];
                dropDownChildElement.setAttribute('data-source', JSON.stringify(data.source));
                dropDownChildElement.setAttribute('selected-indexes', JSON.stringify(selectedIndex));
                dropDownChildElement.setAttribute('drop-down-height', 'auto');
                dropDownChildElement.setAttribute('selection-mode', 'one');
                dropDownChildElement.disabled = this.disabled;
                if (this.readOnly === true) {
                    dropDownChildElement.setAttribute('readonly', 'true');
                }
                dropDownChildElement.setAttribute('drop-down-open-mode', this.popupEnabled ? 'default' : 'none');
                dropDownChildElement.addEventListener('change', function (event) {
                    var args = event.detail;
                    if (args && !that._itemsUpdating) {
                        var displayValue = args.value;
                        that.selectChangedHandler(displayValue);
                    }
                    event.stopPropagation();
                });
                // Attach after all attributes are set to prevent early value change events
                this.appendChild(dropDownChildElement);
                this.setDisabledIndexes(dropDownChildElement);
            }
            return firstCall;
        }
        forceResize(size) {
            super.forceResize(size);
            $(this.firstElementChild).width(size.width);
            $(this.firstElementChild).height(size.height);
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'items':
                case 'value':
                case 'readOnly':
                    this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                    if (this.itemsArray.length > 0 && this.value === -1) {
                        this.firstElementChild.selectedIndexes = [0];
                    }
                    break;
                case 'disabled':
                    this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                    break;
                case 'disabledIndexes':
                    this.propertyUpdatedHelper(propertyName, this.firstElementChild, false);
                    break;
                default:
                    break;
            }
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(EnumSelector.prototype, 'ni-enum-selector', 'HTMLNIEnumSelector');
    NationalInstruments.HtmlVI.Elements.EnumSelector = EnumSelector;
}());
//# sourceMappingURL=ni-enum-selector.js.map