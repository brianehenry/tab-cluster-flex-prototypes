"use strict";
//***************************************
// Vireo Poker
// National Instruments Copyright 2018
//***************************************
// Summary:
// Serialize and write data to vireo.
// NationalInstruments.HtmlVI.VireoPoker.poke(vireo, viName, path, data)
// Writes data to vireo depending on the type of the variable represented by path
(function () {
    'use strict';
    // Static Private Reference Aliases
    var VIREO_STATIC_HELPERS = NationalInstruments.HtmlVI.VireoStaticHelpers;
    var getCellValue = function (data, dimensionLengths, cellIndex) {
        var ndimIndex = [];
        var i;
        for (i = dimensionLengths.length - 1; i >= 0; i--) {
            var index = cellIndex % dimensionLengths[i];
            cellIndex = Math.floor(cellIndex / dimensionLengths[i]);
            ndimIndex.unshift(index);
        }
        var currSubset = data;
        for (i = 0; i < ndimIndex.length; i++) {
            currSubset = currSubset[ndimIndex[i]];
        }
        return currSubset;
    };
    var getDataLengths = function (rank, data) {
        var lengths = [];
        var arr = data;
        var i;
        for (i = 0; i < rank; i++) {
            if (Array.isArray(arr)) {
                lengths.push(arr.length);
                arr = arr[0];
            }
            else {
                // some elements represent empty multidimensional arrays as the data []
                // and need to represent the lengths as ie. [0, 0, 0] for an empty 3d array
                lengths.push(0);
            }
        }
        return lengths;
    };
    var PokeVisitor = function () {
        this.vireo = undefined;
    };
    var proto = PokeVisitor.prototype;
    proto.visitBoolean = function (valueRef, data) {
        this.vireo.eggShell.writeDouble(valueRef, data ? 1 : 0);
    };
    var visitNumeric = function (valueRef, data) {
        // Looks like the data-grid ends up pushing the string value "-Infinity"
        // instead of the numeric value -Infinity to the model so perform parseFloat
        // in-case a string is passed instead of a number
        var dataNum = parseFloat(data);
        this.vireo.eggShell.writeDouble(valueRef, dataNum);
    };
    var visitNumeric64 = function (valueRef, data) {
        var jsonString = JSON.stringify(data);
        this.vireo.eggShell.writeJSON(valueRef, jsonString);
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
    proto.visitString = function (valueRef, data) {
        this.vireo.eggShell.writeString(valueRef, data);
    };
    proto.visitPath = function (valueRef, data) {
        // TODO mraj workaround for writing empty paths to Vireo when using the writeJSON api
        if (data.components.length === 0) {
            data.components.push('');
        }
        var jsonString = JSON.stringify(data);
        this.vireo.eggShell.writeJSON(valueRef, jsonString);
    };
    var visitComplex = function (valueRef, data) {
        var niComplex = new window.NIComplex(data);
        var complex = JSON.stringify({ real: niComplex.realPart, imaginary: niComplex.imaginaryPart });
        this.vireo.eggShell.writeJSON(valueRef, complex);
    };
    proto.visitComplexSingle = visitComplex;
    proto.visitComplexDouble = visitComplex;
    // -------------------------------------------------------------------------------------------
    // TODO: We need to add back the optimizations for 1D array case.
    // -------------------------------------------------------------------------------------------
    proto.visitArray = function (valueRef, data) {
        var rank = this.vireo.eggShell.getArrayDimensions(valueRef).length;
        var dimensionLengths = getDataLengths(rank, data); // Computes lengths of a N-dimensional array
        var dimensionLengthsReversed = getDataLengths(rank, data).reverse();
        this.vireo.eggShell.resizeArray(valueRef, dimensionLengthsReversed); // Makes space if needed for new data
        var totalCells = VIREO_STATIC_HELPERS.totalCells(dimensionLengths);
        for (var i = 0; i < totalCells; i += 1) {
            // Builds a string with the following notation: "0,0" (First column of first row in a 2D array
            var subPath = VIREO_STATIC_HELPERS.buildArrayIndex(dimensionLengths, i);
            var subRef = this.vireo.eggShell.findSubValueRef(valueRef, subPath);
            var cellValue = getCellValue(data, dimensionLengths, i);
            // Delegate the writing to the subtype
            this.vireo.eggShell.reflectOnValueRef(this, subRef, cellValue);
        }
    };
    proto.visitCluster = function (valueRef, data) {
        var that = this;
        var valueRefObject = that.vireo.eggShell.readValueRefObject(valueRef);
        Object.keys(valueRefObject).forEach(function (name) {
            that.vireo.eggShell.reflectOnValueRef(that, valueRefObject[name], data[name]);
        });
    };
    proto.visitTimestamp = function (valueRef, data) {
        // TODO mraj reading a timestamp as a double may result in loss of precision, see https://nitalk.jiveon.com/thread/74202
        var timeStampValue = new window.NITimestamp(data).valueOf();
        this.vireo.eggShell.writeDouble(valueRef, timeStampValue);
    };
    proto.visitAnalogWaveform = function (valueRef, data) {
        var valueRefObject = this.vireo.eggShell.readValueRefObject(valueRef);
        this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['t0'], data['t0']);
        this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['dt'], data['dt']);
        this.vireo.eggShell.reflectOnValueRef(this, valueRefObject['Y'], data['Y']);
    };
    var pokeVisitor = new PokeVisitor();
    var pokeValueRef = function (vireo, valueRef, data) {
        pokeVisitor.vireo = vireo;
        return vireo.eggShell.reflectOnValueRef(pokeVisitor, valueRef, data);
    };
    var poke = function (vireo, viName, path, data) {
        var valueRef = vireo.eggShell.findValueRef(viName, path);
        return pokeValueRef(vireo, valueRef, data);
    };
    NationalInstruments.HtmlVI.VireoPoker = Object.freeze({
        poke: poke,
        pokeValueRef: pokeValueRef
    });
}());
//# sourceMappingURL=niVireoPoker.js.map