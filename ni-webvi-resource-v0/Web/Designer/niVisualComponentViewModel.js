"use strict";
//****************************************
// Visual Component View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    class VisualComponentViewModel extends NationalInstruments.HtmlVI.ViewModels.NIViewModel {
        // Constructor Function
        constructor(element, model) {
            super(element, model);
            if (this.model instanceof NationalInstruments.HtmlVI.Models.VisualComponentModel === false) {
                throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
            }
            if (!NI_SUPPORT.isElement(this.element)) {
                throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
            }
            // Public Instance Properties
            // None
            // Private Instance Properties
            this._needsResizeHack = false;
        }
        // Public Prototype Methods
        enableResizeHack() {
            this._needsResizeHack = true;
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            if (this.model.niControlId !== this.element.niControlId) {
                throw new Error('The element and model association is incorrect; element and model ids do not match');
            }
        }
        applyModelToElement() {
            super.applyModelToElement();
            if (this.model.niControlId !== this.element.niControlId) {
                throw new Error('The element and model association is incorrect; element and model ids do not match');
            }
        }
        onChildViewModelAdded(childViewModel) {
        }
        onChildViewModelRemoved(childViewModel) {
        }
    }
    NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel = VisualComponentViewModel;
})();
//# sourceMappingURL=niVisualComponentViewModel.js.map