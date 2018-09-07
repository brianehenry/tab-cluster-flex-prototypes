"use strict";
//****************************************
// Cursor View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Other graph parts inherit from VisualComponentViewModel but cursor wants to support font so it inherits from VisualViewModel
    class CursorViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('label');
            this.registerAutoSyncProperty('targetShape');
            this.registerAutoSyncProperty('show');
            this.registerAutoSyncProperty('color');
            this.registerAutoSyncProperty('crosshairStyle');
            this.registerAutoSyncProperty('showLabel');
            this.registerAutoSyncProperty('showValue');
            this.registerAutoSyncProperty('snapToPlot');
            this.registerAutoSyncProperty('xaxis');
            this.registerAutoSyncProperty('yaxis');
            this.registerAutoSyncProperty('x');
            this.registerAutoSyncProperty('y');
        }
        bindToView() {
            super.bindToView();
            let that = this;
            NationalInstruments.Globals.jQuery(this.element).on('cursorUpdated', function () {
                let newValue = { x: that.element.x, y: that.element.y };
                that.model.controlChanged(newValue);
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'color':
                    this.element.setColor(this.model.color);
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let style = window.getComputedStyle(this.element);
            this.model.color = style.getPropertyValue('color');
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.style.color = this.model.color;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(CursorViewModel, NationalInstruments.HtmlVI.Elements.Cursor, NationalInstruments.HtmlVI.Models.CursorModel, 'ni-cursor');
    NationalInstruments.HtmlVI.ViewModels.CursorViewModel = CursorViewModel;
})();
//# sourceMappingURL=niCursorViewModel.js.map