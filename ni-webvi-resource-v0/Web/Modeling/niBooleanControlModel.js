"use strict";
//****************************************
// Boolean Control Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanControlModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.BOOLEAN;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.BooleanControlModel.ClickModeEnum = Object.freeze({
        PRESS: 'press',
        RELEASE: 'release'
    });
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.BooleanControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'contentVisible', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'content', defaultValue: 'Button' });
        proto.addModelProperty(targetPrototype, { propertyName: 'clickMode', defaultValue: NationalInstruments.HtmlVI.Models.BooleanControlModel.ClickModeEnum.RELEASE });
        proto.addModelProperty(targetPrototype, { propertyName: 'momentary', defaultValue: false });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.value;
        this.value = newValue;
        parent.prototype.controlChanged.call(this, 'value', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.value = gPropertyValue;
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(gPropertyValue);
                break;
            case GPropertyNameConstants.TEXT: {
                const indexOfContent = 0;
                // set the content only if it is a non-empty array
                if (gPropertyValue.length > indexOfContent) {
                    this.content = NI_SUPPORT.escapeHtml(gPropertyValue[indexOfContent]);
                }
                break;
            }
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.value;
            case GPropertyNameConstants.TEXT:
                return [NI_SUPPORT.unescapeHtml(this.content)];
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niBooleanControlModel.js.map