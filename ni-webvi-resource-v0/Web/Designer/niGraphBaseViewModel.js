"use strict";
//****************************************
// GraphBase View Model
// National Instruments Copyright 2016
//****************************************
(function () {
    'use strict';
    class GraphBaseViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty('graphRef');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'plotAreaMargin':
                    renderBuffer.properties.plotAreaMargin = this.model.plotAreaMargin;
                    break;
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            if (this.element.niType) {
                this.model.niType = new window.NIType(this.element.niType);
            }
        }
        applyModelToElement() {
            super.applyModelToElement(this);
            this.element.niType = this.model.getNITypeString();
        }
        bindToView() {
            let that = this;
            let insideGraphBaseEventName = 'InsideGraphBase';
            that.element.addEventListener('mouseenter', function () {
                that.model.internalControlEventOccurred(insideGraphBaseEventName, true);
            });
            that.element.addEventListener('mouseleave', function () {
                that.model.internalControlEventOccurred(insideGraphBaseEventName, false);
            });
        }
    }
    NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel = GraphBaseViewModel;
})();
//# sourceMappingURL=niGraphBaseViewModel.js.map