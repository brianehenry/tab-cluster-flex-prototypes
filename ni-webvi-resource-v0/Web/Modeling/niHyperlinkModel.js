"use strict";
//****************************************
// Hyperlink Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.HyperlinkModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.HyperlinkModel.MODEL_KIND = 'niHyperlink';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.HyperlinkModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'href', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'content', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'href';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.href;
        this.href = newValue;
        parent.prototype.controlChanged.call(this, 'href', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.href = gPropertyValue;
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(gPropertyValue);
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.href;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niHyperlinkModel.js.map