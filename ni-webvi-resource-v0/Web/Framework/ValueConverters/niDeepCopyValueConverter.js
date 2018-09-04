"use strict";
(function () {
    'use strict';
    var DEEP_COPY_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.DeepCopyValueConverter = {};
    var isObject = function (value) {
        return typeof value === 'object' && value !== null;
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
        else if (isObject(value)) {
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
    DEEP_COPY_CONVERTER.deepCopy = deepCopy;
}());
//# sourceMappingURL=niDeepCopyValueConverter.js.map