"use strict";
//****************************************
// Front Panel View Model
// National Instruments Copyright 2018
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.FrontPanelViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.FrontPanelViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var USER_INTERACTION_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.UserInteractionState;
    var INTERACTIVE_OPERATION_KIND_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.InteractiveOperationKind;
    // Static Private Functions
    var setFlexiblePanelOnElement = function (element, flexiblePanel) {
        if (flexiblePanel) {
            element.classList.add('ni-relative-layout');
        }
        else {
            element.classList.remove('ni-relative-layout');
        }
    };
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'flexiblePanel', autoElementSync: false });
    });
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'flexiblePanel':
                setFlexiblePanelOnElement(this.element, this.model.flexiblePanel);
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.flexiblePanel = this.element.classList.contains('ni-relative-layout');
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        setFlexiblePanelOnElement(this.element, this.model.flexiblePanel);
    };
    proto.userInteractionChanged = function (newState, operationKind) {
        var isMoveOrCreate = operationKind === INTERACTIVE_OPERATION_KIND_ENUM.MOVE ||
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
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.FrontPanelModel, 'ni-front-panel');
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niFrontPanelViewModel.js.map