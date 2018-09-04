"use strict";
//****************************************
// String Control Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.StringControlModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.StringControlModel.MODEL_KIND = 'niStringControl';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.StringControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'text', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'acceptsReturn', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'typeToReplace', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'wordWrap', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowVerticalScrollbar', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'allowHorizontalScrollbar', defaultValue: false });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'text';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.text;
        this.text = newValue;
        parent.prototype.controlChanged.call(this, 'text', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.text = gPropertyValue;
                break;
            case GPropertyNameConstants.ENABLE_WRAP:
                this.wordWrap = gPropertyValue;
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
                return this.text;
            case GPropertyNameConstants.ENABLE_WRAP:
                return this.wordWrap;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niStringControlModel.js.map