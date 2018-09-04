"use strict";
//****************************************
// Boolean Control Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    const NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    const GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanContentControlModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    let child = NationalInstruments.HtmlVI.Models.BooleanContentControlModel;
    let proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'trueContent', defaultValue: 'on' });
        proto.addModelProperty(targetPrototype, { propertyName: 'falseContent', defaultValue: 'off' });
        proto.addModelProperty(targetPrototype, { propertyName: 'falseContentVisibility', defaultValue: false });
    });
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.TEXT: {
                const indexOfTrueContent = 0;
                // if condition will leave the true/false Content unchanged in empty array situation.
                if (gPropertyValue.length > indexOfTrueContent) {
                    this.trueContent = NI_SUPPORT.escapeHtml(gPropertyValue[indexOfTrueContent]);
                }
                const indexOfFalseContent = 1;
                if (gPropertyValue.length > indexOfFalseContent) {
                    this.falseContent = NI_SUPPORT.escapeHtml(gPropertyValue[indexOfFalseContent]);
                }
                break;
            }
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.TEXT:
                return [NI_SUPPORT.unescapeHtml(this.trueContent), NI_SUPPORT.unescapeHtml(this.falseContent)];
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
}(NationalInstruments.HtmlVI.Models.BooleanControlModel));
//# sourceMappingURL=niBooleanContentControlModel.js.map