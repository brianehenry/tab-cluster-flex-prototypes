"use strict";
//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    const CSS_PROPERTIES = NationalInstruments.HtmlVI.CssProperties;
    // Static Private Variables
    const USER_INTERACTION_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.UserInteractionState;
    const INTERACTIVE_OPERATION_KIND_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.InteractiveOperationKind;
    // Static Private Functions
    const getModelBounds = function (model) {
        // Assuming bounds are saved as '(\d)+px'
        return {
            left: parseInt(model.left),
            top: parseInt(model.top),
            width: parseInt(model.width),
            height: parseInt(model.height)
        };
    };
    const isInIdeMode = function (viewModel) {
        return NationalInstruments.HtmlVI.viReferenceService.getWebAppModelByVIRef(viewModel.element.viRef).updateService.isInIdeMode();
    };
    class VisualViewModel extends NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel {
        constructor(element, model) {
            super(element, model);
            this.registerAutoSyncProperty("labelId");
        }
        bindTextFocusEventListener() {
            let that = this;
            let niElement = that.element;
            let focusEventType = 'Focus';
            let createHandlerHelper = function (value) {
                return function (event) {
                    let target = event.target;
                    while (target !== null) {
                        if (target.isTextEditFocusable !== undefined && target.isTextEditFocusable(event.target)) {
                            break;
                        }
                        target = target.parentElement;
                    }
                    if (target !== null) {
                        that.model.internalControlEventOccurred(focusEventType, value);
                    }
                };
            };
            niElement.addEventListener('focus', createHandlerHelper(true), true);
            niElement.addEventListener('blur', createHandlerHelper(false), true);
        }
        getReadOnlyPropertyName() {
            return 'readOnly';
        }
        computeReadOnlyForElement() {
            if (isInIdeMode(this)) {
                return false;
            }
            return this.model.readOnly;
        }
        bindToView() {
            super.bindToView();
            let that = this;
            if (that.enableEvents() === true) {
                that.element.addEventListener('mousedown', function (e) {
                    let data = {
                        x: e.clientX,
                        y: e.clientY,
                        buttons: e.buttons,
                        count: e.detail,
                        ctrlKey: e.ctrlKey,
                        shiftKey: e.shiftKey,
                        altKey: e.altKey
                    };
                    that.model.controlEventOccurred('mousedown', data);
                });
            }
        }
        modelPropertyChanged(propertyName) {
            let renderBuffer = super.modelPropertyChanged(propertyName), readOnly;
            switch (propertyName) {
                case 'width':
                case 'height':
                    this.model.requestSendControlBounds();
                    this.setBoundsToRenderBuffer(getModelBounds(this.model), renderBuffer);
                    break;
                case 'top':
                case 'left':
                    this.setBoundsToRenderBuffer(getModelBounds(this.model), renderBuffer);
                    break;
                case 'visible':
                    if (!this.model.visible) {
                        renderBuffer.cssClasses.toAdd.push('ni-hidden');
                    }
                    else {
                        renderBuffer.cssClasses.toRemove.push('ni-hidden');
                    }
                    break;
                case 'foreground':
                    renderBuffer.cssStyles[CSS_PROPERTIES.FOREGROUND_COLOR] = this.model.foreground;
                    break;
                case 'fontSize':
                case 'fontWeight':
                case 'fontStyle':
                case 'fontFamily':
                case 'textDecoration':
                    // TODO mraj font should be handled by the view model, not the element
                    this.element.setFont(this.model.fontSize, this.model.fontFamily, this.model.fontWeight, this.model.fontStyle, this.model.textDecoration);
                    break;
                case 'enabled':
                    renderBuffer.properties.disabled = !this.model.enabled;
                    break;
                case 'readOnly':
                    if (isInIdeMode(this)) {
                        if (this.model.readOnly) {
                            renderBuffer.cssClasses.toAdd.push('edit-time-indicator');
                        }
                        else {
                            renderBuffer.cssClasses.toRemove.push('edit-time-indicator');
                        }
                    }
                    readOnly = this.computeReadOnlyForElement();
                    renderBuffer.properties[this.getReadOnlyPropertyName()] = readOnly;
                    renderBuffer.properties.readOnly = readOnly; // US191711 : Clean up C# tests so we don't need this
                    break;
            }
            return renderBuffer;
        }
        // Called by niEditorUpdateService.
        userInteractionChanged(newState, operationKind) {
            let renderBuffer = NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer(this.element);
            let isMoveOrCreate = operationKind === INTERACTIVE_OPERATION_KIND_ENUM.MOVE ||
                operationKind === INTERACTIVE_OPERATION_KIND_ENUM.CREATE;
            let elements = [this.element];
            let parentViewModel = this.getOwnerViewModel();
            if (parentViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualViewModel &&
                parentViewModel.shouldApplyDraggingStyleWithChild()) {
                elements.push(parentViewModel.element);
            }
            if (newState === USER_INTERACTION_STATE_ENUM.END) {
                if (isMoveOrCreate) {
                    for (let element of elements) {
                        if (element) {
                            element.classList.remove('ni-is-being-dragged');
                        }
                    }
                }
                renderBuffer.cssClasses.toRemove.push('ni-will-change-position');
            }
            else if (newState === USER_INTERACTION_STATE_ENUM.START) {
                if (isMoveOrCreate) {
                    for (let element of elements) {
                        if (element) {
                            element.classList.add('ni-is-being-dragged');
                        }
                    }
                }
                renderBuffer.cssClasses.toAdd.push('ni-will-change-position');
            }
            this.applyElementChanges();
        }
        updateModelFromElement() {
            super.updateModelFromElement();
            let model = this.model, element = this.element;
            let style = window.getComputedStyle(element);
            // CSS 'used' values https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
            model.top = style.getPropertyValue('top'); // string as pixel value, ie '5px'
            model.left = style.getPropertyValue('left'); // string as pixel value
            if (model.shouldApplyWidth()) {
                model.width = style.getPropertyValue('width'); // string as pixel value
            }
            if (model.shouldApplyHeight()) {
                model.height = style.getPropertyValue('height'); // string as pixel value
            }
            // CSS 'resolved' values https://developer.mozilla.org/en-US/docs/Web/CSS/resolved_value
            model.fontSize = style.getPropertyValue('font-size'); // string as pixel value
            model.fontFamily = style.getPropertyValue('font-family'); // comma separated string
            model.fontWeight = style.getPropertyValue('font-weight'); // string as weight number, ie '500', https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight
            model.fontStyle = style.getPropertyValue('font-style'); // string
            model.textDecoration = style.getPropertyValue('text-decoration'); // string
            model.visible = !element.classList.contains('ni-hidden'); // string
            // CSS 'resolved' but returns rgba() if alpha otherwise rgb() https://developer.mozilla.org/en-US/docs/Web/CSS/color
            model.foreground = style.getPropertyValue(CSS_PROPERTIES.FOREGROUND_COLOR);
            model.enabled = !element.disabled;
            model.readOnly = element[this.getReadOnlyPropertyName()];
            model.setBindingInfo(element.bindingInfo);
        }
        applyModelToElement() {
            super.applyModelToElement();
            let model = this.model, element = this.element, readOnly;
            if (model.shouldApplyPosition()) {
                element.style.top = model.top;
                element.style.left = model.left;
            }
            if (model.shouldApplyWidth()) {
                element.style.width = model.width;
            }
            if (model.shouldApplyHeight()) {
                element.style.height = model.height;
            }
            element.style.setProperty(CSS_PROPERTIES.FOREGROUND_COLOR, model.foreground);
            element.style.fontSize = model.fontSize;
            element.style.fontFamily = model.fontFamily;
            element.style.fontWeight = model.fontWeight;
            element.style.fontStyle = model.fontStyle;
            element.style.textDecoration = model.textDecoration;
            if (!model.visible) {
                element.classList.add('ni-hidden');
            }
            else {
                element.classList.remove('ni-hidden');
            }
            element.bindingInfo = model.getBindingInfo();
            readOnly = this.computeReadOnlyForElement();
            element[this.getReadOnlyPropertyName()] = readOnly;
            element.readOnly = readOnly; // US191711 : Clean up C# tests so we don't need this
            if (isInIdeMode(this) && this.model.readOnly) {
                element.classList.add('edit-time-indicator');
            }
            element.disabled = !model.enabled;
        }
        setBoundsToRenderBuffer(bounds, renderBuffer) {
            if (this.model.shouldApplyPosition()) {
                renderBuffer.cssStyles.top = bounds.top + 'px';
                renderBuffer.cssStyles.left = bounds.left + 'px';
            }
            if (this.model.shouldApplyWidth()) {
                renderBuffer.cssStyles.width = bounds.width + 'px';
            }
            if (this.model.shouldApplyHeight()) {
                renderBuffer.cssStyles.height = bounds.height + 'px';
            }
        }
        shouldApplyDraggingStyleWithChild() {
            return false;
        }
    }
    NationalInstruments.HtmlVI.ViewModels.VisualViewModel = VisualViewModel;
})();
//# sourceMappingURL=niVisualViewModel.js.map