"use strict";
//****************************************
// Layout Panel Prototype
// DOM Registration: HTMLNILayoutPanel
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    class LayoutPanel extends NationalInstruments.HtmlVI.Elements.Visual {
        // Static Private Variables
        // None
        // Static Private Functions
        // None
        // Public Prototype Methods
        forceResizeChildren() {
            var children = this.children;
            for (var i = 0; i < children.length; i++) {
                if (NI_SUPPORT.isElement(children[i])) {
                    if (typeof children[i].forceResize === 'function') {
                        if (children[i]._latestSize) {
                            children[i].forceResize(children[i]._latestSize);
                        }
                    }
                }
            }
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            if (firstCall === true) {
                this.updateDisableStateForChildren();
            }
            return firstCall;
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'disabled':
                    this.updateDisableStateForChildren();
                    break;
                default:
                    break;
            }
        }
        updateDisableStateForChildren() {
            if (this.hasChildNodes()) {
                for (var i = 0; i < this.childNodes.length; ++i) {
                    if (NI_SUPPORT.isElement(this.childNodes[i])) {
                        this.childNodes[i].disabled = this.disabled;
                    }
                }
            }
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(LayoutPanel.prototype, 'ni-layout-panel', 'HTMLNILayoutPanel');
    NationalInstruments.HtmlVI.Elements.LayoutPanel = LayoutPanel;
}());
//# sourceMappingURL=ni-layout-panel.js.map