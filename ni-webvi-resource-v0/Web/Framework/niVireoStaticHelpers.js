"use strict";
//***************************************
// Vireo Static Helpers
// National Instruments Copyright 2014
//***************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    // None
    var loadedCallbacks = [];
    var vireoLoaded = false;
    var requireJSQueued = false;
    var queueRequireJS = function () {
        if (requireJSQueued === true) {
            return;
        }
        requireJSQueued = true;
        window.requirejs(['NationalInstruments.Vireo.Vireo'], function (Vireo) {
            var callbacksToCall = loadedCallbacks;
            loadedCallbacks = undefined;
            vireoLoaded = true;
            NationalInstruments.Vireo = NationalInstruments.Vireo || {};
            NationalInstruments.Vireo.Vireo = Vireo;
            callbacksToCall.forEach(function (callback) {
                setTimeout(callback, 0);
            });
        });
    };
    var checkVireoLoaded = function () {
        if (NationalInstruments.Vireo && typeof NationalInstruments.Vireo.Vireo === 'function') {
            vireoLoaded = true;
        }
        else if (typeof window.define === 'function' && window.define.amd) {
            queueRequireJS();
        }
        else {
            throw new Error('The Vireo object could not be loaded, make sure to include Vireo and Vireo modules');
        }
    };
    var whenVireoLoaded = function (callback) {
        if (typeof callback !== 'function') {
            throw new Error('Registering a vireoLoaded callback requires a valid function to invoke');
        }
        checkVireoLoaded();
        if (vireoLoaded === true) {
            setTimeout(callback, 0);
        }
        else {
            loadedCallbacks.push(callback);
        }
    };
    // Builds an indexed path to be used for reading a N-dimensional array in vireo's memory
    // @param path: variable name in vireo.
    // @param sizes: the length of each dimension of the array. e.g. [2, 3] <- A 2 by 3 2D-Array.
    // @param cellIndex: considering a flatten N-dimensional array, the cell index to find.
    //  e.g. path = 'myArray', sizes = [3, 4], cellIndex = 7
    //  this means that myArray is a 3 by 4 array which could be flatten to a 12 cells array.
    //  asking the 7th cell would return 'myArray.1.3' <- 2nd row, 4th column.
    var buildArrayIndex = function (sizes, cellIndex) {
        var ndimIndex = [];
        for (var i = sizes.length - 1; i >= 0; i--) {
            var index = cellIndex % sizes[i];
            cellIndex = Math.floor(cellIndex / sizes[i]);
            ndimIndex.unshift(index);
        }
        return ndimIndex.join(',');
    };
    var totalCells = function (dimensionLengths) {
        var totalCells = dimensionLengths.length === 0 ? 0 : 1;
        var i;
        for (i = 0; i < dimensionLengths.length; i++) {
            totalCells *= dimensionLengths[i];
        }
        return totalCells;
    };
    var supported = function () {
        return true;
    };
    var unsupported = function () {
        return false;
    };
    var isOptimizedArrayTypeVisitor = Object.freeze({
        visitBoolean: unsupported,
        visitInt8: supported,
        visitInt16: supported,
        visitInt32: supported,
        visitInt64: unsupported,
        visitUInt8: supported,
        visitUInt16: supported,
        visitUInt32: supported,
        visitUInt64: unsupported,
        visitSingle: supported,
        visitDouble: supported,
        visitEnum8: supported,
        visitEnum16: supported,
        visitEnum32: supported,
        visitString: unsupported,
        visitPath: unsupported,
        visitComplexSingle: unsupported,
        visitComplexDouble: unsupported,
        visitArray: unsupported,
        visitCluster: unsupported,
        visitTimestamp: unsupported,
        visitAnalogWaveform: unsupported
    });
    NationalInstruments.HtmlVI.VireoStaticHelpers = Object.freeze({
        whenVireoLoaded: whenVireoLoaded,
        buildArrayIndex: buildArrayIndex,
        totalCells: totalCells,
        isOptimizedArrayTypeVisitor: isOptimizedArrayTypeVisitor
    });
}());
//# sourceMappingURL=niVireoStaticHelpers.js.map