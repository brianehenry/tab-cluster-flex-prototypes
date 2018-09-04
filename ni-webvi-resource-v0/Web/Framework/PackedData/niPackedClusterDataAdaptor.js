"use strict";
let NITypeNames = window.NITypeNames;
/**
 * Packed data adaptor for cluster types
 */
class NIPackedClusterDataAdaptor {
    /**
     * Constructor
     * @param packedData the packed data to wrap
     * @param niType the niType of the packed data
     */
    constructor(packedData, niType) {
        this.packedData = packedData;
        this.niType = niType;
    }
    /**
     * Gets the type of this cluster as an NIType
     * @returns the NIType of the cluster
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this cluster into a standard JavaScript object
     * @returns The unpacked cluster
     */
    unpack() {
        const result = {};
        const fields = this.niType.getFields();
        const subTypes = this.niType.getSubtype();
        for (let x = 0; x < fields.length; ++x) {
            const value = { value: this.getUnpackedValue(x, subTypes[x]) };
            result[fields[x]] = value.value;
        }
        return result;
    }
    /**
     * Gets the unpacked value of a field in the cluster
     * @param clusterIndex the field index of the desired element
     * @param niType the niType of the field
     * @returns the unpacked value
     */
    getUnpackedValue(clusterIndex, niType) {
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return this.packedData.getBooleanField(clusterIndex);
            case NITypeNames.UINT8:
                return this.packedData.getUint8Field(clusterIndex);
            case NITypeNames.UINT16:
                return this.packedData.getUint16Field(clusterIndex);
            case NITypeNames.UINT32:
                return this.packedData.getUint32Field(clusterIndex);
            case NITypeNames.INT8:
                return this.packedData.getInt8Field(clusterIndex);
            case NITypeNames.INT16:
                return this.packedData.getInt16Field(clusterIndex);
            case NITypeNames.INT32:
                return this.packedData.getInt32Field(clusterIndex);
            case NITypeNames.SINGLE:
                return this.packedData.getFloat32Field(clusterIndex);
            case NITypeNames.DOUBLE:
                return this.packedData.getFloat64Field(clusterIndex);
            case NITypeNames.STRING:
                return this.packedData.getStringField(clusterIndex);
            case NITypeNames.CLUSTER:
            case NITypeNames.ARRAY:
                NationalInstruments.PackedData.NIPackedDataAdaptors.GetDataAdaptorFromIndex(this.packedData.getClusterElement(clusterIndex), niType).unpack();
        }
    }
}
// @ts-ignore
NationalInstruments.PackedData = NationalInstruments.PackedData || {};
NationalInstruments.PackedData.NIPackedClusterDataAdaptor = NIPackedClusterDataAdaptor;
//# sourceMappingURL=niPackedClusterDataAdaptor.js.map