"use strict";
//****************************************
// ListBox Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SELECTION_MODE_ENUM = NationalInstruments.HtmlVI.NIListBox.SelectionModeEnum;
    var NITypes = window.NITypes;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.ListBoxModel = function (id) {
        parent.call(this, id);
        this.niType = NITypes.INT32;
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NationalInstruments.HtmlVI.Models.ListBoxModel.MODEL_KIND = 'niListBox';
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ListBoxModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'selectionMode', defaultValue: SELECTION_MODE_ENUM.ONE });
        proto.addModelProperty(targetPrototype, { propertyName: 'selectedIndexes', defaultValue: -1 });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'selectedIndexes';
    };
    proto.controlChanged = function (newValue) {
        var oldValue = this.selectedIndexes;
        this.selectedIndexes = newValue;
        parent.prototype.controlChanged.call(this, 'selectedIndexes', newValue, oldValue);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.selectedIndexes = gPropertyValue;
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
                return this.selectedIndexes;
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.SelectorModel));
//# sourceMappingURL=niListBoxModel.js.map