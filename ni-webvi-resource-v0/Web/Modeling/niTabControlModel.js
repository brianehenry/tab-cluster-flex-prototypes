"use strict";
//****************************************
// Boolean Button Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    let MathHelpers = NationalInstruments.HtmlVI.MathHelpers;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.TabControlModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.INT32;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.TabControlModel.MODEL_KIND = 'niTabControl';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.TabControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var clampForValue = function (gPropertyValue, itemLength) {
        return MathHelpers.clamp(gPropertyValue, 0, itemLength - 1);
    };
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'tabStripPlacement', defaultValue: 'top' });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedIndex', defaultValue: 0 });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'selectedIndex';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.selectedIndex;
        this.selectedIndex = newValue;
        parent.prototype.controlChanged.call(this, 'selectedIndex', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.selectedIndex = clampForValue(gPropertyValue, this.childModels.length);
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(clampForValue(gPropertyValue, this.childModels.length));
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.selectedIndex;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niTabControlModel.js.map