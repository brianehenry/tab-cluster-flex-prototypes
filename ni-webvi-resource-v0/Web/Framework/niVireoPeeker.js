"use strict";
//***************************************
// Vireo Peeker
// National Instruments Copyright 2018
//***************************************
// Summary:
// Extract and parse data from vireo.
// NationalInstruments.HtmlVI.VireoPeeker.peek(vireo, viName, path)
// Reads data from vireo depending on the type of the variable represented by path
(function () {
    'use strict';
    // Static Private Reference Aliases
    var VIREO_STATIC_HELPERS = NationalInstruments.HtmlVI.VireoStaticHelpers;
    var groupByDimensionLength = function (arr, arrLength, dimensionLength) {
        var i, retArr, currArr, currArrIndex;
        if (arrLength % dimensionLength !== 0) {
            throw new Error('Cannot evenly split array into groups');
        }
        retArr = [];
        currArr = [];
        currArrIndex = 0;
        // TODO mraj should benchmark and see if difference between slice and iteration
        for (i = 0; i < arrLength; i += 1) {
            currArr[currArrIndex] = arr[i];
            currArrIndex += 1;
            // After an increment currArrIndex is equivalent to the currArray length
            if (currArrIndex === dimensionLength) {
                retArr.push(currArr);
                currArr = [];
                currArrIndex = 0;
            }
        }
        return retArr;
    };
    var convertFlatArraytoNArray = function (arr, totalCells, dimensionLengths) {
        var i;
        var rank = dimensionLengths.length;
        // TODO mraj system expects a 1d empty array for an empty array of all ranks
        // ie for a rank 3 empty array the models want [] and not [[[]]]
        if (totalCells === 0) {
            return [];
        }
        // Perform a copy of array rank 1
        // TODO mraj only do the copy for typed arrays
        var currArr;
        if (rank === 1) {
            currArr = [];
            for (i = 0; i < totalCells; i += 1) {
                currArr[i] = arr[i];
            }
            return currArr;
        }
        // Perform nd array creation for rank > 1
        // TODO mraj this is O((m-1)n) for rank m. So rank 2 is O(n) and can be improved for rank > 2
        currArr = arr;
        var currArrLength = totalCells;
        var currDimensionLength;
        for (i = rank - 1; i >= 1; i -= 1) {
            currDimensionLength = dimensionLengths[i];
            currArr = groupByDimensionLength(currArr, currArrLength, currDimensionLength);
            currArrLength = currArr.length;
        }
        return currArr;
    };
    var PeekVisitor = function () {
        this.vireo = undefined;
    };
    var proto = PeekVisitor.prototype;
    proto.visitBoolean = function (valueRef) {
        return this.vireo.eggShell.readDouble(valueRef) !== 0;
    };
    var visitNumeric = function (valueRef) {
        return this.vireo.eggShell.readDouble(valueRef);
    };
    var visitNumeric64 = function (valueRef) {
        return JSON.parse(this.vireo.eggShell.readJSON(valueRef));
    };
    proto.visitInt8 = visitNumeric;
    proto.visitInt16 = visitNumeric;
    proto.visitInt32 = visitNumeric;
    proto.visitInt64 = visitNumeric64;
    proto.visitUInt8 = visitNumeric;
    proto.visitUInt16 = visitNumeric;
    proto.visitUInt32 = visitNumeric;
    proto.visitUInt64 = visitNumeric64;
    proto.visitSingle = visitNumeric;
    proto.visitDouble = visitNumeric;
    proto.visitEnum8 = visitNumeric;
    proto.visitEnum16 = visitNumeric;
    proto.visitEnum32 = visitNumeric;
    proto.visitString = function (valueRef) {
        return this.vireo.eggShell.readString(valueRef);
    };
    proto.visitPath = function (valueRef) {
        return JSON.parse(this.vireo.eggShell.readJSON(valueRef));
    };
    var visitComplex = function (valueRef) {
        var complex = JSON.parse(this.vireo.eggShell.readJSON(valueRef));
        var niComplex = new window.NIComplex(complex.real, complex.imaginary);
        return niComplex.toString();
    };
    proto.visitComplexSingle = visitComplex;
    proto.visitComplexDouble = visitComplex;
    proto.visitArray = function (valueRef) {
        var resultArray, indexedPath, subRef, cellValue;
        var dimensions = this.vireo.eggShell.getArrayDimensions(valueRef).reverse();
        var totalCells = VIREO_STATIC_HELPERS.totalCells(dimensions);
        var i;
        var isOptimizedArray = false;
        var testCellPath, testCellValueRef;
        if (totalCells > 0) {
            testCellPath = VIREO_STATIC_HELPERS.buildArrayIndex(dimensions, 0);
            testCellValueRef = this.vireo.eggShell.findSubValueRef(valueRef, testCellPath);
            isOptimizedArray = this.vireo.eggShell.reflectOnValueRef(VIREO_STATIC_HELPERS.isOptimizedArrayTypeVisitor, testCellValueRef);
        }
        if (isOptimizedArray) {
            resultArray = this.vireo.eggShell.readTypedArray(valueRef);
        }
        else {
            resultArray = [];
            for (i = 0; i < totalCells; i++) {
                // Builds a string with the following notation: "0,0" (First column of first row in a 2D array
                indexedPath = VIREO_STATIC_HELPERS.buildArrayIndex(dimensions, i);
                subRef = this.vireo.eggShell.findSubValueRef(valueRef, indexedPath);
                cellValue = this.vireo.eggShell.reflectOnValueRef(this, subRef);
                resultArray.push(cellValue);
            }
        }
        // Transform the 1-D array into a N-D array with specified dimensions.
        return convertFlatArraytoNArray(resultArray, totalCells, dimensions);
    };
    proto.visitCluster = function (valueRef) {
        var that = this;
        var valueRefObject = that.vireo.eggShell.readValueRefObject(valueRef), value = {};
        Object.keys(valueRefObject).forEach(function (name) {
            value[name] = that.vireo.eggShell.reflectOnValueRef(that, valueRefObject[name]);
        });
        return value;
    };
    proto.visitTimestamp = function (valueRef) {
        // TODO mraj reading a timestamp as a double may result in loss of precision, see https://nitalk.jiveon.com/thread/74202
        var value = this.vireo.eggShell.readDouble(valueRef);
        return new window.NITimestamp(value).toString();
    };
    proto.visitAnalogWaveform = function (valueRef) {
        var valueRefObject = this.vireo.eggShell.readValueRefObject(valueRef);
        var timestampValue = this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['t0']);
        var timeIntervalValue = this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['dt']);
        var yValue = this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['Y']);
        return { t0: timestampValue, dt: timeIntervalValue, Y: yValue };
    };
    var peekVisitor = new PeekVisitor();
    var peekValueRef = function (vireo, valueRef) {
        peekVisitor.vireo = vireo;
        return vireo.eggShell.reflectOnValueRef(peekVisitor, valueRef);
    };
    var peek = function (vireo, viName, path) {
        var valueRef = vireo.eggShell.findValueRef(viName, path);
        return peekValueRef(vireo, valueRef);
    };
    NationalInstruments.HtmlVI.VireoPeeker = Object.freeze({
        peek: peek,
        peekValueRef: peekValueRef
    });
}());
//# sourceMappingURL=niVireoPeeker.js.map