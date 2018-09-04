"use strict";
//***************************************
// Standard CSS property names used for
// control styling and customization
// National Instruments Copyright 2018
//***************************************
(function () {
    'use strict';
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI, 'CssProperties', Object.freeze({
        // All Controls
        // Text Alignment
        TEXT_ALIGN: '--ni-text-align',
        TEXT_ALIGN_AS_FLEX: '--ni-text-align-as-flex',
        // Colors
        FOREGROUND_COLOR: '--ni-foreground-color',
        BORDER_COLOR: '--ni-border-color',
        BORDER_GRADIENT: '--ni-border-gradient',
        // Boolean Controls
        TRUE_FOREGROUND_COLOR: '--ni-true-foreground-color',
        TRUE_BACKGROUND: '--ni-true-background',
        CHECK_MARK_COLOR: '--ni-check-mark-color',
        CONTENT_DISPLAY: '--ni-content-display',
        FALSE_FOREGROUND_COLOR: '--ni-false-foreground-color',
        FALSE_BACKGROUND: '--ni-false-background',
        FALSE_CONTENT_DISPLAY: '--ni-false-content-display',
        // Numerics
        FILL: '--ni-fill-background',
        // Selectors
        SELECTED_BACKGROUND: '--ni-selected-background',
        UNSELECTED_BACKGROUND: '--ni-unselected-background'
    }));
}());
//# sourceMappingURL=niCssProperties.js.map