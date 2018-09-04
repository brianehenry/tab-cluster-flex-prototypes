"use strict";
//****************************************
// Cluster View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ClusterViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ClusterViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        that.element.addEventListener('value-changed', function (evt) {
            var newValue, oldValue;
            if (evt.target === that.element) {
                newValue = evt.detail.newValue;
                oldValue = evt.detail.oldValue;
                that.model.controlChanged(newValue, oldValue);
            }
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'value':
                renderBuffer.properties.valueNonSignaling = this.model.value;
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.getNITypeString();
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.niType = new NIType(this.element.niType);
        this.model.value = this.element.value;
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.niType = this.model.getNITypeString();
        this.element.valueNonSignaling = this.model.value;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Cluster, NationalInstruments.HtmlVI.Models.ClusterModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niClusterViewModel.js.map