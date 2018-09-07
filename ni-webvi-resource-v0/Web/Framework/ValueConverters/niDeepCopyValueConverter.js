"use strict";
(function () {
    'use strict';
    var DEEP_COPY_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.DeepCopyValueConverter = {};
    var isObjectOfNamedProperties = function (value) {
        return Array.isArray(value) === false && typeof value === 'object' && value !== null;
    };
    var deepCopy = function (value) {
        var i;
        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
            return value;
        }
        else if (value === null || value === undefined) {
            return value;
        }
        else if (Array.isArray(value)) {
            var newValue1 = [];
            for (i = 0; i < value.length; i++) {
                newValue1[i] = deepCopy(value[i]);
            }
            return newValue1;
        }
        else if (isObjectOfNamedProperties(value)) {
            var newValue2 = {}, x;
            for (x in value) {
                if (value.hasOwnProperty(x)) {
                    newValue2[x] = deepCopy(value[x]);
                }
            }
            return newValue2;
        }
        else {
            throw new Error('Unsupported type');
        }
    };
    var isDeepEqual = function (currVal, newVal) {
        var i, currentIterationEqual;
        var x, y, currValSize, newValSize;
        if (typeof currVal === 'number' || typeof currVal === 'string' || typeof currVal === 'boolean') {
            return currVal === newVal;
        }
        else if (currVal === null || currVal === undefined) {
            return currVal === newVal;
        }
        else if (Array.isArray(currVal)) {
            if (Array.isArray(newVal) === false) {
                return false;
            }
            if (currVal.length !== newVal.length) {
                return false;
            }
            for (i = 0; i < currVal.length; i++) {
                currentIterationEqual = isDeepEqual(currVal[i], newVal[i]);
                if (currentIterationEqual === false) {
                    return false;
                }
            }
            return true;
        }
        else if (isObjectOfNamedProperties(currVal)) {
            if (isObjectOfNamedProperties(newVal) === false) {
                return false;
            }
            currValSize = 0;
            for (x in currVal) {
                if (currVal.hasOwnProperty(x)) {
                    if (newVal.hasOwnProperty(x) === false) {
                        return false;
                    }
                    currentIterationEqual = isDeepEqual(currVal[x], newVal[x]);
                    if (currentIterationEqual === false) {
                        return false;
                    }
                    currValSize++;
                }
            }
            newValSize = 0;
            for (y in newVal) {
                if (newVal.hasOwnProperty(y)) {
                    newValSize++;
                }
            }
            return currValSize === newValSize;
        }
        else {
            throw new Error('Unsupported type');
        }
    };
    DEEP_COPY_CONVERTER.deepCopy = deepCopy;
    DEEP_COPY_CONVERTER.isDeepEqual = isDeepEqual;
}());
//# sourceMappingURL=niDeepCopyValueConverter.js.map