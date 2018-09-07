"use strict";
//****************************************
// Front Panel View Model
// National Instruments Copyright 2018
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const USER_INTERACTION_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.UserInteractionState;
    const INTERACTIVE_OPERATION_KIND_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.InteractiveOperationKind;
    // Static Private Functions
    const setFlexiblePanelOnElement = function (element, flexiblePanel) {
        if (flexiblePanel) {
            element.classList.add('ni-relative-layout');
        }
        else {
            element.classList.remove('ni-relative-layout');
        }
    };
    class FrontPanelViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName);
            switch (propertyName) {
                case 'flexiblePanel':
                    setFlexiblePanelOnElement(this.element, this.model.flexiblePanel);
                    break;
            }
            return renderBuffer;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.flexiblePanel = this.element.classList.contains('ni-relative-layout');
        }
        applyModelToElement() {
            super.applyModelToElement();
            setFlexiblePanelOnElement(this.element, this.model.flexiblePanel);
        }
        userInteractionChanged(newState, operationKind) {
            let isMoveOrCreate = operationKind === INTERACTIVE_OPERATION_KIND_ENUM.MOVE ||
                operationKind === INTERACTIVE_OPERATION_KIND_ENUM.CREATE;
            if (newState === USER_INTERACTION_STATE_ENUM.START) {
                if (isMoveOrCreate) {
                    this.element.classList.add('ni-descendant-drag-active');
                }
            }
            else if (newState === USER_INTERACTION_STATE_ENUM.END) {
                if (isMoveOrCreate) {
                    this.element.classList.remove('ni-descendant-drag-active');
                }
            }
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(FrontPanelViewModel, null, NationalInstruments.HtmlVI.Models.FrontPanelModel, 'ni-front-panel');
    NationalInstruments.HtmlVI.ViewModels.FrontPanelViewModel = FrontPanelViewModel;
})();
//# sourceMappingURL=niFrontPanelViewModel.js.map