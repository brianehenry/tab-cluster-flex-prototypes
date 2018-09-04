"use strict";
//****************************************
// Tab Item Prototype
// DOM Registration: HTMLNITabItem
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    class TabItem extends NationalInstruments.HtmlVI.Elements.VisualComponent {
        // Static Private Variables
        // None
        // Static Private Functions
        // None
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = TabItem.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'tabPosition',
                defaultValue: -1
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'header',
                defaultValue: 'TabItem'
            });
        }
        createdCallback() {
            super.createdCallback();
            // Public Instance Properties
            // None
            // Private Instance Properties
            this._parentTabControl = undefined;
        }
        sendEventToParentTabControl(name) {
            var eventConfig;
            if (this._parentTabControl !== undefined) {
                eventConfig = {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        element: this
                    }
                };
                this._parentTabControl.dispatchEvent(new CustomEvent(name, eventConfig));
            }
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            if (this.parentElement instanceof NationalInstruments.HtmlVI.Elements.TabControl) {
                if (firstCall === true) {
                    this.updateDisableStateForChild();
                }
                this._parentTabControl = this.parentElement;
                this.sendEventToParentTabControl('ni-tab-item-attached');
            }
            else {
                NI_SUPPORT.error('Tab Item does not have a parent Tab Control ' + this);
                this._parentTabControl = undefined;
            }
            return firstCall;
        }
        forceResizeChildren() {
            var children = this.children;
            if (!children) {
                return;
            }
            for (var i = 0; i < children.length; i++) {
                if (NI_SUPPORT.isElement(children[i])) {
                    if (typeof children[i].forceResizeChildren === 'function') {
                        children[i].forceResizeChildren();
                    }
                }
            }
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'header':
                    this.sendEventToParentTabControl('ni-tab-item-header-updated');
                    break;
                case 'tabPosition':
                    this.sendEventToParentTabControl('ni-tab-item-position-updated');
                    break;
                case 'disabled':
                    this.updateDisableStateForChild();
                    break;
                default:
                    break;
            }
        }
        updateDisableStateForChild() {
            // child node of tab item is layout panel
            if (this.hasChildNodes() && NI_SUPPORT.isElement(this.childNodes[0])) {
                this.childNodes[0].disabled = this.disabled;
            }
        }
        detachedCallback() {
            super.detachedCallback();
            this.sendEventToParentTabControl('ni-tab-item-detached');
            this._parentTabControl = undefined;
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(TabItem.prototype, 'ni-tab-item', 'HTMLNITabItem');
    NationalInstruments.HtmlVI.Elements.TabItem = TabItem;
}());
//# sourceMappingURL=ni-tab-item.js.map