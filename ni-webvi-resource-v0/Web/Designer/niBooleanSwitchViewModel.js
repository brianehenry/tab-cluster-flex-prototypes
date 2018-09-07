"use strict";
//****************************************
// Boolean Switch View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    const RENDER_BUFFER = NationalInstruments.HtmlVI.RenderBuffer;
    class BooleanSwitchViewModel extends NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('orientation');
        }
        bindToView() {
            super.bindToView();
            let that = this;
            that.element.addEventListener('change', function (e) {
                if (that.model.readOnly === true || e.detail.changeType === 'api') {
                    return;
                }
                let newValue = e.detail.value;
                if (that.model.value !== newValue) {
                    that.model.controlChanged(newValue);
                }
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'falseContentVisibility':
                    renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_CONTENT_DISPLAY] = this.model.falseContentVisibility ? RENDER_BUFFER.REMOVE_CUSTOM_PROPERTY_TOKEN : 'none';
                    break;
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let style = window.getComputedStyle(this.element);
            this.model.falseContentVisibility = style.getPropertyValue(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY) !== 'none';
            this.model.textAlignment = TEXTALIGN_VAL_CONVERTER.convertFlexAlignmentToTextAlignment(style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX));
        }
        applyModelToElement() {
            super.applyModelToElement();
            if (!this.model.falseContentVisibility) {
                this.element.style.setProperty(CSS_PROPERTIES.FALSE_CONTENT_DISPLAY, 'none');
            }
            this.element.switchMode = 'click';
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment));
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(BooleanSwitchViewModel, null, NationalInstruments.HtmlVI.Models.BooleanSwitchModel, 'jqx-switch-button');
    NationalInstruments.HtmlVI.ViewModels.BooleanSwitchViewModel = BooleanSwitchViewModel;
})();
//# sourceMappingURL=niBooleanSwitchViewModel.js.map