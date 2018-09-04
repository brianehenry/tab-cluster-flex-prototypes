"use strict";
//****************************************
// Visual Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************
// Static Public Variables
// None
(function () {
    'use strict';
    // Static Private Reference Aliases
    // var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    class Visual extends NationalInstruments.HtmlVI.Elements.VisualComponent {
        // Static Private Variables
        // None
        // Static Private Functions
        // None
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = Visual.prototype;
            proto.addProperty(targetPrototype, {
                propertyName: 'readOnly',
                defaultValue: false
            });
        }
        isTextEditFocusable() {
            return false;
        }
        // Only implement for broken child elements that for some reason do not inherit
        // font properties from the containing custom element
        setFont(fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
            this.style.fontSize = fontSize;
            this.style.fontFamily = fontFamily;
            this.style.fontWeight = fontWeight;
            this.style.fontStyle = fontStyle;
            this.style.textDecoration = textDecoration;
        }
    }
    NationalInstruments.HtmlVI.Elements.Visual = Visual;
}());
//# sourceMappingURL=ni-visual.js.map