"use strict";
//****************************************
// ListBox View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const LISTBOX_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;
    class ListBoxViewModel extends NationalInstruments.HtmlVI.ViewModels.SelectorViewModel {
        getReadOnlyPropertyName() {
            return 'readonly';
        }
        bindToView() {
            super.bindToView();
            let that = this;
            that.enableResizeHack();
            that.element.addEventListener('change', function () {
                if (that.model.readOnly === true) {
                    return;
                }
                let newValue = LISTBOX_VAL_CONVERTER.convertBack(that.element.selectedIndexes, that.model.selectionMode);
                that.model.controlChanged(newValue);
            });
        }
        modelPropertyChanged(propertyName) {
            let that = this;
            let selectedIndexes;
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'selectedIndexes':
                case 'selectionMode':
                    renderBuffer.properties.selectionMode = LISTBOX_VAL_CONVERTER.convertNIToJQXSelectionMode(this.model.selectionMode);
                    selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
                    renderBuffer.properties.selectedIndexes = selectedIndexes;
                    break;
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
                case 'source':
                    renderBuffer.properties.dataSource = this.model.source;
                    selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
                    renderBuffer.postRender = function () {
                        that.element.selectedIndexes = selectedIndexes;
                    };
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.selectionMode = LISTBOX_VAL_CONVERTER.convertJQXToNISelectionMode(this.element.selectionMode);
            let selectedIndexes = LISTBOX_VAL_CONVERTER.convertBack(this.element.selectedIndexes, this.model.selectionMode);
            let niType = this.element.getAttribute('ni-type');
            this.model.niType = new window.NIType(niType);
            this.model.selectedIndexes = selectedIndexes;
            this.model.defaultValue = selectedIndexes;
            let source = this.element.dataSource;
            if (typeof source === 'string') {
                source = JSON.parse(source);
            }
            this.model.source = source;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.niType = this.model.getNITypeString();
            this.element.selectionMode = LISTBOX_VAL_CONVERTER.convertNIToJQXSelectionMode(this.model.selectionMode);
            this.element.selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
            this.element.dataSource = this.model.source;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(ListBoxViewModel, null, NationalInstruments.HtmlVI.Models.ListBoxModel, 'jqx-list-box');
    NationalInstruments.HtmlVI.ViewModels.ListBoxViewModel = ListBoxViewModel;
})();
//# sourceMappingURL=niListBoxViewModel.js.map