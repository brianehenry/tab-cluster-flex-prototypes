"use strict";
//****************************************
// Cluster View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    class ClusterViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        // Public Prototype Methods
        bindToView() {
            super.bindToView();
            let that = this;
            that.element.addEventListener('value-changed', function (evt) {
                let newValue, oldValue;
                if (evt.target === that.element) {
                    newValue = evt.detail.newValue;
                    oldValue = evt.detail.oldValue;
                    that.model.controlChanged(newValue, oldValue);
                }
            });
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'value':
                    renderBuffer.properties.valueNonSignaling = this.model.value;
                    break;
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.niType = new window.NIType(this.element.niType);
            this.model.value = this.element.value;
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.niType = this.model.getNITypeString();
            this.element.valueNonSignaling = this.model.value;
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(ClusterViewModel, NationalInstruments.HtmlVI.Elements.Cluster, NationalInstruments.HtmlVI.Models.ClusterModel);
    NationalInstruments.HtmlVI.ViewModels.ClusterViewModel = ClusterViewModel;
})();
//# sourceMappingURL=niClusterViewModel.js.map