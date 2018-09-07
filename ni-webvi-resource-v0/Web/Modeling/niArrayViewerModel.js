"use strict";
//****************************************
// Array viewer Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;
    let GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    const INDEX_FOR_ROW = 0;
    const INDEX_FOR_COLUMN = 1;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.ArrayViewerModel = function (id) {
        parent.call(this, id);
        this.niType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: { name: NITypeNames.VOID } });
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.ArrayViewerModel, 'MODEL_KIND', 'niArrayViewer');
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ArrayViewerModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, { propertyName: 'rowsAndColumns', defaultValue: '1,1' });
        proto.addModelProperty(targetPrototype, { propertyName: 'dimensions', defaultValue: 1 });
        proto.addModelProperty(targetPrototype, { propertyName: 'indexEditorWidth', defaultValue: 53 });
        proto.addModelProperty(targetPrototype, { propertyName: 'indexVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: 'horizontal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'horizontalScrollbarVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'verticalScrollbarVisibility', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'focusedCell', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: [] });
        proto.addModelProperty(targetPrototype, { propertyName: 'defaultElementValue', defaultValue: undefined });
    });
    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };
    proto.controlChanged = function (newValue, oldValue) {
        this.value = newValue;
        parent.prototype.controlChanged.call(this, 'value', newValue, oldValue);
    };
    // special case for keeping the editor up to date on the scroll position of the array
    proto.scrollChanged = function (indices) {
        this.internalControlEventOccurred('ArrayScrolledEvent', indices);
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                this.value = gPropertyValue;
                break;
            case GPropertyNameConstants.VALUE_SIGNALING:
                var oldValue = this.value;
                this.controlChanged(gPropertyValue, oldValue);
                break;
            case GPropertyNameConstants.VISIBLEROWS:
                {
                    let currentVisibleColumnsValue = parseRowsAndColumns(this.rowsAndColumns, INDEX_FOR_COLUMN);
                    if (currentVisibleColumnsValue > 1 && this.dimensions === 1) {
                        this.orientation = "vertical";
                        this.rowsAndColumns = gPropertyValue + ",1";
                    }
                    else {
                        this.rowsAndColumns = gPropertyValue + "," + currentVisibleColumnsValue;
                    }
                    break;
                }
            case GPropertyNameConstants.VISIBLECOLUMNS:
                {
                    let currentVisibleRowsValue = parseRowsAndColumns(this.rowsAndColumns, INDEX_FOR_ROW);
                    if (currentVisibleRowsValue > 1 && this.dimensions === 1) {
                        this.orientation = "horizontal";
                        this.rowsAndColumns = "1," + gPropertyValue;
                    }
                    else {
                        this.rowsAndColumns = currentVisibleRowsValue + "," + gPropertyValue;
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
            case GPropertyNameConstants.VISIBLEROWS:
                return parseRowsAndColumns(this.rowsAndColumns, INDEX_FOR_ROW);
            case GPropertyNameConstants.VISIBLECOLUMNS:
                return parseRowsAndColumns(this.rowsAndColumns, INDEX_FOR_COLUMN);
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    function parseRowsAndColumns(rowsAndColumns, index) {
        var indices;
        if (typeof rowsAndColumns === 'string' && rowsAndColumns.length > 0) {
            indices = rowsAndColumns.split(',');
            if (indices.length === 2) {
                return parseInt(indices[index]);
            }
            else {
                throw new Error("RowsAndColumns pair should be in the form 'row,column'");
            }
        }
        else {
            throw new Error("RowsAndColumns should be string type with length > 0.");
        }
    }
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));
//# sourceMappingURL=niArrayViewerModel.js.map