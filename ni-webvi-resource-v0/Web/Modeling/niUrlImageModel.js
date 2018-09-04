"use strict";
//****************************************
// Url Image Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    const NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    const STRETCH_ENUM = NationalInstruments.HtmlVI.Elements.UrlImage.StretchEnum;
    const NITypes = window.NITypes;
    const GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.UrlImageModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.STRING;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.UrlImageModel.MODEL_KIND = 'niUrlImage';
    // Static Public Functions
    // None
    // Prototype creation
    const child = NationalInstruments.HtmlVI.Models.UrlImageModel;
    const proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'source', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'alternate', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'stretch', defaultValue: STRETCH_ENUM.UNIFORM });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'source';
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.source = gPropertyValue;
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.source;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niUrlImageModel.js.map