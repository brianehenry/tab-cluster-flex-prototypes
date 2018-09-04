"use strict";
//****************************************
// String Control View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.StringControlViewModel = function (element, model) {
        parent.call(this, element, model);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.StringControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var allowScrollbarToJqxVisibility = (allow) => (allow ? 'auto' : 'hidden');
    var jqxVisibilityToAllowScrollbar = (visibility) => (visibility !== 'hidden');
    var acceptsReturnToJqxEnterKeyBehavior = (acceptsReturn) => (acceptsReturn ? 'newLine' : 'submit');
    var jqxEnterKeyBehaviorToAcceptsReturn = (enterKeyBehavior) => (enterKeyBehavior === 'newLine');
    // Public Prototype Methods
    proto.getReadOnlyPropertyName = function () {
        return 'readonly';
    };
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.bindTextFocusEventListener();
        that.element.addEventListener('change', function (evt) {
            if (evt.detail == null || evt.target !== that.element) {
                return;
            }
            var newValue = evt.detail.value;
            that.model.controlChanged(newValue);
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
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
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.text = this.element.value;
        this.model.defaultValue = this.element.value;
        var style = window.getComputedStyle(this.element);
        this.model.textAlignment = style.getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        this.model.wordWrap = this.element.wrap !== 'off';
        this.model.typeToReplace = this.element.selectAllOnFocus;
        this.model.acceptsReturn = jqxEnterKeyBehaviorToAcceptsReturn(this.element.enterKeyBehavior);
        this.model.allowHorizontalScrollbar = jqxVisibilityToAllowScrollbar(this.element.horizontalScrollBarVisibility);
        this.model.allowVerticalScrollbar = jqxVisibilityToAllowScrollbar(this.element.verticalScrollBarVisibility);
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.value = this.model.text;
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        this.element.wrap = this.model.wordWrap ? 'soft' : 'off';
        this.element.selectAllOnFocus = this.model.typeToReplace;
        this.element.enterKeyBehavior = acceptsReturnToJqxEnterKeyBehavior(this.model.acceptsReturn);
        this.element.horizontalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowHorizontalScrollbar);
        this.element.verticalScrollBarVisibility = allowScrollbarToJqxVisibility(this.model.allowVerticalScrollbar);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.StringControlModel, 'jqx-multiline-text-box');
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niStringControlViewModel.js.map