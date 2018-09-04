"use strict";
//****************************************
// DropDown View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TEXTALIGN_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    var CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.DropDownViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.DropDownViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'textAlignment', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectedIndexes', autoElementSync: false });
    });
    proto.convertToDropDownOpenMode = function (popupEnabled) {
        if (popupEnabled === false) {
            return 'none';
        }
        else {
            return 'default';
        }
    };
    proto.getReadOnlyPropertyName = function () {
        return 'readonly';
    };
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.enableResizeHack();
        that.element.addEventListener('selected-indexes-changed', function (evt) {
            if (that.model.readOnly === true) {
                return;
            }
            var newValue = evt.detail.value;
            var selectedIndex = newValue.length > 0 ? newValue[0] : that.model.selectedIndex;
            if (that.model.selectedIndex === selectedIndex) {
                return;
            }
            that.model.controlChanged(selectedIndex);
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'popupEnabled':
                renderBuffer.properties.dropDownOpenMode = this.convertToDropDownOpenMode(this.model.popupEnabled);
                break;
            case 'selectedIndex':
                renderBuffer.properties.selectedIndexes = this.model.selectedIndex === -1 ? [] : [this.model.selectedIndex];
                break;
            case 'source':
                renderBuffer.properties.dataSource = this.model.source;
                var selectedIndexes = this.model.selectedIndex === -1 ? [0] : [this.model.selectedIndex];
                renderBuffer.postRender = function () {
                    that.element.selectedIndexes = selectedIndexes;
                };
                break;
            case 'textAlignment':
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN] = this.model.textAlignment;
                renderBuffer.cssStyles[CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX] = TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment);
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.selectedIndex = this.element.selectedIndexes[0];
        this.model.defaultValue = this.element.selectedIndexes[0];
        this.model.popupEnabled = this.element.dropDownOpenMode !== 'none';
        this.model.textAlignment = window.getComputedStyle(this.element).getPropertyValue(CSS_PROPERTIES.TEXT_ALIGN);
        var source = this.element.dataSource;
        if (typeof source === 'string') {
            source = JSON.parse(source);
        }
        this.model.source = source;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.dataSource = this.model.source;
        this.element.selectedIndexes = this.model.selectedIndex === -1 ? [0] : [this.model.selectedIndex];
        this.element.dropDownOpenMode = this.convertToDropDownOpenMode(this.model.popupEnabled);
        this.element.dropDownHeight = 'auto';
        this.element.selectionMode = 'one';
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN, this.model.textAlignment);
        this.element.style.setProperty(CSS_PROPERTIES.TEXT_ALIGN_AS_FLEX, TEXTALIGN_VAL_CONVERTER.convertTextAlignmentToFlexAlignment(this.model.textAlignment));
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.DropDownModel, 'jqx-drop-down-list');
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niDropDownViewModel.js.map