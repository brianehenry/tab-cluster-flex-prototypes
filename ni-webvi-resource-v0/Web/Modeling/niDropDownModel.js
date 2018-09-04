"use strict";
//****************************************
// DropDown Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.DropDownModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.INT32;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.DropDownModel.MODEL_KIND = 'niDropDown';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.DropDownModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedIndex', defaultValue: -1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'popupEnabled', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'textAlignment', defaultValue: 'left' });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'selectedIndex';
    };
    proto.getSelectedText = function () {
        return this.source[this.selectedIndex];
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.selectedIndex;
        this.selectedIndex = newValue;
        parent.prototype.controlChanged.call(this, 'selectedIndex', newValue, oldValue);
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.SelectorModel));
//# sourceMappingURL=niDropDownModel.js.map