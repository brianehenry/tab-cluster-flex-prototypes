"use strict";
//****************************************
// Data Grid View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    class DataGridViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('rowHeaderVisible');
            this.registerAutoSyncProperty('columnHeaderVisible');
            this.registerAutoSyncProperty('showAddRowsToolBar');
            this.registerAutoSyncProperty('allowSorting');
            this.registerAutoSyncProperty('allowPaging');
            this.registerAutoSyncProperty('allowFiltering');
            this.registerAutoSyncProperty('allowGrouping');
            this.registerAutoSyncProperty('rowHeight');
            this.registerAutoSyncProperty('altRowColors');
            this.registerAutoSyncProperty('altRowStart');
            this.registerAutoSyncProperty('altRowStep');
            this.registerAutoSyncProperty('isInEditMode');
            this.registerAutoSyncProperty('selectedColumn');
        }
        bindToView() {
            super.bindToView();
            let that = this;
            that.enableResizeHack();
            that.bindTextFocusEventListener();
            that.element.addEventListener('value-changed', function (event) {
                let newValue, oldValue;
                if (event.currentTarget === event.target) {
                    newValue = event.detail.newValue;
                    oldValue = event.detail.oldValue;
                    that.model.controlChanged(newValue, oldValue);
                }
            });
            that.element.addEventListener('selected-column-changed', function (event) {
                that.model.internalControlEventOccurred('DataGridSelectedIndexChanged', event.detail.selectedColumn);
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'value':
                    renderBuffer.properties.valueNonSignaling = this.model.value;
                    break;
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.niType = new window.NIType(this.element.niType);
            this.model.value = this.element.value;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.niType = this.model.getNITypeString();
            this.element.valueNonSignaling = this.model.value;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(DataGridViewModel, NationalInstruments.HtmlVI.Elements.DataGrid, NationalInstruments.HtmlVI.Models.DataGridModel);
    NationalInstruments.HtmlVI.ViewModels.DataGridViewModel = DataGridViewModel;
})();
//# sourceMappingURL=niDataGridViewModel.js.map