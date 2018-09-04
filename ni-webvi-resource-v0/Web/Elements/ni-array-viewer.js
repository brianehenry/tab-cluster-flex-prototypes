"use strict";
//**************************************
// ArrayViewer Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//**************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter;
    var NIType = window.NIType;
    var DEEP_COPY_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.DeepCopyValueConverter;
    // Static Private Variables
    var CSS_PROPERTIES = ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'textDecoration', 'color', 'width', 'height', 'left', 'top'];
    var THEME_NAME = 'ni-rethemed'; // Override 'legacy' theme because this control was rethemed by NI in niControlStyles CSS
    // Static Private Functions
    // Gets a CSS selector for an NI visual. Note: The selector will only represent this element, it won't
    // walk up the DOM hierarchy. To get a complete selector (that can represent a control in an array in a cluster
    // in an array, for example), use getFullCssSelectorForNIVisual.
    var getCssSelectorForNIVisual = function (element, isInArrayTemplate, isLastElement) {
        var selector = element.tagName, parent = element.parentElement, i, n, curNode;
        if (parent instanceof NationalInstruments.HtmlVI.Elements.Cluster) {
            n = 1;
            for (i = 0; i < parent.childNodes.length; i++) {
                curNode = parent.childNodes[i];
                if (curNode === element) {
                    break;
                }
                else if (curNode.tagName === element.tagName) {
                    n++;
                }
            }
            selector = selector + ':nth-of-type(' + n + ')';
        }
        if (!isInArrayTemplate && element.niControlId !== undefined) {
            selector = selector + '[ni-control-id=\'' + element.niControlId + '\']';
        }
        if (element instanceof NationalInstruments.HtmlVI.Elements.ArrayViewer && isLastElement !== true) {
            if (isInArrayTemplate) {
                selector = selector + ' > div > div > div > div > table > tbody > tr > td > div.jqx-array-element';
            }
            else {
                selector = selector + ' div.jqx-array-element-' + element.childElement.id;
            }
        }
        return selector;
    };
    // Gets a full CSS selector for an NI Visual inside an array.
    // Note: The input arrayViewer should be the outermost / root one, for array-in-array
    // scenarios.
    var getFullCssSelectorForNIVisual = function (arrayViewer, targetElement) {
        var targetAndDescendants = [], curNode = targetElement;
        var selector;
        while (curNode !== arrayViewer && curNode !== null) {
            targetAndDescendants.push(curNode);
            curNode = curNode.parentElement;
        }
        if (curNode === null) {
            return null;
        }
        selector = getCssSelectorForNIVisual(arrayViewer, false, targetAndDescendants.length === 0);
        while (targetAndDescendants.length > 0) {
            curNode = targetAndDescendants.pop();
            selector = selector.concat(' > ', getCssSelectorForNIVisual(curNode, true, targetAndDescendants.length === 0));
        }
        return selector;
    };
    var setArrayValue = function (arrayViewer, val, userUpdate) {
        if (arrayViewer._settingArrayValue === true || arrayViewer._clearingArrayValue === true || arrayViewer._creatingArrayValue === true) {
            return;
        }
        arrayViewer._settingArrayValue = true;
        // When array becomes type=none, code gets triggered to set the value to null. But ni-array-viewer defaults to [] instead,
        // so we use that. The jqxArray has some issues if it has a type set but a value of null (possible because when we reinitialize
        // it, if _arrayValue=null then, we'd change the jqxArray value to null too)
        arrayViewer._arrayValue = val !== null ? val : [];
        var oldValue;
        if (userUpdate) {
            if (arrayViewer._oldArrayValue === undefined) {
                throw new Error('Expected _oldArrayValue to already be set when responding to user update to array');
            }
            oldValue = arrayViewer._oldArrayValue;
            arrayViewer._oldArrayValue = undefined;
            arrayViewer.dispatchEvent(new CustomEvent('value-changed', {
                bubbles: true,
                cancelable: false,
                detail: {
                    newValue: val,
                    oldValue: oldValue
                }
            }));
        }
        else if (arrayViewer._jqxArrayInitialized) {
            arrayViewer.jqref.jqxArray({ value: arrayViewer._arrayValue });
        }
        arrayViewer._settingArrayValue = false;
    };
    var parseInitialValue = function (attributeValue) {
        var result = [], parsedVal;
        if (attributeValue !== null) {
            try {
                parsedVal = JSON.parse(attributeValue);
                if (Array.isArray(parsedVal)) {
                    result = parsedVal;
                }
            }
            catch (e) {
                // If the attribute valid is invalid, we don't want to throw, just fallback to a default
            }
        }
        return result;
    };
    var startObserving = function (target, listenSubtree) {
        var observer = target.mutationObserver;
        if (observer !== null && observer.observe !== undefined) {
            observer.observe(target, { childList: true, attributes: false, subtree: listenSubtree });
        }
    };
    var stopObserving = function (target) {
        if (target.mutationObserver !== null) {
            if (typeof target.mutationObserver.disconnect === 'function') {
                target.mutationObserver.disconnect();
            }
        }
    };
    var computeExpectedChildren = function (niType) {
        var expectedChildren = 0;
        var subtype = niType.getSubtype();
        var subtypes = [];
        if (subtype.isVoid() === false) {
            subtypes.push(subtype);
            while (subtypes.length > 0) {
                subtype = subtypes.shift();
                if (subtype.isCluster() || subtype.isArray()) {
                    subtypes = subtypes.concat(subtype.getSubtype());
                }
                expectedChildren += 1;
            }
        }
        return expectedChildren;
    };
    var isExpectedNode = function (node) {
        return NI_SUPPORT.isElement(node) && node.niControlId !== null && node.tagName !== 'NI-LABEL';
    };
    var initializeMutationObserver = function (target) {
        var that = target;
        var expectedAddedChildren = 0, addedChildrenCount = 0, rafId = 0, i = 0, shouldClearArray = false, templateNode = null;
        that.mutationObserver = new window.MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.type === 'childList') {
                    if (m.target === that) {
                        if (m.addedNodes.length > 0 && isExpectedNode(m.addedNodes[0])) {
                            templateNode = m.addedNodes[0];
                        }
                        else if (m.removedNodes.length > 0 && NI_SUPPORT.isElement(m.removedNodes[0])) {
                            templateNode = null;
                            shouldClearArray = true;
                        }
                        target._expectedChildrenCount = computeExpectedChildren(that._niTypeInstance);
                    }
                    for (i = 0; i < m.addedNodes.length; i += 1) {
                        var addedNode = m.addedNodes[i];
                        if (isExpectedNode(addedNode)) {
                            addedChildrenCount += 1;
                        }
                    }
                    for (i = 0; i < m.removedNodes.length; i += 1) {
                        var removedNode = m.removedNodes[i];
                        if (isExpectedNode(removedNode)) {
                            addedChildrenCount -= 1;
                        }
                    }
                }
            });
            if ((that.templateControl !== templateNode || addedChildrenCount === expectedAddedChildren) && rafId === 0) {
                // Is possible that some elements are still not there, so we'll give them a little bit more time.
                rafId = window.requestAnimationFrame(function () {
                    if (shouldClearArray) {
                        // If a 'Remove Control' message and an 'Add Control' message were both batched into this same
                        // call, we should still clear the jqxArray before reinitializing it. The jqxArray has code that
                        // doesn't trigger a full refresh if the array's type is the same (e.g. 'custom' and 'custom', which
                        // is always what we set when initializing the array). So we clear it so it becomes type = 'none',
                        // and the next initialization will trigger a full refresh which is what we want.
                        that.clearArrayType(true);
                    }
                    if (templateNode !== null) {
                        that.createArray(templateNode);
                    }
                    rafId = 0;
                    shouldClearArray = false;
                });
            }
        });
    };
    class ArrayViewer extends NationalInstruments.HtmlVI.Elements.Visual {
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = ArrayViewer.prototype;
            Object.defineProperty(proto, 'value', {
                get: function () {
                    return this._arrayValue;
                },
                set: function (val) {
                    setArrayValue(this, val, true);
                },
                configurable: false,
                enumerable: true
            });
            Object.defineProperty(proto, 'valueNonSignaling', {
                get: function () {
                    return this._arrayValue;
                },
                set: function (val) {
                    setArrayValue(this, val, false);
                },
                configurable: false,
                enumerable: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'niType',
                defaultValue: '{"name":"Array","rank":1,"subtype":"Void"}'
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'dimensions',
                defaultValue: 1
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'orientation',
                defaultValue: 'horizontal'
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'indexEditorWidth',
                defaultValue: 53
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'indexVisibility',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'verticalScrollbarVisibility',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'horizontalScrollbarVisibility',
                defaultValue: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'focusedCell',
                defaultValue: ''
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'rowsAndColumns',
                defaultValue: '1,1'
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'isEmpty',
                defaultValue: false
            });
            NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
        }
        getFullCssSelectorForNIVisual(targetElement) {
            return getFullCssSelectorForNIVisual(this, targetElement);
        }
        arrayElementSizeChanged(elementSize) {
            var controls, i, niControl, cssWidth, cssHeight;
            var width = elementSize.width;
            var height = elementSize.height;
            if (width === this._elementWidth && height === this._elementHeight) {
                return;
            }
            this._elementWidth = width;
            this._elementHeight = height;
            cssWidth = width + 'px';
            cssHeight = height + 'px';
            if (this.templateControl !== null) {
                this.nodeCss[this.templateControl.niControlId].width = cssWidth;
                this.nodeCss[this.templateControl.niControlId].height = cssHeight;
            }
            this.jqref.jqxArray('resizeElement', width, height);
            controls = document.querySelectorAll(getCssSelectorForNIVisual(this, false));
            for (i = 0; i < controls.length; i++) {
                niControl = controls[i].firstElementChild;
                niControl.style.width = cssWidth;
                niControl.style.height = cssHeight;
                if (niControl.forceResize !== undefined) {
                    niControl.forceResize({
                        width: width,
                        height: height
                    });
                }
            }
        }
        createdCallback() {
            var that = this;
            super.createdCallback();
            // Public Instance Properties
            this.childElement = null;
            this.jqref = null;
            this.nodeCss = {};
            this.templateControl = null;
            this.mutationObserver = null;
            this.attributeMutationObserver = null;
            Object.defineProperty(this, 'elementSize', {
                configurable: false,
                enumerable: true,
                get: function () {
                    return { width: this._elementWidth, height: this._elementHeight };
                },
                set: function (value) {
                    that.arrayElementSizeChanged(value);
                }
            });
            this.rows = 1;
            this.columns = 1;
            // Private Instance Properties
            this._userUpdate = false;
            this._settingArrayValue = false;
            this._useAttributeMutationObserver = true;
            this._elementWidth = 0;
            this._elementHeight = 0;
            this._nodeLabelMap = [];
            this._clearingArrayValue = false;
            this._creatingArrayValue = false;
            this._settingElementValue = false;
            this._arrayValue = [];
            this._niTypeInstance = undefined;
            this._oldArrayValue = undefined; // Used for temporarily saving a copy of the array for firing change events
        }
        connectedCallback() {
            // Private Instance Properties
            this._arrayValue = parseInitialValue(this.getAttribute('value'));
            super.connectedCallback(); // Call the base implementation after having set any properties that are expected to be synced to the model.
        }
        clearArrayType(wasInitialized) {
            stopObserving(this);
            this.templateControl = null;
            this._clearingArrayValue = true;
            var clearArraySettings = {
                type: 'none',
                dimensions: this.dimensions,
                indexerWidth: this.indexEditorWidth,
                showIndexDisplay: this.indexVisibility,
                showHorizontalScrollbar: this.horizontalScrollbarVisibility,
                showVerticalScrollbar: this.verticalScrollbarVisibility,
                disabled: this.disabled,
                theme: THEME_NAME
            };
            if (wasInitialized) {
                // We'll set size separately (the editor computes it, and it'll come here via forceResize)
                this.jqref.jqxArray(clearArraySettings);
            }
            else {
                clearArraySettings.width = this.style.width;
                clearArraySettings.height = this.style.height;
                this.jqref.jqxArray(clearArraySettings);
                this.updateIndexerTheme();
            }
            this._jqxArrayInitialized = true;
            this.isEmpty = true;
            this._clearingArrayValue = false;
            startObserving(this, true);
        }
        forceResize(size) {
            super.forceResize(size);
            if (this.templateControl === null) {
                this.jqref.jqxArray({
                    width: size.width + 'px',
                    height: size.height + 'px'
                });
            }
            this.style.height = size.height + 'px';
            this.style.width = size.width + 'px';
            // Occasionally array scrollbar thumb size ends up too wide (overflowing control) after a resize,
            // so tell scrollbars to re-render.
            this.jqref.find('div.jqx-array-scrollbar-horizontal, div.jqx-array-scrollbar-vertical').jqxScrollBar('refresh');
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            if (firstCall) {
                var node = null, i;
                var that = this;
                this.parseRowsAndColumns();
                for (i = 0; i < this.childNodes.length; i++) {
                    if (this.childNodes[i].tagName !== 'NI-LABEL') {
                        node = this.childNodes[i];
                        break;
                    }
                }
                this.childElement = document.createElement('div');
                this.appendChild(this.childElement);
                this.jqref = $(this.childElement);
                this._niTypeInstance = new NIType(this.niType);
                this._expectedChildrenCount = computeExpectedChildren(this._niTypeInstance);
                initializeMutationObserver(this);
                if (node !== null) {
                    // Delay initialization until all elements are registered and attached. Even if the template
                    // element is ready, a descendant might not be (e.g. if the template is a cluster and it contains
                    // another control).
                    NationalInstruments.HtmlVI.Elements.NIElement.addNIEventListener('attached', function () {
                        that.createArray(node);
                    });
                }
                else {
                    this.clearArrayType(false);
                }
                this.jqref.on('change', function (e) {
                    if (e.target === that.childElement && (e.detail === undefined || e.detail.changeType !== 'api')) {
                        that.value = that.jqref.val();
                    }
                });
                this.jqref.on('scroll', function () {
                    var indices = that.jqref.jqxArray('getIndexerValue');
                    var eventConfig = {
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            indices: indices,
                            originalSource: this.childElement
                        }
                    };
                    that.dispatchEvent(new CustomEvent('scroll-changed', eventConfig));
                });
            }
            return firstCall;
        }
        detachedCallback() {
            super.detachedCallback();
            stopObserving(this);
            this.mutationObserver = null;
            this.templateControl = null;
        }
        updateFromTemplate(control, node, updatePosition) {
            var i, j, nodeCss;
            control.niControlId = NI_SUPPORT.uniqueId();
            control._preventModelCreation = true;
            control.visible = true;
            nodeCss = this.nodeCss[node.niControlId];
            if (nodeCss === undefined) {
                nodeCss = $(node).css(CSS_PROPERTIES);
                this.nodeCss[node.niControlId] = nodeCss;
            }
            control.style.width = nodeCss.width;
            control.style.height = nodeCss.height;
            control.style.display = '';
            if (updatePosition) {
                control.style.left = nodeCss.left;
                control.style.top = nodeCss.top;
            }
            else {
                control.style.left = '';
                control.style.top = '';
            }
            control.style.fontSize = nodeCss.fontSize;
            control.style.fontFamily = nodeCss.fontFamily;
            control.style.fontWeight = nodeCss.fontWeight;
            control.style.fontStyle = nodeCss.fontStyle;
            control.style.textDecoration = nodeCss.textDecoration;
            control.style.color = nodeCss.color;
            j = 0;
            for (i = 0; i < node.childNodes.length; i++) {
                if (NI_SUPPORT.isElement(node.childNodes[i]) && control.childNodes[j] !== undefined) {
                    this.updateFromTemplate(control.childNodes[j], node.childNodes[i], true);
                    if (node.childNodes[i].tagName === 'NI-LABEL') {
                        this._nodeLabelMap[node.childNodes[i].niControlId] = control.childNodes[j].niControlId;
                    }
                    j++;
                }
            }
        }
        updateLabelIds(node) {
            var i, label;
            if (!NI_SUPPORT.isElement(node)) {
                return null;
            }
            for (i = 0; i < node.childNodes.length; i++) {
                if (node.childNodes[i].tagName !== 'NI-LABEL') {
                    label = this._nodeLabelMap[node.childNodes[i].labelId];
                    if (label === undefined) {
                        label = '';
                    }
                    node.childNodes[i].labelId = label;
                    this.updateLabelIds(node.childNodes[i]);
                }
            }
        }
        copyNIElement(node) {
            if (!NI_SUPPORT.isElement(node) || NationalInstruments.JQXElement.isJQXElementSubPart(node)) {
                return null;
            }
            var newNode = NI_SUPPORT.cloneControlElement(node);
            // niTemplate should always be a 'real' / original niControlId (a number). This allows us to look up
            // the real / original template control from all of our copies (for array elements and nested arrays).
            newNode._niTemplateId = node._niTemplateId !== undefined ? node._niTemplateId : node.niControlId;
            if (node.childNodes.length > 0) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var childNode = this.copyNIElement(node.childNodes[i]);
                    if (childNode !== null) {
                        newNode.appendChild(childNode);
                    }
                }
            }
            return newNode;
        }
        updateTemplateCss(templateDescendant) {
            var curNodeCss = $(templateDescendant).css(CSS_PROPERTIES);
            this.nodeCss[templateDescendant.niControlId] = curNodeCss;
        }
        recreateCells(fullRefresh) {
            var r, c, cell, that = this;
            if (that.templateControl === null || that.templateControl === undefined) {
                return;
            }
            var recreateCell = function (r, c) {
                var val, cellSelector;
                cell = that.jqref.jqxArray('getElement', r, c);
                if (cell !== null && cell !== undefined) {
                    cellSelector = $(cell);
                    val = that.jqref.jqxArray('getElementValue', cellSelector, { x: c, y: r });
                    while (cell.hasChildNodes()) {
                        cell.removeChild(cell.lastChild);
                    }
                    that.jqref.jqxArray('elementTemplate', cellSelector);
                    that.jqref.jqxArray('setElementValue', val, cellSelector, { x: c, y: r });
                }
            };
            if (fullRefresh) {
                for (r = 0; r < this.rows; r++) {
                    for (c = 0; c < this.columns; c++) {
                        recreateCell(r, c);
                    }
                }
            }
            else if (this._focusedColumn !== undefined && this._focusedRow !== undefined) {
                recreateCell(this._focusedRow, this._focusedColumn);
            }
            window.requestAnimationFrame(function () {
                that.updateFocusedCell();
            });
        }
        setDefaultValue(modelValue) {
            this.jqref.jqxArray('setDefaultValue', modelValue);
        }
        createArray(node) {
            var that = this;
            stopObserving(this);
            this._creatingArrayValue = true;
            var propertyName = node.valuePropertyDescriptor.propertyName;
            var eventName = node.valuePropertyDescriptor.eventName;
            var nonSignalingPropertyName = node.valuePropertyDescriptor.propertyNameNonSignaling;
            var defaultValue = node[propertyName];
            var curNodeCss;
            node.classList.add('array-template');
            node.style.left = '0px';
            node.style.top = '0px';
            node.style.display = 'none';
            node.labelId = '';
            this.templateControl = node;
            if (defaultValue !== undefined) {
                defaultValue = NI_VAL_CONVERTER.ConvertBack(node, defaultValue);
            }
            this.nodeCss = {};
            curNodeCss = $(node).css(CSS_PROPERTIES);
            this.nodeCss[node.niControlId] = curNodeCss;
            this._elementWidth = parseInt(curNodeCss.width);
            this._elementHeight = parseInt(curNodeCss.height);
            this.jqref.jqxArray({
                elementWidth: this._elementWidth,
                elementHeight: this._elementHeight,
                elementTemplate: function (div) {
                    that._nodeLabelMap = [];
                    var control = that.copyNIElement(node);
                    $(control).removeClass('array-template');
                    var divElement = div[0];
                    var curNodeCss = that.nodeCss[node.niControlId];
                    that.updateFromTemplate(control, node, false);
                    that.updateLabelIds(control);
                    control.disabled = that.disabled;
                    divElement.style.width = curNodeCss.width;
                    divElement.style.height = curNodeCss.height;
                    divElement.appendChild(control);
                    if (control.forceResize !== undefined) {
                        control.connectedCallback(); // Force internal DOM to be initialized, since the resize code often assumes its already there
                        control.forceResize({
                            width: that._elementWidth,
                            height: that._elementHeight
                        });
                    }
                    // Safeguard for when controls fire value change events when the value has actually not changed
                    // Known example is at edit time placing a horizontal slider in an array and changing the min value above default
                    var areDifferent = function (div) {
                        var data = $(div).data();
                        var x = data.col;
                        var y = data.row;
                        // Try to match the code path that jqxarray takes for checking value changes as closely as possible
                        var oldValue = that.jqref.jqxArray('_getValueInCell', y, x);
                        var newValue = that.jqref.jqxArray('_getElementValue', div, { x, y }, true);
                        var result = that.jqref.jqxArray('_areDifferent', newValue, oldValue);
                        return result;
                    };
                    $(control).on(eventName, function (event) {
                        if (!that._settingElementValue && event.detail !== undefined && event.detail.changeType !== 'api') {
                            // Some controls fire with an eventName of change. This can trigger the internal
                            // jqxArray change event even if it is ignore here. Since the ni-array-viewer event
                            // handler is registered first it can capture those events and stopPropagation.
                            if (event.originalEvent.target !== control) {
                                event.stopPropagation();
                                return;
                            }
                            if (!div.supressChange) {
                                if (that._oldArrayValue !== undefined) {
                                    throw new Error('Expected _oldArrayValue to be undefined when starting a user change of the array');
                                }
                                if (that._settingArrayValue === false && that._clearingArrayValue === false && that._creatingArrayValue === false && areDifferent(div)) {
                                    that._oldArrayValue = DEEP_COPY_CONVERTER.deepCopy(that._arrayValue);
                                }
                                div.trigger('change');
                            }
                        }
                    });
                },
                changeProperty: function (property, value, widgets) {
                    if (property === 'width') {
                        widgets.css({ width: value });
                    }
                    else if (property === 'height') {
                        widgets.css({ height: value });
                    }
                    else if (property === 'disabled') {
                        widgets.css({ disabled: value });
                    }
                },
                getElementValue: function (div, dimensions) {
                    var element = div[0].firstElementChild;
                    var val = element[propertyName];
                    if (val !== undefined) {
                        try {
                            return NI_VAL_CONVERTER.ConvertBack(element, val);
                        }
                        catch (e) {
                            // Array can be in an intermediate bad state as we're changing the type of a template numeric control
                            return val;
                        }
                    }
                    return val;
                },
                setElementValue: function (value, div, dimensions) {
                    if (value !== undefined) {
                        var element = div[0].firstElementChild;
                        try {
                            that._settingElementValue = true;
                            element[nonSignalingPropertyName] = NI_VAL_CONVERTER.Convert(element, value);
                            that._settingElementValue = false;
                        }
                        catch (e) {
                            // Array can be in an intermediate bad state as we're changing the type of a template numeric control
                        }
                    }
                },
                type: 'custom',
                dimensions: this.dimensions,
                indexerWidth: this.indexEditorWidth,
                showIndexDisplay: this.indexVisibility,
                customWidgetDefaultValue: defaultValue,
                showHorizontalScrollbar: this.horizontalScrollbarVisibility,
                showVerticalScrollbar: this.verticalScrollbarVisibility,
                disabled: this.disabled,
                theme: THEME_NAME,
                value: that._arrayValue
            });
            this._jqxArrayInitialized = true;
            // jqxArray hard codes a border of 2 pixels (1px left + 1px right)
            // internally in the _tdBorder calculation.
            // Because we remove element borders this causes the width to be too large
            // By subtracting the two pixel border the jqxArray instanced div fits inside the ni-array-viewer element
            $.data(this.childElement).jqxArray.instance._tdBorder -= 2;
            // TODO : We'd like to be able to send rows and columns in the same
            // jqxArray statement as above. However, this causes issues when you have
            // an initialized array (with > 1 rows or columns), delete the array element,
            // then undo (there's extra cells rendered that shouldn't be there).
            this.jqref.jqxArray({
                rows: this.rows,
                columns: this.columns
            });
            this.jqref.jqxArray({
                showHorizontalScrollbar: this.horizontalScrollbarVisibility,
                showVerticalScrollbar: this.verticalScrollbarVisibility
            });
            this.isEmpty = false;
            // Adding CSS class names
            this.jqref.addClass('ni-array-viewer-box');
            this.jqref.find(' .jqx-array-indexer').addClass('ni-indexer-box');
            this.jqref.find(' .jqx-input-content').addClass('ni-text-field');
            this.jqref.find(' .jqx-input.jqx-rc-r').addClass('ni-spins-box');
            this.jqref.find(' .jqx-action-button').addClass('ni-spin-button');
            this.jqref.find(' .jqx-icon-arrow-up').addClass('ni-increment-icon');
            this.jqref.find(' .jqx-icon-arrow-down').addClass('ni-decrement-icon');
            this.updateIndexerTheme();
            this.updateScrollbarTheme();
            this.updateFocusedCell();
            this._creatingArrayValue = false;
            startObserving(this, false);
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'dimensions':
                    if (this._jqxArrayInitialized) {
                        var settings = { dimensions: this.dimensions };
                        // When changing dimensions we need to re-push rows and cols (this was a fix for DE9104 - Array shows different
                        // # cells than adorners, when changing Dimensions from 1 -> 2 -> 1). Setting rows/ cols only makes sense for
                        // a non-empty array, however.
                        if (this.templateControl !== null) {
                            settings.rows = this.rows;
                            settings.columns = this.columns;
                        }
                        this.jqref.jqxArray(settings);
                        this.updateIndexerFont();
                        this.updateIndexerTheme();
                    }
                    break;
                case 'indexEditorWidth':
                    this.jqref.jqxArray({ indexerWidth: this.indexEditorWidth });
                    break;
                case 'indexVisibility':
                    this.jqref.jqxArray({ showIndexDisplay: this.indexVisibility });
                    break;
                case 'verticalScrollbarVisibility':
                    this.jqref.jqxArray({ showVerticalScrollbar: this.verticalScrollbarVisibility });
                    this.updateScrollbarTheme();
                    break;
                case 'horizontalScrollbarVisibility':
                    this.jqref.jqxArray({ showHorizontalScrollbar: this.horizontalScrollbarVisibility });
                    this.updateScrollbarTheme();
                    break;
                case 'focusedCell':
                    this.updateFocusedCell();
                    break;
                case 'rowsAndColumns':
                    this.updateRowsAndColumns();
                    break;
                case 'niType':
                    this._niTypeInstance = new NIType(this.niType);
                    this._expectedChildrenCount = computeExpectedChildren(this._niTypeInstance);
                    break;
                case 'disabled':
                    this.jqref.jqxArray({ disabled: this.disabled });
                    this.setDisabledOnChildElements(this.disabled);
                    this.setDisabledOnScrollBars(this.disabled);
                    break;
                default:
                    break;
            }
        }
        setDisabledOnChildElements(isDisabled) {
            var childElementSelector = this.getFullCssSelectorForNIVisual(this.templateControl);
            var childElements = document.querySelectorAll(childElementSelector);
            this.templateControl.disabled = this.disabled;
            childElements.forEach(childElement => {
                childElement.disabled = isDisabled;
            });
        }
        setDisabledOnScrollBars(isDisabled) {
            var elementsToDisable = this.querySelectorAll(' div.jqx-scrollbar');
            elementsToDisable.forEach(childElement => {
                $(childElement).jqxScrollBar({ disabled: isDisabled });
            });
        }
        updateFocusedCell() {
            var indices, i, curCell, matches, templateMatch, r, c;
            if (this.templateControl === null) {
                return;
            }
            if (typeof this.focusedCell === 'string' && this.focusedCell.length > 0) {
                indices = this.focusedCell.split(',');
                if (indices.length === 2) {
                    r = parseInt(indices[0]);
                    c = parseInt(indices[1]);
                    this._focusedRow = r;
                    this._focusedColumn = c;
                    curCell = this.jqref.jqxArray('getElement', r, c);
                    if (curCell === undefined || curCell === null) {
                        // We can get a focused cell index from C# that hasn't yet been created. In this case, we'll do the code below later
                        // (updateRowsAndColumns also triggers this)
                        return;
                    }
                    matches = curCell.querySelectorAll('[ni-control-id]');
                    for (i = 0; i < matches.length; i++) {
                        if (matches[i]._niTemplateId !== undefined) {
                            templateMatch = document.querySelector('[ni-control-id=\'' + matches[i]._niTemplateId + '\']');
                            if (templateMatch !== null) {
                                templateMatch._niFocusedCloneId = matches[i].niControlId;
                            }
                        }
                    }
                    return;
                }
            }
            this._focusedRow = undefined;
            this._focusedColumn = undefined;
            matches = Array.prototype.slice.call(this.templateControl.querySelectorAll('[ni-control-id]'));
            matches.push(this.templateControl);
            for (i = 0; i < matches.length; i++) {
                matches[i]._niFocusedCloneId = undefined;
            }
        }
        parseRowsAndColumns() {
            var indices;
            if (typeof this.rowsAndColumns === 'string' && this.rowsAndColumns.length > 0) {
                indices = this.rowsAndColumns.split(',');
                if (indices.length === 2) {
                    this.rows = parseInt(indices[0]);
                    this.columns = parseInt(indices[1]);
                }
            }
        }
        updateRowsAndColumns() {
            var oldRows, oldColumns;
            this.parseRowsAndColumns();
            // We can get a rows and columns update when we don't have an array element (if you undo the delete of an array element, there'll be separate
            // messages: first to put back the old rows and columns value, then to put back the array element. So don't update the jqxArray if we don't
            // have an array element (createArray will also set rows and columns).
            if (this.templateControl === null) {
                return;
            }
            oldRows = this.jqref.jqxArray('rows');
            oldColumns = this.jqref.jqxArray('columns');
            if (this.rows !== oldRows || this.columns !== oldColumns) {
                if (this.jqref.val() === null) {
                    // Nested arrays can end up with a null value, triggering an error in the jqxArray when you resize that nested array.
                    // TODO : Track down why this happens
                    this.jqref.jqxArray({ value: [] });
                }
                this.jqref.jqxArray({ rows: this.rows, columns: this.columns });
            }
            var bigContainer = this.jqref.find(' .jqx-array-big-container');
            var padding = parseInt(bigContainer.last().css('padding'));
            var height = parseInt(bigContainer[0].style.height) + 2 * padding;
            var width = parseInt(bigContainer[0].style.width) + 2 * padding;
            var eventConfig = {
                bubbles: true,
                cancelable: true,
                detail: {
                    height: height,
                    width: width,
                    originalSource: this.childElement
                }
            };
            this.dispatchEvent(new CustomEvent('array-size-changed', eventConfig));
            this.updateFocusedCell();
        }
        setFont(fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
            super.setFont(fontSize, fontFamily, fontWeight, fontStyle, textDecoration);
            var jqrefIndexer = this.jqref.find(' .jqx-array-indexer'), fontProperties = {
                'font-size': fontSize,
                'font-family': fontFamily,
                'font-weight': fontWeight,
                'font-style': fontStyle
            };
            $(jqrefIndexer).css(fontProperties);
            this.jqref.trigger('refresh');
        }
        updateIndexerFont() {
            var jqrefIndexer = this.jqref.find(' .jqx-array-indexer').last();
            var fontProperties = $(jqrefIndexer).css(['font-size', 'font-family', 'font-weight', 'font-style']);
            jqrefIndexer = this.jqref.find(' .jqx-array-indexer');
            $(jqrefIndexer).css(fontProperties);
        }
        updateIndexerTheme() {
            this.jqref.find('.jqx-array-indexer').jqxNumberInput({ theme: THEME_NAME });
        }
        updateScrollbarTheme() {
            var i;
            var scrollBars = this.jqref.find('div.jqx-array-scrollbar-horizontal, div.jqx-array-scrollbar-vertical');
            for (i = 0; i < scrollBars.length; i++) {
                var curScrollBarRef = $(scrollBars[i]);
                // Note: If the properties return undefined, the scrollbar is not yet initialized. Trying to
                // change touchMode before initialization causes it to render incorrectly.
                var curTouchMode = curScrollBarRef.jqxScrollBar('touchMode');
                if (curTouchMode !== undefined && curTouchMode !== false) {
                    curScrollBarRef.jqxScrollBar({
                        touchMode: false // the default touchMode = 'auto' hides the scrollbar arrow buttons which causes issues with our CSS
                    });
                }
            }
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(ArrayViewer.prototype, 'ni-array-viewer', 'HTMLNIArrayViewer');
    NationalInstruments.HtmlVI.Elements.ArrayViewer = ArrayViewer;
}());
//# sourceMappingURL=ni-array-viewer.js.map