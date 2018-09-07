"use strict";
//****************************************
// Array Viewer View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Functions
    const getArrayViewerAndClones = function (rootArrayViewModel, arrayViewer, arrayViewerModel) {
        let arrayViewers = [arrayViewer];
        if (arrayViewerModel !== rootArrayViewModel.model) {
            // If the given arrayViewer is not the root array (i.e. array-of-arrays), get the matching clone arrayViewers from
            // all of the other cells too
            Array.prototype.push.apply(arrayViewers, rootArrayViewModel._viewModelData[arrayViewer.niControlId].getClones());
        }
        return arrayViewers;
    };
    const arrayElementSizeChanged = function (arrayElementViewModel, rootArrayViewModel) {
        let i, renderBuffer, arrayViewers, arrayElementModel, arrayModel, arrayElement;
        arrayElementModel = arrayElementViewModel.model;
        arrayModel = arrayElementModel.getOwner();
        arrayElement = arrayElementViewModel.element.parentElement;
        arrayViewers = getArrayViewerAndClones(rootArrayViewModel, arrayElement, arrayModel);
        for (i = 0; i < arrayViewers.length; i++) {
            renderBuffer = NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer(arrayViewers[i]);
            renderBuffer.properties.elementSize = { width: parseInt(arrayElementModel.width), height: parseInt(arrayElementModel.height) };
            NationalInstruments.HtmlVI.RenderEngine.enqueueDomUpdate(arrayViewers[i]);
        }
    };
    const copyRenderBuffer = function (srcElement, srcRenderBuffer, destRenderBuffer, isArrayElement) {
        let i, newStyle, newAttr, newProp;
        for (i = 0; i < srcRenderBuffer.cssClasses.toAdd.length; i++) {
            destRenderBuffer.cssClasses.toAdd[i] = srcRenderBuffer.cssClasses.toAdd[i];
        }
        for (i = 0; i < srcRenderBuffer.cssClasses.toRemove.length; i++) {
            destRenderBuffer.cssClasses.toRemove[i] = srcRenderBuffer.cssClasses.toRemove[i];
        }
        for (newStyle in srcRenderBuffer.cssStyles) {
            if (srcRenderBuffer.cssStyles.hasOwnProperty(newStyle)) {
                if (!(isArrayElement && (newStyle === 'left' || newStyle === 'top'))) {
                    destRenderBuffer.cssStyles[newStyle] = srcRenderBuffer.cssStyles[newStyle];
                }
            }
        }
        for (newAttr in srcRenderBuffer.attributes) {
            if (srcRenderBuffer.attributes.hasOwnProperty(newAttr)) {
                destRenderBuffer.attributes[newAttr] = srcRenderBuffer.attributes[newAttr];
            }
        }
        // TODO: This code won't handle property values that can be objects (like a numeric with {numberValue:1} - the
        // clones will end up sharing that same object. For now this is fine, because we handle template value changes
        // another way (see the 'setDefaultValue' code below).
        for (newProp in srcRenderBuffer.properties) {
            if (srcRenderBuffer.properties.hasOwnProperty(newProp)) {
                if (srcElement.valuePropertyDescriptor !== undefined &&
                    (newProp === srcElement.valuePropertyDescriptor.propertyName ||
                        newProp === srcElement.valuePropertyDescriptor.propertyNameNonSignaling) &&
                    srcElement.parentElement instanceof NationalInstruments.HtmlVI.Elements.ArrayViewer) {
                    continue;
                }
                destRenderBuffer.properties[newProp] = srcRenderBuffer.properties[newProp];
            }
        }
    };
    const updateElementsFromRenderBuffer = function (elements, renderBuffer, srcElement, isArrayElement) {
        let curBuffer, i;
        for (i = 0; i < elements.length; i++) {
            curBuffer = NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer(elements[i]);
            copyRenderBuffer(srcElement, renderBuffer, curBuffer, isArrayElement);
            NationalInstruments.HtmlVI.RenderEngine.enqueueDomUpdate(elements[i]);
        }
    };
    const elementFontChanged = function (elements, childViewModel) {
        let i;
        let fontSize = childViewModel.model.fontSize;
        let fontFamily = childViewModel.model.fontFamily;
        let fontWeight = childViewModel.model.fontWeight;
        let fontStyle = childViewModel.model.fontStyle;
        let textDecoration = childViewModel.model.textDecoration;
        for (i = 0; i < elements.length; i++) {
            elements[i].setFont(fontSize, fontFamily, fontWeight, fontStyle, textDecoration);
        }
    };
    const findRootArrayViewModel = function (controlModel, viRef) {
        let currControlModel = controlModel, rootArrayModel = null;
        let viModel, rootArrayViewModel;
        while (currControlModel.insideTopLevelContainer()) {
            if (currControlModel instanceof NationalInstruments.HtmlVI.Models.ArrayViewerModel) {
                rootArrayModel = currControlModel;
            }
            currControlModel = currControlModel.getOwner();
        }
        if (currControlModel instanceof NationalInstruments.HtmlVI.Models.ArrayViewerModel) {
            rootArrayModel = currControlModel;
        }
        viModel = NationalInstruments.HtmlVI.viReferenceService.getVIModelByVIRef(viRef);
        rootArrayViewModel = viModel.getControlViewModel(rootArrayModel.niControlId);
        return rootArrayViewModel;
    };
    const createElementShims = function (rootArrayViewModel, childViewModel) {
        let originalUserInteractionChanged = childViewModel.userInteractionChanged;
        let originalModelPropertyChanged = childViewModel.modelPropertyChanged;
        let originalChildViewModelAdded = childViewModel.onChildViewModelAdded;
        let originalChildViewModelRemoved = childViewModel.onChildViewModelRemoved;
        let owner = childViewModel.model.getOwner();
        let isArrayElement = owner instanceof NationalInstruments.HtmlVI.Models.ArrayViewerModel;
        return {
            setCallback: function () {
                childViewModel.userInteractionChanged = function (newState) {
                    let viewModelData = rootArrayViewModel._viewModelData[childViewModel.element.niControlId], renderBuffer;
                    let updateClonesAfterInteractionEnded = false;
                    if (newState === 'start') {
                        viewModelData.suppressBoundsChanges = true;
                    }
                    else if (newState === 'end') {
                        viewModelData.suppressBoundsChanges = false;
                        if (isArrayElement) {
                            arrayElementSizeChanged(childViewModel, rootArrayViewModel);
                            rootArrayViewModel.element.updateTemplateCss(childViewModel.element);
                        }
                        else {
                            if (viewModelData.recreateCellsOnUserInteractionEnd === true) {
                                rootArrayViewModel.recreateAllCells();
                                viewModelData.recreateCellsOnUserInteractionEnd = false;
                            }
                            else {
                                updateClonesAfterInteractionEnded = true;
                            }
                        }
                    }
                    originalUserInteractionChanged.call(childViewModel, newState);
                    //The original userInteractionChanged is called (newState = "end") to commit the bounds change.
                    // We update the clones with those CSS style changes for left / top / width / height at that point.
                    if (updateClonesAfterInteractionEnded) {
                        renderBuffer = NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer(childViewModel.element);
                        if (Object.keys(renderBuffer.cssStyles).length !== 0) {
                            updateElementsFromRenderBuffer(viewModelData.getClones(), renderBuffer, childViewModel.element);
                        }
                        rootArrayViewModel.element.updateTemplateCss(childViewModel.element);
                    }
                };
                childViewModel.modelPropertyChanged = function (propertyName) {
                    let viewModelData = rootArrayViewModel._viewModelData[childViewModel.element.niControlId], elements;
                    let focusedClone = null;
                    let renderBuffer;
                    if (viewModelData.suppressBoundsChanges && childViewModel.element._niFocusedCloneId !== undefined) {
                        focusedClone = document.querySelector('[ni-control-id=\'' + childViewModel.element._niFocusedCloneId + '\']');
                    }
                    renderBuffer = originalModelPropertyChanged.call(childViewModel, propertyName);
                    if (propertyName === 'left' || propertyName === 'top' || propertyName === 'width' || propertyName === 'height') {
                        if (isArrayElement) {
                            if ((propertyName === 'width' || propertyName === 'height') && !viewModelData.suppressBoundsChanges) {
                                arrayElementSizeChanged(childViewModel, rootArrayViewModel);
                                rootArrayViewModel.element.updateTemplateCss(childViewModel.element);
                            }
                        }
                        else {
                            if (viewModelData.suppressBoundsChanges) {
                                elements = [];
                                if (focusedClone !== null) {
                                    elements[0] = focusedClone;
                                }
                            }
                            else {
                                elements = viewModelData.getClones();
                                rootArrayViewModel.element.updateTemplateCss(childViewModel.element);
                            }
                            updateElementsFromRenderBuffer(elements, renderBuffer, childViewModel.element);
                        }
                    }
                    else if (propertyName === 'fontSize' || propertyName === 'fontFamily' || propertyName === 'fontWeight' || propertyName === 'fontStyle' || propertyName === 'textDecoration') {
                        elementFontChanged(viewModelData.getClones(), childViewModel);
                        rootArrayViewModel.element.updateTemplateCss(childViewModel.element);
                    }
                    else {
                        // If the value of the template control changed, we explicitly do nothing since defaultElementValue is handled by modelPropertyChanged.
                        if (childViewModel.element.valuePropertyDescriptor === undefined ||
                            (propertyName !== childViewModel.element.valuePropertyDescriptor.propertyName &&
                                propertyName !== childViewModel.element.valuePropertyDescriptor.propertyNameNonSignaling) ||
                            (childViewModel.element.parentElement instanceof NationalInstruments.HtmlVI.Elements.ArrayViewer) === false) {
                            elements = viewModelData.getClones();
                            updateElementsFromRenderBuffer(elements, renderBuffer, childViewModel.element, isArrayElement);
                        }
                    }
                    return renderBuffer;
                };
                childViewModel.onChildViewModelAdded = function (viewModel) {
                    let viewModelData, viViewModel;
                    originalChildViewModelAdded.call(childViewModel, viewModel);
                    rootArrayViewModel.initializeElementViewModel(viewModel);
                    viewModelData = rootArrayViewModel._viewModelData[viewModel.element.niControlId];
                    viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(viewModel.element.viRef);
                    if (childViewModel.element._modelMetadata === undefined || childViewModel.element._modelMetadata.initialLoad !== true) {
                        if (viViewModel.isUserInteracting(viewModel.element.niControlId)) {
                            viewModelData.recreateCellsOnUserInteractionEnd = true;
                            // Optimally we would just add a copy of the new control in all of the array cells.
                            // For now, we reinitialize the array (based on the current state of the template) when a descendant is added or removed,
                            // which is much simpler to implement, but also worse performance.
                            // We'll only update the focused cell at first, then the full array will be refreshed on user interaction end.
                            window.requestAnimationFrame(function () {
                                rootArrayViewModel.element.recreateCells(false);
                            });
                        }
                        else {
                            // A child has been added, after initial load, and not part of a user interaction. This is probably undo / redo, so we need to
                            // immediately update the whole array.
                            window.requestAnimationFrame(function () {
                                rootArrayViewModel.element.recreateCells(true);
                            });
                        }
                    }
                };
                childViewModel.onChildViewModelRemoved = function (viewModel) {
                    let viewModelData, elements, i;
                    viewModelData = rootArrayViewModel._viewModelData[viewModel.element.niControlId];
                    elements = viewModelData.getClones();
                    // If this is for an array, niArrayViewerViewModel.onChildViewModelRemoved is called here (when we call the original function.)
                    // That will call removeShim on the child, and remove it from the viewModelData map. So, for arrays, we skip doing those things
                    // later in this function.
                    originalChildViewModelRemoved.call(childViewModel, viewModel);
                    for (i = 0; i < elements.length; i++) {
                        elements[i].parentElement.removeChild(elements[i]);
                    }
                    if (!(childViewModel.model instanceof NationalInstruments.HtmlVI.Models.ArrayViewerModel)) {
                        viewModelData.shim.removeShim();
                        rootArrayViewModel._viewModelData[viewModel.element.niControlId] = undefined;
                    }
                };
            },
            removeShim: function () {
                childViewModel.userInteractionChanged = originalUserInteractionChanged;
                childViewModel.modelPropertyChanged = originalModelPropertyChanged;
                childViewModel.onChildViewModelAdded = originalChildViewModelAdded;
                childViewModel.onChildViewModelRemoved = originalChildViewModelRemoved;
            }
        };
    };
    class ArrayViewerViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualViewModel {
        // Constructor Function
        constructor(element, model) {
            super(element, model);
            // Public Instance Properties
            // None
            // Private Instance Properties
            this._viewModelData = {};
            this._recreateCellsRequested = false;
            this._isUserInteracting = false;
            this.registerAutoSyncProperty('dimensions');
            this.registerAutoSyncProperty('indexEditorWidth');
            this.registerAutoSyncProperty('indexVisibility');
            this.registerAutoSyncProperty('rowsAndColumns');
            this.registerAutoSyncProperty('orientation');
            this.registerAutoSyncProperty('verticalScrollbarVisibility');
            this.registerAutoSyncProperty('horizontalScrollbarVisibility');
            this.registerAutoSyncProperty('focusedCell');
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName), that = this;
            let i;
            switch (propertyName) {
                case 'value':
                    // postRender() updates these properties on the element the same time as the other renderBuffer updates (which are done
                    // all at once to minimize layout thrashing). We're not using the renderBuffer directly because currently, if dimensions/
                    // values are changing, dimensions must be set first for the array-viewer to behave correctly.
                    renderBuffer.postRender = function () {
                        that.element.dimensions = that.model.dimensions;
                        that.element.valueNonSignaling = that.model.value;
                    };
                    break;
                case 'niType':
                    renderBuffer.properties.niType = this.model.getNITypeString();
                    break;
                case 'defaultElementValue': {
                    let rootArrayViewModel = findRootArrayViewModel(this.model, this.element.viRef);
                    let arrayViewers = getArrayViewerAndClones(rootArrayViewModel, this.element, this.model);
                    for (i = 0; i < arrayViewers.length; i++) {
                        arrayViewers[i].setDefaultValue(this.model.defaultElementValue);
                    }
                    break;
                }
            }
            return renderBuffer;
        }
        recreateAllCells() {
            let that = this;
            if (!this._recreateCellsRequested) {
                this._recreateCellsRequested = true;
                window.requestAnimationFrame(function () {
                    that.element.recreateCells(true);
                    that._recreateCellsRequested = false;
                });
            }
        }
        bindToView() {
            super.bindToView();
            let that = this;
            let viModel, childModel;
            that.bindTextFocusEventListener();
            that.element.addEventListener('value-changed', function (evt) {
                let newValue, oldValue;
                if (evt.target === that.element) {
                    newValue = evt.detail.newValue;
                    oldValue = evt.detail.oldValue;
                    that.model.controlChanged(newValue, oldValue);
                }
            });
            that.element.addEventListener('array-size-changed', function (evt) {
                if (evt.target === that.element) {
                    that.model.height = evt.detail.height;
                    that.model.width = evt.detail.width;
                }
            });
            that.element.addEventListener('scroll-changed', function (evt) {
                if (evt.target === that.element) {
                    that.model.scrollChanged(evt.detail.indices);
                }
            });
            if (that.model.childModels.length > 0) {
                childModel = that.model.childModels[0];
                viModel = NationalInstruments.HtmlVI.viReferenceService.getVIModelByVIRef(that.viRef);
                that.initializeArrayElementViewModel(viModel.getControlViewModel(childModel.niControlId));
            }
        }
        userInteractionChanged(newState) {
            super.userInteractionChanged(newState);
            if (newState === 'start') {
                this._isUserInteracting = true;
            }
            else if (newState === 'end') {
                this._isUserInteracting = false;
                if (this.model.childModels.length > 0) {
                    let childModel = this.model.childModels[0];
                    let viRef = this.element.viRef;
                    let viModel = NationalInstruments.HtmlVI.viReferenceService.getVIModelByVIRef(viRef);
                    let childViewModel = viModel.getControlViewModel(childModel.niControlId);
                    let rootArrayViewModel = findRootArrayViewModel(childModel, viRef);
                    arrayElementSizeChanged(childViewModel, rootArrayViewModel);
                }
            }
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            this.model.value = this.element.value;
            this.model.niType = new window.NIType(this.element.niType);
        }
        applyModelToElement() {
            super.applyModelToElement();
            this.element.niType = this.model.getNITypeString();
            this.element.valueNonSignaling = this.model.value;
        }
        onChildViewModelAdded(childViewModel) {
            super.onChildViewModelAdded(childViewModel);
            this.initializeArrayElementViewModel(childViewModel);
        }
        onChildViewModelRemoved(childViewModel) {
            let rootArrayViewModel = findRootArrayViewModel(childViewModel.model, this.element.viRef);
            let viewModelData = rootArrayViewModel._viewModelData[childViewModel.element.niControlId];
            viewModelData.shim.removeShim();
            rootArrayViewModel._viewModelData[childViewModel.element.niControlId] = undefined;
        }
        initializeArrayElementViewModel(childViewModel) {
            let rootArrayViewModel = findRootArrayViewModel(childViewModel.model, this.element.viRef);
            if (rootArrayViewModel === this) {
                this.initializeElementViewModel(childViewModel);
            }
        }
        initializeElementViewModel(childViewModel) {
            let i, curChild, viModel, shim, curViewModel, childModels, viewModelData;
            if (childViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualViewModel) {
                shim = createElementShims(this, childViewModel);
                shim.setCallback();
                viewModelData = {};
                viewModelData.shim = shim;
                viewModelData.cssCloneSelector = this.element.getFullCssSelectorForNIVisual(childViewModel.element);
                viewModelData.getClones = function () {
                    let results = document.querySelectorAll(viewModelData.cssCloneSelector);
                    return results;
                };
                this._viewModelData[childViewModel.model.niControlId] = viewModelData;
                childModels = Array.prototype.slice.call(childViewModel.model.childModels);
                for (i = 0; i < childModels.length; i++) {
                    curChild = childModels[i];
                    viModel = NationalInstruments.HtmlVI.viReferenceService.getVIModelByVIRef(this.element.viRef);
                    curViewModel = viModel.getControlViewModel(curChild.niControlId);
                    this.initializeElementViewModel(curViewModel);
                }
            }
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(ArrayViewerViewModel, NationalInstruments.HtmlVI.Elements.ArrayViewer, NationalInstruments.HtmlVI.Models.ArrayViewerModel);
    NationalInstruments.HtmlVI.ViewModels.ArrayViewerViewModel = ArrayViewerViewModel;
})();
//# sourceMappingURL=niArrayViewerViewModel.js.map