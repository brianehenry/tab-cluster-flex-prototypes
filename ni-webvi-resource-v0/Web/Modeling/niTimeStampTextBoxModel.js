"use strict";
//****************************************
// Time Stamp Text Box Model
// Note that all values are expeced in LV time units
// (currently a number storing seconds since 1904, eventually also a number storing fractional seconds)
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.TIMESTAMP;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel.MODEL_KIND = 'niTimeStampTextBox';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    var MIN_TIME = '-9223372036854775808:0'; // -9223372036854775808 is the smallest value that can be represented on int64
    var MAX_TIME = '9223372036854775807:0'; // -9223372036854775808 is the biggest value that can be represented on int64
    var NI_TYPE_PROPERTIES = {
        'value': true,
        'minimum': true,
        'maximum': true
    };
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'minimum', defaultValue: MIN_TIME });
        proto.addModelProperty(targetPrototype, { propertyName: 'maximum', defaultValue: MAX_TIME });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: '0:0' });
        proto.addModelProperty(targetPrototype, { propertyName: 'formatString', defaultValue: 'MM/dd/yyyy hh:mm:ss.fff tt' });
        proto.addModelProperty(targetPrototype, { propertyName: 'showCalendarButton', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'spinButtons', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return NI_TYPE_PROPERTIES[propertyName] === true;
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
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
    // Inheritance is different from C# model (where time stamp is a numeric) so that min/max/value properties can have a different datatype
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niTimeStampTextBoxModel.js.map