"use strict";
//****************************************
// Text Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.TextModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.TextModel.MODEL_KIND = 'niText';
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.TextModel, 'TextAlignmentEnum', Object.freeze({
        LEFT: 'left',
        CENTER: 'center',
        RIGHT: 'right',
        JUSTIFY: 'justify'
    }));
    var TEXT_ALIGNMENT_ENUM = NationalInstruments.HtmlVI.Models.TextModel.TextAlignmentEnum;
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.TextModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'text', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: TEXT_ALIGNMENT_ENUM.LEFT });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'text';
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.TEXT:
                this.text = gPropertyValue;
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.TEXT:
                return this.text;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niTextModel.js.map