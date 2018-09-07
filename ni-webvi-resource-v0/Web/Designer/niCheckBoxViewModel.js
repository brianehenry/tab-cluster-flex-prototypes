"use strict";
//****************************************
// CheckBox View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    class CheckBoxViewModel extends NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel {
        bindToView() {
            super.bindToView();
            let that = this;
            that.element.addEventListener('change', function () {
                if (that.model.readOnly === true) {
                    return;
                }
                let newValue = that.element.checked;
                if (that.model.value !== newValue) {
                    that.model.controlChanged(newValue);
                }
            });
        }
        modelPropertyChanged(propertyName) {
            let model = this.model;
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'content':
                    renderBuffer.properties.content = model.content;
                    break;
                case 'value':
                    renderBuffer.properties.checked = model.value;
                    break;
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = model.textAlignment;
                    break;
                case 'trueBackground':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TRUE_BACKGROUND] = model.trueBackground;
                    break;
                case 'falseBackground':
                    renderBuffer.cssStyles[CSS_PROPERTIES.FALSE_BACKGROUND] = model.falseBackground;
                    break;
                case 'textColor':
                    renderBuffer.cssStyles[CSS_PROPERTIES.FOREGROUND_COLOR] = model.textColor;
                    break;
                case 'checkMarkColor':
                    renderBuffer.cssStyles[CSS_PROPERTIES.CHECK_MARK_COLOR] = model.checkMarkColor;
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let contentSpan = this.element.querySelector('.ni-text');
            if (contentSpan !== null) {
                this.model.contentVisible = contentSpan.classList.contains('ni-hidden') !== true;
            }
            this.model.readOnly = this.element.readonly;
            this.model.value = this.element.checked;
            let style = window.getComputedStyle(this.element);
            this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
            this.model.trueBackground = style.getPropertyValue(CSS_PROPERTIES.TRUE_BACKGROUND);
            this.model.falseBackground = style.getPropertyValue(CSS_PROPERTIES.FALSE_BACKGROUND);
            this.model.textColor = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
            this.model.checkMarkColor = style.getPropertyValue(CSS_PROPERTIES.CHECK_MARK_COLOR);
        }
        applyModelToElement() {
            let element = this.element;
            let model = this.model;
            super.applyModelToElement();
            element.content = model.content;
            element.checked = model.value;
            element.enableContainerClick = true;
            element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, model.textAlignment);
            element.style.setProperty(CSS_PROPERTIES.TRUE_BACKGROUND, model.trueBackground);
            element.style.setProperty(CSS_PROPERTIES.FALSE_BACKGROUND, model.falseBackground);
            element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.textColor);
            element.style.setProperty(CSS_PROPERTIES.CHECK_MARK_COLOR, model.checkMarkColor);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(CheckBoxViewModel, null, NationalInstruments.HtmlVI.Models.CheckBoxModel, 'jqx-check-box');
    NationalInstruments.HtmlVI.ViewModels.CheckBoxViewModel = CheckBoxViewModel;
})();
//# sourceMappingURL=niCheckBoxViewModel.js.map