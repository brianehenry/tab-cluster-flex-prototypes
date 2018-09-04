"use strict";
//****************************************
// Radio Button Group Prototype
// DOM Registration: HTMLNIRadioButtonGroup
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var ORIENTATION_ENUM = {
        HORIZONTAL: 'horizontal',
        VERTICAL: 'vertical'
    };
    // Static Private Variables
    // None
    // Static Private Functions
    var attachSingleRadioButton = function (target, displayValue, checked) {
        var radioButtonElement = document.createElement('jqx-radio-button');
        radioButtonElement.setAttribute('enable-container-click', '');
        if (target.readOnly) {
            radioButtonElement.setAttribute('readonly', '');
        }
        if (target.disabled) {
            radioButtonElement.setAttribute('disabled', '');
        }
        radioButtonElement.innerHTML = NI_SUPPORT.escapeHtml(displayValue);
        if (checked) {
            radioButtonElement.setAttribute('checked', '');
        }
        target.appendChild(radioButtonElement);
        return radioButtonElement;
    };
    var attachChildrenRadioButton = function (target) {
        // Remove all child controls
        target.innerHTML = '';
        target._childRadioButtons = [];
        var data = target.getSourceAndSelectedIndexFromSource();
        var i, curRadioButton, checked;
        for (i = 0; i < data.source.length; i++) {
            checked = data.selectedIndex === i;
            curRadioButton = attachSingleRadioButton(target, data.source[i], checked);
            target._childRadioButtons.push(curRadioButton);
        }
    };
    class RadioButtonGroup extends NationalInstruments.HtmlVI.Elements.NumericValueSelector {
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = RadioButtonGroup.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'orientation',
                defaultValue: ORIENTATION_ENUM.VERTICAL
            });
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            var that = this;
            if (firstCall === true) {
                attachChildrenRadioButton(that);
                that.addEventListener('change', function (evt) {
                    var selectedIndex = that._childRadioButtons.indexOf(evt.target);
                    that.selectChangedHandler(that.itemsArray[selectedIndex].displayValue);
                    evt.stopPropagation();
                });
            }
            return firstCall;
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            var that = this, data;
            switch (propertyName) {
                case 'items':
                    this.refreshItemsArray();
                    attachChildrenRadioButton(this);
                    break;
                case 'value':
                    data = this.getSourceAndSelectedIndexFromSource();
                    this._childRadioButtons[data.selectedIndex].checked = true;
                    break;
                case 'readOnly':
                    this._childRadioButtons.forEach(function (radioButton) {
                        radioButton.readonly = that.readOnly;
                    });
                    break;
                case 'disabled':
                    this._childRadioButtons.forEach(function (radioButton) {
                        radioButton.disabled = that.disabled;
                    });
                    break;
            }
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(RadioButtonGroup.prototype, 'ni-radio-button-group', 'HTMLNIRadioButtonGroup');
    NationalInstruments.HtmlVI.Elements.RadioButtonGroup = RadioButtonGroup;
    NationalInstruments.HtmlVI.Elements.RadioButtonGroup.OrientationEnum = ORIENTATION_ENUM;
}());
//# sourceMappingURL=ni-radio-button-group.js.map