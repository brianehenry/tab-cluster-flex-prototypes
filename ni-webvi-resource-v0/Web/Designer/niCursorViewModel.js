"use strict";
//****************************************
// Cursor View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CursorViewModel = function (element, model) {
        parent.call(this, element, model);
        // Public Instance Properties
        // None
        // Private Instance Properties
        // None
    };
    // Static Public Variables
    // None
    // Static Public Functions
    // None
    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.CursorViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);
    // Static Private Variables
    // None
    // Static Private Functions
    // None
    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
        proto.addViewModelProperty(targetPrototype, { propertyName: 'label' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'targetShape' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'show' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'color' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'crosshairStyle' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showLabel' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showValue' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'snapToPlot' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'xaxis' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'yaxis' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'x' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'y' });
    });
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;
        $(this.element).on('cursorUpdated', function () {
            var newValue = { x: that.element.x, y: that.element.y };
            that.model.controlChanged(newValue);
        });
    };
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'color':
                this.element.setColor(this.model.color);
                break;
        }
        return renderBuffer;
    };
    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var style = window.getComputedStyle(this.element);
        this.model.color = style.getPropertyValue('color');
    };
    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.style.color = this.model.color;
    };
    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Cursor, NationalInstruments.HtmlVI.Models.CursorModel, 'ni-cursor');
    // Other graph parts inherit from VisualComponentViewModel but cursor wants to support font so it inherits from VisualViewModel
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));
//# sourceMappingURL=niCursorViewModel.js.map