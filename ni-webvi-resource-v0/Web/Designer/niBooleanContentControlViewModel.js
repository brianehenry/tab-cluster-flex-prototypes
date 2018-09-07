"use strict";
//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    const RENDER_BUFFER = NationalInstruments.HtmlVI.RenderBuffer;
    class BooleanContentControlViewModel extends NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('trueContent');
            this.registerAutoSyncProperty('falseContent');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'contentVisible':
                    renderBuffer.cssStyles[CSS_PROPERTIES.CONTENT_DISPLAY] = this.model.contentVisible ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                    break;
                case 'value':
                    renderBuffer.properties.checked = this.model.value;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let style = window.getComputedStyle(this.element);
            this.model.contentVisible = style.getPropertyValue(CSS_PROPERTIES.CONTENT_DISPLAY) !== 'none';
            this.model.value = this.element.checked;
        }
        applyModelToElement() {
            super.applyModelToElement();
            if (!this.model.contentVisible) {
                this.element.style.setProperty(CSS_PROPERTIES.CONTENT_DISPLAY, 'none');
            }
            this.element.checked = this.model.value;
        }
    }
    NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel = BooleanContentControlViewModel;
})();
//# sourceMappingURL=niBooleanContentControlViewModel.js.map