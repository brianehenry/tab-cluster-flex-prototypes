"use strict";
//**************************************
//Cluster Control Prototype
// DOM Registration: No
//National Instruments Copyright 2014
//**************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter;
    var DEEP_COPY_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.DeepCopyValueConverter;
    var NIType = window.NIType;
    // Static Private Functions
    var getElementValue = function (element, propertyName) {
        var value = element[propertyName], convertedValue = NI_VAL_CONVERTER.ConvertBack(element, value);
        return convertedValue;
    };
    var setElementValue = function (element, propertyName, value) {
        var convertedValue = NI_VAL_CONVERTER.Convert(element, value);
        element[propertyName] = convertedValue;
    };
    var parseInitialValue = function (attributeValue) {
        var result = {}, parsedVal;
        if (attributeValue !== null) {
            try {
                parsedVal = JSON.parse(attributeValue);
                if (typeof parsedVal === 'object' && parsedVal !== null) {
                    result = parsedVal;
                }
            }
            catch (e) {
                // If the attribute valid is invalid, we don't want to throw, just fallback to a default
            }
        }
        return result;
    };
    var createChildCache = function (cluster) {
        var controlMetaById = {};
        var labelMetaByText = {};
        var labelMetaById = {};
        var createLabelMeta = function (labelElement, controlMeta) {
            return {
                labelElement: labelElement,
                controlMeta: controlMeta
            };
        };
        var createControlMeta = function (controlElement) {
            return {
                controlElement: controlElement,
                listener: undefined
            };
        };
        var getChildByFieldName = function (fieldName) {
            var labelMeta = labelMetaByText[fieldName];
            if (labelMeta === undefined) {
                return undefined;
            }
            if (labelMeta.controlMeta === undefined) {
                return undefined;
            }
            // controlMeta.controlElement should never be undefined
            return labelMeta.controlMeta.controlElement;
        };
        // The cache is valid if all of the type field names correspond to elements and cluster values
        var checkCacheIsValid = function () {
            if (cluster._niTypeInstance === undefined) {
                return false;
            }
            var fields = cluster._niTypeInstance.getFields();
            var i, currField, currLabelMeta, currControlElement;
            for (i = 0; i < fields.length; i++) {
                currField = fields[i];
                currLabelMeta = labelMetaByText[currField];
                if (currLabelMeta === undefined || currLabelMeta.controlMeta === undefined) {
                    NI_SUPPORT.infoVerbose('Cluster (' + cluster.niControlId + ') has invalid cache: either label or control missing for field: ' + currField);
                    return false;
                }
                currControlElement = currLabelMeta.controlMeta.controlElement;
                if (currControlElement.parentElement !== cluster) {
                    NI_SUPPORT.infoVerbose('Cluster (' + cluster.niControlId + ') has invalid cache: child control (' + currControlElement.niControlId + ') not attached for field: ' + currField);
                    return false;
                }
                if (cluster._clusterValue[currField] === undefined) {
                    NI_SUPPORT.infoVerbose('Cluster (' + cluster.niControlId + ') has invalid cache: cluster value missing for field: ' + currField);
                    return false;
                }
            }
            return true;
        };
        // Assumes no listeners currently registered and registers all elements associated with a field name
        var addChildListeners = function () {
            var fields = cluster._niTypeInstance.getFields();
            var i, controlMeta;
            for (i = 0; i < fields.length; i++) {
                controlMeta = labelMetaByText[fields[i]].controlMeta;
                controlMeta.listener = cluster.childChanged.bind(cluster, controlMeta.controlElement);
                // Prevent multiple events of the same name but from different children from triggering by registering on the child element
                // TODO mraj Since we don't care which child triggered the message it may be more efficient to dedupe the listeners and place them on the cluster directly
                controlMeta.controlElement.addEventListener(controlMeta.controlElement.valuePropertyDescriptor.eventName, controlMeta.listener);
            }
        };
        // Unregisters all existing listeners. Searches entire cache as fields may have changed due to type change
        var removeChildListeners = function () {
            var currControlId, controlMeta;
            for (currControlId in controlMetaById) {
                if (controlMetaById.hasOwnProperty(currControlId)) {
                    controlMeta = controlMetaById[currControlId];
                    if (controlMeta.listener !== undefined) {
                        controlMeta.controlElement.removeEventListener(controlMeta.controlElement.valuePropertyDescriptor.eventName, controlMeta.listener);
                        controlMeta.listener = undefined;
                    }
                }
            }
        };
        var updateCacheIfNeededAndValidate = function () {
            var cacheIsValid = checkCacheIsValid();
            if (cacheIsValid) {
                return true;
            }
            removeChildListeners();
            controlMetaById = {};
            labelMetaByText = {};
            labelMetaById = {};
            var i = 0;
            var labelMeta, controlMeta, currChild;
            for (i = 0; i < cluster.childNodes.length; i++) {
                currChild = cluster.childNodes[i];
                // Ignore extraneous non element nodes
                if (currChild.labelId !== undefined) {
                    if (currChild.labelId === '') {
                        // currChild is a label
                        labelMeta = labelMetaById[currChild.niControlId];
                        if (labelMeta === undefined) {
                            labelMeta = createLabelMeta(currChild, undefined);
                            labelMetaById[currChild.niControlId] = labelMeta;
                        }
                        else {
                            labelMeta.labelElement = currChild;
                        }
                        labelMetaByText[currChild.text] = labelMeta;
                    }
                    else {
                        // currChild is a control
                        controlMeta = createControlMeta(currChild);
                        controlMetaById[currChild.niControlId] = controlMeta;
                        labelMeta = labelMetaById[currChild.labelId];
                        if (labelMeta === undefined) {
                            labelMeta = createLabelMeta(undefined, controlMeta);
                            labelMetaById[currChild.labelId] = labelMeta;
                        }
                        else {
                            labelMeta.controlMeta = controlMeta;
                        }
                    }
                }
            }
            // Since we iterate through all direct children it is possible the cache has elements not associated
            // with a field name. For validity all we care about is that the fields of the type correspond
            // to an element; extra fields are ignored in terms of validity, child event listeners, value, etc.
            cacheIsValid = checkCacheIsValid();
            if (cacheIsValid) {
                addChildListeners();
                return true;
            }
            // the cache is not valid so dump collected elements
            controlMetaById = {};
            labelMetaByText = {};
            labelMetaById = {};
            return false;
        };
        return {
            updateCacheIfNeededAndValidate: updateCacheIfNeededAndValidate,
            getChildByFieldName: getChildByFieldName
        };
    };
    class Cluster extends NationalInstruments.HtmlVI.Elements.Visual {
        // Static Private Variables
        // None
        // Public Prototype Methods
        addAllProperties(targetPrototype) {
            super.addAllProperties(targetPrototype);
            var proto = Cluster.prototype;
            Object.defineProperty(proto, 'value', {
                get: function () {
                    return this._clusterValue;
                },
                set: function (val) {
                    var oldValue = DEEP_COPY_CONVERTER.deepCopy(this._clusterValue);
                    this._clusterValue = val;
                    this.dispatchEvent(new CustomEvent('value-changed', {
                        bubbles: true,
                        cancelable: false,
                        detail: {
                            newValue: val,
                            oldValue: oldValue
                        }
                    }));
                    if (this._childValueChanging === false) {
                        this.updateChildValues();
                    }
                },
                configurable: false,
                enumerable: true
            });
            Object.defineProperty(proto, 'valueNonSignaling', {
                get: function () {
                    return this._clusterValue;
                },
                set: function (val) {
                    this._clusterValue = val;
                    if (this._childValueChanging === false) {
                        this.updateChildValues();
                    }
                },
                configurable: false,
                enumerable: false
            });
            proto.addProperty(targetPrototype, {
                propertyName: 'niType',
                defaultValue: '{"name":"Cluster","fields":[],"subtype":[]}'
            });
            NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
        }
        makeValueObj() {
            var fields = this._niTypeInstance.getFields();
            var valueObj = {};
            var i, currChild, currField;
            for (i = 0; i < fields.length; i++) {
                currField = fields[i];
                currChild = this._childCache.getChildByFieldName(currField);
                valueObj[currField] = getElementValue(currChild, currChild.valuePropertyDescriptor.propertyName);
            }
            return valueObj;
        }
        childChanged(controlElement, evt) {
            // Ignore events from controls we are not explicitly observing (ie grandchildren)
            if (controlElement !== evt.target) {
                return;
            }
            if (this._childValueChanging === false) {
                var valueObj = this.makeValueObj();
                this._childValueChanging = true;
                this.value = valueObj;
                this._childValueChanging = false;
            }
        }
        disableChildren() {
            let that = this;
            this.childNodes.forEach(function (childElement) {
                if (NI_SUPPORT.isElement(childElement)) {
                    childElement.disabled = that.disabled;
                }
            });
        }
        createdCallback() {
            super.createdCallback();
            this._childValueChanging = false;
            this._clusterValue = undefined;
            this._niTypeInstance = undefined;
            this._childCache = createChildCache(this);
            this._updateChildValuesQueued = false;
        }
        connectedCallback() {
            // Private Instance Properties
            this._clusterValue = parseInitialValue(this.getAttribute('value'));
            this._niTypeInstance = new NIType(this.niType);
            super.connectedCallback(); // Call the base implementation after having set any properties that are expected to be synced to the model.
        }
        attachedCallback() {
            var firstCall = super.attachedCallback();
            if (firstCall) {
                this._niTypeInstance = new NIType(this.niType);
                this.queueUpdateChildValues();
            }
            return firstCall;
        }
        propertyUpdated(propertyName) {
            super.propertyUpdated(propertyName);
            switch (propertyName) {
                case 'niType':
                    this._niTypeInstance = new NIType(this.niType);
                    this.queueUpdateChildValues();
                    break;
                case 'disabled':
                    this.disableChildren();
                    break;
            }
        }
        // queueUpdateChildValue on type changes and it will requeue until the childElements, type, and value settle
        queueUpdateChildValues() {
            var that = this;
            var updateSuccessful;
            if (that._updateChildValuesQueued === false) {
                updateSuccessful = that.updateChildValues();
                if (updateSuccessful) {
                    that.disableChildren();
                }
                else {
                    that._updateChildValuesQueued = true;
                    window.requestAnimationFrame(function () {
                        that._updateChildValuesQueued = false;
                        that.queueUpdateChildValues();
                    });
                }
            }
        }
        // updateChildValues on value changes as value changes are coupled with synchronous events just let them fail if state is invalid
        updateChildValues() {
            var cacheIsValid = this._childCache.updateCacheIfNeededAndValidate();
            if (cacheIsValid === false) {
                return false;
            }
            var fields = this._niTypeInstance.getFields();
            var newValue = this._clusterValue;
            var currField, currChild;
            var i = 0;
            for (i = 0; i < fields.length; i++) {
                currField = fields[i];
                currChild = this._childCache.getChildByFieldName(currField);
                this._childValueChanging = true;
                setElementValue(currChild, currChild.valuePropertyDescriptor.propertyNameNonSignaling, newValue[currField]);
                this._childValueChanging = false;
            }
            return true;
        }
    }
    NationalInstruments.HtmlVI.Elements.NIElement.defineElementInfo(Cluster.prototype, 'ni-cluster', 'HTMLNICluster');
    NationalInstruments.HtmlVI.Elements.Cluster = Cluster;
}());
//# sourceMappingURL=ni-cluster.js.map