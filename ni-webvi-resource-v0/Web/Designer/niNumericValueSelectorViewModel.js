"use strict";
//****************************************
// NumericValueSelector View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const NUM_VALUE_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    class NumericValueSelectorViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('popupEnabled');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
                case 'value':
                    if (this.model.value !== null) {
                        renderBuffer.properties.valueNonSignaling = NUM_VALUE_CONVERTER.convert(this.model.value, this.model.niType);
                    }
                    break;
                case 'items':
                    renderBuffer.properties.items = JSON.stringify(this.model.items);
                    break;
                case 'popupEnabled':
                    renderBuffer.properties.popupEnabled = this.model.popupEnabled;
                    break;
                case 'disabledIndexes':
                    renderBuffer.properties.disabledIndexes = JSON.stringify(this.model.disabledIndexes);
                    break;
                default:
                    break;
            }
            return renderBuffer;
        }
        bindToView() {
            super.bindToView();
            let that = this;
            this.enableResizeHack();
            this.element.addEventListener('value-changed', function (evt) {
                if (evt.target === that.element) {
                    let newValue = NUM_VALUE_CONVERTER.convertBack(evt.detail.value, that.model.niType);
                    that.model.controlChanged(newValue);
                }
            });
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let element = this.element, model = this.model, nitype = new window.NIType(element.niType);
            model.niType = nitype;
            model.value = NUM_VALUE_CONVERTER.convertBack(element.value, nitype);
            model.items = JSON.parse(element.items);
            model.disabledIndexes = JSON.parse(element.disabledIndexes);
            model.popupEnabled = element.popupEnabled;
        }
        applyModelToElement() {
            super.applyModelToElement();
            let element = this.element, model = this.model;
            element.niType = this.model.getNITypeString();
            element.items = JSON.stringify(model.items);
            element.disabledIndexes = JSON.stringify(model.disabledIndexes);
            element.value = NUM_VALUE_CONVERTER.convert(model.value, model.niType);
            element.popupEnabled = model.popupEnabled;
        }
    }
    NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel = NumericValueSelectorViewModel;
})();
//# sourceMappingURL=niNumericValueSelectorViewModel.js.map