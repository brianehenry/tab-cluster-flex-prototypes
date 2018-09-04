"use strict";
//****************************************
// Boolean Switch Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanSwitchModel = function (id) {
        parent.call(this, id);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.BooleanSwitchModel.MODEL_KIND = 'niBooleanSwitch';
    NationalInstruments.HtmlVI.Models.BooleanSwitchModel.OrientationEnum = Object.freeze({
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
    });
    NationalInstruments.HtmlVI.Models.BooleanSwitchModel.ShapeEnum = Object.freeze({
        SLIDER: 'slider',
        POWER: 'power'
    });
    // Static Private Reference Aliases
    var ORIENTATION_ENUM = NationalInstruments.HtmlVI.Models.BooleanSwitchModel.OrientationEnum;
    var SHAPE_ENUM = NationalInstruments.HtmlVI.Models.BooleanSwitchModel.ShapeEnum;
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.BooleanSwitchModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'shape', defaultValue: SHAPE_ENUM.SLIDER });
        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: ORIENTATION_ENUM.HORIZONTAL });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
    });
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.BooleanContentControlModel));
//# sourceMappingURL=niBooleanSwitchModel.js.map