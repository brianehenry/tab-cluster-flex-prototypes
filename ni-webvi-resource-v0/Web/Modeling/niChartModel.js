"use strict";
//****************************************
// Chart Graph Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TypedHistoryBuffer = NationalInstruments.HtmlVI.DataPipeline.TypedHistoryBuffer;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;
    var NIType = window.NIType;
    var GPropertyNameConstants = NationalInstruments.HtmlVI.GPropertyNameConstants;
    // Constructor Function
    NationalInstruments.HtmlVI.Models.ChartModel = function (id) {
        // Public Instance Properties
        // The ni-type property is set by the parent constructor. niChartModel is
        //overridding the ni-type and its setter depends on this historyBuffer.
        this.historyBuffer = new TypedHistoryBuffer(1024, 1);
        parent.call(this, id);
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.ChartModel, 'MODEL_KIND', 'niChart');
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ChartModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    var isHistoryBuffer = function (value) {
        return typeof value === 'object' && value.valueType === 'HistoryBuffer';
    };
    var clearHistoryIfNewWaveformIsEarlier = function (historyBuffer, arrValue) {
        var newWaveformStartsBeforeOldWaveformEnds = function (oldWaveform, newWaveform) {
            var oldTimestamp = new window.NITimestamp(oldWaveform.t0);
            var newTimestamp = new window.NITimestamp(newWaveform.t0);
            if (newTimestamp.compare(oldTimestamp.add(oldWaveform.dt * (oldWaveform.Y.length - 1))) <= 0) {
                return true;
            }
            return false;
        };
        var lastIndex, i;
        if (historyBuffer.width === 1 && !Array.isArray(arrValue)) {
            if (historyBuffer.hb.buffer.size > 0) {
                lastIndex = historyBuffer.hb.buffer.size - 1;
                if (newWaveformStartsBeforeOldWaveformEnds(historyBuffer.hb.buffer.data[lastIndex], arrValue)) {
                    historyBuffer.clear();
                }
            }
        }
        else {
            if (Array.isArray(arrValue) && arrValue.length === historyBuffer.width) {
                var clearChart = false;
                if (historyBuffer.hb.buffers.length > 0 && historyBuffer.hb.buffers[0].size > 0) {
                    for (i = 0; i < historyBuffer.width; i++) {
                        lastIndex = historyBuffer.hb.buffers[i].size - 1;
                        if (newWaveformStartsBeforeOldWaveformEnds(historyBuffer.hb.buffers[i].data[lastIndex], arrValue[i])) {
                            clearChart = true;
                            break;
                        }
                    }
                }
                for (i = 0; i < historyBuffer.width; i++) {
                    if (clearChart) {
                        historyBuffer.clear();
                    }
                }
            }
        }
    };
    var appendDataToHistoryBuffer = function (historyBuffer, arrValue) {
        if (historyBuffer.hbType === 'analogWaveform') {
            clearHistoryIfNewWaveformIsEarlier(historyBuffer, arrValue);
        }
        historyBuffer.pushTypedData(arrValue);
    };
    var transpose = function (arr) {
        var newArr = arr[0].map(function (col, i) {
            return arr.map(function (row) {
                return row[i];
            });
        });
        return newArr;
    };
    var loadHistoryBufferfromJSON = function (historyBuffer, value, niType) {
        historyBuffer.clear();
        var rank = Array.isArray(value.data[0]) ? 2 : 1, innerType = proto.getHistoryBufferInnerType(niType, rank), arrValue = EDITOR_ADAPTERS.editorToJsModel(value.data, innerType);
        if (value.size) {
            historyBuffer.setCapacity(value.size);
        }
        if (value.timingIndexes) {
            historyBuffer.indexMap =
                value.timingIndexes.map(function (time) {
                    return (new window.NITimestamp(time).toAbsoluteTime());
                });
        }
        else {
            historyBuffer.offset = undefined;
        }
        if (value.startIndex !== undefined) {
            historyBuffer.count = value.startIndex;
        }
        if (arrValue.length > 0) {
            if (Array.isArray(arrValue[0])) {
                historyBuffer.setWidth(arrValue.length);
                historyBuffer.appendArray(transpose(arrValue));
            }
            else {
                historyBuffer.setWidth(1);
                historyBuffer.appendArray(arrValue);
            }
        }
    };
    // Public Prototype Methods
    proto.getHistoryBufferInnerType = function (niType, width) {
        // Returns an NIType describing the data inside a history buffer, based on the actual niType, and number of plots.
        var subtype = niType;
        // niType can be 2D array, or 1D array, or scalar type
        if (niType.isArray()) {
            subtype = niType.getSubtype();
        }
        // history buffer stores only values for cluster type
        if (subtype.isCluster()) {
            subtype = window.NITypes.DOUBLE;
        }
        // For a chart with a single plot, history buffer will store data as a 1D array of subtype
        // For a chart with multiple plots, history buffer will store data as a 2D array of subtype
        return subtype.makeArray((width > 1) ? 2 : 1);
    };
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addModelProperty(targetPrototype, {
            propertyName: 'historySize',
            defaultValue: 1024,
            customSetter: function (oldValue, newValue) {
                this.historyBuffer.setCapacity(newValue);
                return newValue;
            }
        });
        // TODO mraj is the bufferSize computed property really needed?
        proto.addModelProperty(targetPrototype, {
            propertyName: 'bufferSize',
            computedProp: true,
            customGetter: function () {
                return this.historySize;
            },
            customSetter: function (oldValue, newValue) {
                this.historySize = newValue;
            }
        });
        proto.addModelProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: undefined,
            customSetter: function (oldValue, newValue) {
                var newType;
                if (newValue instanceof NIType) {
                    newType = newValue;
                }
                else {
                    newType = new NIType(newValue);
                }
                this.historyBuffer.setNIType(newType);
                return newType;
            }
        });
        proto.addModelProperty(targetPrototype, {
            propertyName: 'value',
            computedProp: true,
            customGetter: function () {
                return undefined;
            },
            customSetter: function (oldValue, newValue) {
                if (isHistoryBuffer(newValue)) {
                    loadHistoryBufferfromJSON(this.historyBuffer, newValue, this.niType);
                }
                else if (typeof newValue === 'string') {
                    var arrValue = EDITOR_ADAPTERS.editorToJsModel(JSON.parse(newValue), this.niType);
                    appendDataToHistoryBuffer(this.historyBuffer, arrValue);
                }
                else {
                    appendDataToHistoryBuffer(this.historyBuffer, newValue);
                }
            }
        });
    });
    proto.propertyUsesNITypeProperty = function () {
        // In order to handle HistoryBuffers which are objects that include the data described by the niType
        //the information about type is took into account by this object when setting the value.
        return false;
    };
    proto.setGPropertyValue = function (gPropertyName, gPropertyValue) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                throw new Error("Property " + gPropertyName + " not supported for chart control.");
            case GPropertyNameConstants.VALUE_SIGNALING:
                throw new Error("Property " + gPropertyName + " not supported for chart control.");
            default:
                parent.prototype.setGPropertyValue.call(this, gPropertyName, gPropertyValue);
        }
    };
    proto.getGPropertyValue = function (gPropertyName) {
        switch (gPropertyName) {
            case GPropertyNameConstants.VALUE:
                throw new Error("Property " + gPropertyName + " not supported for chart control.");
            default:
                return parent.prototype.getGPropertyValue.call(this, gPropertyName);
        }
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.CartesianGraphModel));
//# sourceMappingURL=niChartModel.js.map