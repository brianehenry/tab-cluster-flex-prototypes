"use strict";
//****************************************
// TextAlignment Value Convertor
// National Instruments Copyright 2018
//****************************************
(function () {
    'use strict';
    // Static private reference aliases
    // None
    NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter = function () {
        // Private variables
    };
    var textAlignmentValueConverter = NationalInstruments.HtmlVI.ValueConverters.TextAlignmentValueConverter;
    // Public methods
    textAlignmentValueConverter.convertTextAlignmentToFlexAlignment = function (textAlignment) {
        var justifyContent = "flex-start";
        switch (textAlignment) {
            case "center":
                justifyContent = "center";
                break;
            case "right":
                justifyContent = "flex-end";
                break;
            case "left":
                justifyContent = "flex-start";
                break;
        }
        return justifyContent;
    };
    textAlignmentValueConverter.convertFlexAlignmentToTextAlignment = function (justifyContent) {
        var textAlignment = "left";
        switch (justifyContent) {
            case "center":
                textAlignment = "center";
                break;
            case "flex-end":
                textAlignment = "right";
                break;
            case "flex-start":
                textAlignment = "left";
                break;
        }
        return textAlignment;
    };
}());
//# sourceMappingURL=niTextAlignmentValueConverter.js.map