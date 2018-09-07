"use strict";
//****************************************
// NI View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    const RENDER_ENGINE = NationalInstruments.HtmlVI.RenderEngine;
    class NIViewModel {
        // Constructor Function
        constructor(element, model) {
            if (!NI_SUPPORT.isElement(element)) {
                throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
            }
            if (model instanceof NationalInstruments.HtmlVI.Models.NIModel === false) {
                throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
            }
            this._autoSyncPropertyMap = new Map();
            // Public Instance Properties
            NI_SUPPORT.defineConstReference(this, 'element', element);
            NI_SUPPORT.defineConstReference(this, 'model', model);
        }
        bindToView() {
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = RENDER_ENGINE.getOrAddRenderBuffer(this.element);
            if (this._autoSyncPropertyMap.has(propertyName) && this._autoSyncPropertyMap.get(propertyName) === true) {
                renderBuffer.properties[propertyName] = this.model[propertyName];
            }
            return renderBuffer;
        }
        registerAutoSyncProperty(propertyName) {
            if (typeof propertyName !== 'string' || propertyName.length < 1) {
                throw new Error('A property name must be a string greater than or equal to one character long');
            }
            this._autoSyncPropertyMap.set(propertyName, true);
        }
        // Applies changes to the DOM Element
        applyElementChanges() {
            RENDER_ENGINE.enqueueDomUpdate(this.element);
        }
        updateModelFromElement() {
            this._autoSyncPropertyMap.forEach((autoSync, currProp, map) => {
                this.model[currProp] = this.element[currProp];
            });
        }
        applyModelToElement() {
            this._autoSyncPropertyMap.forEach((autoSync, currProp, map) => {
                this.element[currProp] = this.model[currProp];
            });
        }
        enableEvents() {
            return this.model.enableEvents();
        }
        getOwnerViewModel() {
            let viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef('');
            let viModel = viViewModel.model;
            return viModel.getControlViewModel(this.model.getOwner().niControlId);
        }
    }
    NationalInstruments.HtmlVI.ViewModels.NIViewModel = NIViewModel;
})();
//# sourceMappingURL=niViewModel.js.map