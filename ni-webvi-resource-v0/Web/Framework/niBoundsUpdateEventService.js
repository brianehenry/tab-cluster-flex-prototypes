"use strict";
/**
 * Service that sends bounds update events to the LabVIEW editor
 * National Instruments Copyright 2018
 */
class NIBoundsUpdateEventService {
    /**
     * @constructor
     * @param frontPanelViewModel - View model for the HTML panel.
     * @param triggerEventCallback - Callback to send bounds event data.
     */
    constructor(frontPanelViewModel, triggerEventCallback) {
        this.boundsUpdateElements = new Map();
        this.pendingElementPositionUpdate = false;
        if (typeof triggerEventCallback !== "function") {
            throw new Error("Callback is not valid");
        }
        this.frontPanelViewModel = frontPanelViewModel;
        this.triggerEventCallback = triggerEventCallback;
    }
    /**
     * Registers a control element and sends a bounds update event
     * @param element - The HTML element to register
     * @param controlId - The ID of the associated control
     */
    onElementAdded(element, controlId) {
        this.validateElement(element);
        if (typeof controlId !== "string" && controlId !== "") {
            throw new Error("Control ID is not valid");
        }
        this.boundsUpdateElements.set(controlId, element);
        this.requestSendElementBounds();
    }
    /**
     * Unregisters a control element and sends a bounds update event
     * @param controlId - The ID of the control to unregister
     */
    onElementRemoved(controlId) {
        if (typeof controlId !== "string" && controlId !== "") {
            throw new Error("Control ID is not valid");
        }
        this.boundsUpdateElements.delete(controlId);
        this.requestSendElementBounds();
    }
    /**
     * Schedules a task to send control bounds to C#, unless one is already scheduled
     */
    requestSendElementBounds() {
        const that = this;
        if (!that.frontPanelViewModel.model.flexiblePanel) {
            return;
        }
        if (!that.pendingElementPositionUpdate) {
            that.pendingElementPositionUpdate = true;
            // Using both requestAnimationFrame and setTimeout here to ensure that bounds are measured
            // AFTER layout has happened. RAF callback is called before layout.
            window.requestAnimationFrame(() => setTimeout(that.sendElementBoundsCore.bind(that), 0));
        }
    }
    sendElementBoundsCore() {
        const eventData = {};
        for (const [controlId, element] of this.boundsUpdateElements.entries()) {
            if (!document.body.contains(element)) {
                // filter out elements that have been removed from the DOM, as a precaution
                this.boundsUpdateElements.delete(controlId);
                continue;
            }
            const clientRect = element.getBoundingClientRect();
            const parentRect = element.parentElement.getBoundingClientRect();
            if (clientRect.top === 0 &&
                clientRect.left === 0 &&
                clientRect.width === 0 &&
                clientRect.height === 0) {
                // don't send bounds updates with 0 values
                // most likely because element is display: none
                // e.g. hidden label
                continue;
            }
            eventData[controlId] = {
                bottom: clientRect.bottom - parentRect.top,
                height: clientRect.height,
                left: clientRect.left - parentRect.left,
                right: clientRect.right - parentRect.left,
                top: clientRect.top - parentRect.top,
                width: clientRect.width
            };
        }
        if (Object.keys(eventData).length !== 0) {
            this.triggerEventCallback(JSON.stringify(eventData));
        }
        this.pendingElementPositionUpdate = false;
    }
    validateElement(element) {
        if (!(element instanceof Element)) {
            throw new Error("Element is not valid");
        }
    }
}
// @ts-ignore
NationalInstruments.HtmlVI.Framework.NIBoundsUpdateEventService = NIBoundsUpdateEventService;
//# sourceMappingURL=niBoundsUpdateEventService.js.map