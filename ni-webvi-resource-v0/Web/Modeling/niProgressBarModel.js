"use strict";
//****************************************
// Progress Bar Model
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
    NationalInstruments.HtmlVI.Models.ProgressBarModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.DOUBLE;
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
    var child = NationalInstruments.HtmlVI.Models.ProgressBarModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'minimum', defaultValue: 0 });
        proto.addModelProperty(targetPrototype, { propertyName: 'maximum', defaultValue: 10 });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: 0 });
        proto.addModelProperty(targetPrototype, { propertyName: 'indeterminate', defaultValue: false });
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
                this.value = MathHelpers.clamp(gPropertyValue, this.minimum, this.maximum);
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                this.controlChanged(MathHelpers.clamp(gPropertyValue, this.minimum, this.maximum));
                break;
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                return this.value;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niProgressBarModel.js.map