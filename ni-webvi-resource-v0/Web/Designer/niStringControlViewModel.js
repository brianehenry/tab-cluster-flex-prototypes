"use strict";
//****************************************
// String Control View Model
// National Instruments Copyright 2015
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Static Private Functions
    const allowScrollbarToJqxVisibility = (allow) => (allow ? 'auto' : 'hidden');
    const jqxVisibilityToAllowScrollbar = (visibility) => (visibility !== 'hidden');
    const acceptsReturnToJqxEnterKeyBehavior = (acceptsReturn) => (acceptsReturn ? 'newLine' : 'submit');
    const jqxEnterKeyBehaviorToAcceptsReturn = (enterKeyBehavior) => (enterKeyBehavior === 'newLine');
    class StringControlViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        // Public Prototype Methods
        getReadOnlyPropertyName() {
            return 'readonly';
        }
        bindToView() {
            super.bindToView();
            let that = this;
            that.bindTextFocusEventListener();
            that.element.addEventListener('change', function (evt) {
                if (evt.detail == null || evt.target !== that.element) {
                    return;
                }
                let newValue = evt.detail.value;
                that.model.controlChanged(newValue);
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'typeToReplace':
                    renderBuffer.properties.selectAllOnFocus = this.model.typeToReplace;
                    break;
                case 'wordWrap':
                    renderBuffer.properties.wrap = this.model.wordWrap ? 'soft' : 'off';
                    break;
                case 'text':
                    renderBuffer.properties.value = this.model.text;
                    break;
                case 'textAlignment':
                    renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                    break;
                case 'acceptsReturn':
                    renderBuffer.properties.enterKeyBehavior = acceptsReturnToJqxEnterKeyBehavior(this.model.acceptsReturn);
                    break;
                case 'allowHorizontalScrollbar':
                    renderBuffer.properties.horizontalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowHorizontalScrollbar);
                    break;
                case 'allowVerticalScrollbar':
                    renderBuffer.properties.verticalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowVerticalScrollbar);
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.text = this.element.value;
            this.model.defaultValue = this.element.value;
            let style = window.getComputedStyle(this.element);
            this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
            this.model.wordWrap = this.element.wrap !== 'off';
            this.model.typeToReplace = this.element.selectAllOnFocus;
            this.model.acceptsReturn = jqxEnterKeyBehaviorToAcceptsReturn(this.element.enterKeyBehavior);
            this.model.allowHorizontalScrollbar = jqxVisibilityToAllowScrollbar(this.element.horizontalScrollBarVisibility);
            this.model.allowVerticalScrollbar = jqxVisibilityToAllowScrollbar(this.element.verticalScrollBarVisibility);
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.value = this.model.text;
            this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
            this.element.wrap = this.model.wordWrap ? 'soft' : 'off';
            this.element.selectAllOnFocus = this.model.typeToReplace;
            this.element.enterKeyBehavior = acceptsReturnToJqxEnterKeyBehavior(this.model.acceptsReturn);
            this.element.horizontalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowHorizontalScrollbar);
            this.element.verticalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowVerticalScrollbar);
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(StringControlViewModel, null, NationalInstruments.HtmlVI.Models.StringControlModel, 'jqx-multiline-text-box');
    NationalInstruments.HtmlVI.ViewModels.StringControlViewModel = StringControlViewModel;
})();
//# sourceMappingURL=niStringControlViewModel.js.map