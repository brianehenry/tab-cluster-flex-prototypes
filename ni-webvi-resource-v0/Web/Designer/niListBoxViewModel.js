"use strict";
//****************************************
// ListBox View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var LISTBOX_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ListBoxViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ListBoxViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectionMode', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectedIndexes', autoElementSync: false });
    });
    proto.getReadOnlyPropertyName = function () {
        return 'readonly';
    };
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.enableResizeHack();
        that.element.addEventListener('change', function () {
            if (that.model.readOnly === true) {
                return;
            }
            var newValue = LISTBOX_VAL_CONVERTER.convertBack(that.element.selectedIndexes, that.model.selectionMode);
            that.model.controlChanged(newValue);
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var selectedIndexes;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
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
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.selectionMode = LISTBOX_VAL_CONVERTER.convertJQXToNISelectionMode(this.element.selectionMode);
        var selectedIndexes = LISTBOX_VAL_CONVERTER.convertBack(this.element.selectedIndexes, this.model.selectionMode);
        var niType = this.element.getAttribute('ni-type');
        this.model.niType = new window.NIType(niType);
        this.model.selectedIndexes = selectedIndexes;
        this.model.defaultValue = selectedIndexes;
        var source = this.element.dataSource;
        if (typeof source === 'string') {
            source = JSON.parse(source);
        }
        this.model.source = source;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.niType = this.model.getNITypeString();
        this.element.selectionMode = LISTBOX_VAL_CONVERTER.convertNIToJQXSelectionMode(this.model.selectionMode);
        this.element.selectedIndexes = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndexes, this.model.selectionMode);
        this.element.dataSource = this.model.source;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.ListBoxModel, 'jqx-list-box');
}(NationalInstruments.HtmlVI.ViewModels.SelectorViewModel));
//# sourceMappingURL=niListBoxViewModel.js.map