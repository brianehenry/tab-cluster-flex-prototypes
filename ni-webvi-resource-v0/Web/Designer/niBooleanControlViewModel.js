"use strict";
//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class BooleanControlViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        convertModelClickModeToJQXClickMode() {
            if (this.model.momentary === false && this.model.clickMode !== 'press') {
                return 'release';
            }
            else if (this.model.momentary === false && this.model.clickMode === 'press') {
                return 'press';
            }
            else if (this.model.momentary === true && this.model.clickMode !== 'press') {
                return 'pressAndRelease';
            }
            // instead of throwing an exception for invalid combinations we ignore them
            // this is because properties come from the editor one at a time and so can produce
            // temporary invalid combos
            return '';
        }
        setModelClickModeFromJQXClickMode() {
            if (this.element.clickMode === 'release') {
                this.model.momentary = false;
                this.model.clickMode = 'release';
            }
            else if (this.element.clickMode === 'press') {
                this.model.momentary = false;
                this.model.clickMode = 'press';
            }
            else if (this.element.clickMode === 'pressAndRelease') {
                this.model.momentary = true;
                this.model.clickMode = 'release';
            }
        }
        getReadOnlyPropertyName() {
            return 'readonly';
        }
        modelPropertyChanged(propertyName) {
            let clickMode;
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'momentary':
                case 'clickMode':
                    clickMode = this.convertModelClickModeToJQXClickMode();
                    if (clickMode !== '') {
                        renderBuffer.properties.clickMode = clickMode;
                    }
                    break;
                case 'content':
                    // do not set content here
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.setModelClickModeFromJQXClickMode();
            // do not set content
        }
        applyModelToElement() {
            super.applyModelToElement();
            // do not update content here - some derived elements will stomp parts if content is set
            this.element.clickMode = this.convertModelClickModeToJQXClickMode();
            // do not set content
        }
    }
    NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel = BooleanControlViewModel;
})();
//# sourceMappingURL=niBooleanControlViewModel.js.map