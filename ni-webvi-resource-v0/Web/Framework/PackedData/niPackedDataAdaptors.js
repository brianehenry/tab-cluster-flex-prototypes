"use strict";
/**
 * Helper class to get a data adaptor for flattend data given the niType of the data
 */
class NIPackedDataAdaptors {
    /**
     * Gets a data adaptor for the root object in the packed data
     * @param packedData the array containing the packed data
     * @param niType The NIType of the packed data
     * @returns INIPackedDataAdaptor for the root object in the packed data
     */
    static GetDataAdaptorFromRoot(packedData, niType) {
        const buffer = new flatbuffers.ByteBuffer(packedData);
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedBooleanValue.getRootAsPackedBooleanValue(buffer), niType);
            case NITypeNames.UINT8:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedUint8Value.getRootAsPackedUint8Value(buffer), niType);
            case NITypeNames.UINT16:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedUint16Value.getRootAsPackedUint16Value(buffer), niType);
            case NITypeNames.UINT32:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedUint32Value.getRootAsPackedUint32Value(buffer), niType);
            case NITypeNames.INT8:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedInt8Value.getRootAsPackedInt8Value(buffer), niType);
            case NITypeNames.INT16:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedInt16Value.getRootAsPackedInt16Value(buffer), niType);
            case NITypeNames.INT32:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedInt32Value.getRootAsPackedInt32Value(buffer), niType);
            case NITypeNames.SINGLE:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedFloat32Value.getRootAsPackedFloat32Value(buffer), niType);
            case NITypeNames.DOUBLE:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedFloat64Value.getRootAsPackedFloat64Value(buffer), niType);
            case NITypeNames.STRING:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(NationalInstruments.PackedData.PackedStringValue.getRootAsPackedStringValue(buffer), niType);
            case NITypeNames.CLUSTER:
                return new NationalInstruments.PackedData.NIPackedClusterDataAdaptor(NationalInstruments.PackedData.PackedGenericClusterValue.getRootAsPackedCluster(buffer), niType);
            case NITypeNames.ARRAY:
                return new NationalInstruments.PackedData.NIPackedArrayDataAdaptor(NationalInstruments.PackedData.PackedArrayValue.getRootAsPackedArrayValue(buffer), niType);
        }
        return undefined;
    }
    /**
     * Gets a type specific data adaptor from a data element buffer reference
     * @param dataElement The packed data value to get a data adaptor for
     * @param niType The NIType of the data
     * @returns The data adaptor for the packed data
     */
    static GetDataAdaptorFromIndex(dataElement, niType) {
        switch (niType.getName()) {
            case NITypeNames.BOOLEAN:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedBooleanValue().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.UINT8:
                return new NationalInstruments.PackedData.IPackedValueAdaptor(new NationalInstruments.PackedData.PackedUint8Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.UINT16:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedUint16Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.UINT32:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedUint32Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.INT8:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedInt8Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.INT16:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedInt16Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.INT32:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedInt32Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.SINGLE:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedFloat32Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.DOUBLE:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedFloat64Value().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.STRING:
                return new NationalInstruments.PackedData.NIPackedValueAdaptor(new NationalInstruments.PackedData.PackedStringValue().__init(dataElement.bb, dataElement.bb_pos), niType);
            case NITypeNames.CLUSTER:
                return new NationalInstruments.PackedData.NIPackedClusterDataAdaptor(new NationalInstruments.PackedData.PackedGenericClusterValue(dataElement.bb_pos, dataElement.bb), niType);
            case NITypeNames.ARRAY:
                return new NationalInstruments.PackedData.NIPackedArrayDataAdaptor(new NationalInstruments.PackedData.PackedArrayValue().__init(dataElement.bb, dataElement.bb_pos), niType);
        }
        return undefined;
    }
}
// @ts-ignore
NationalInstruments.PackedData = NationalInstruments.PackedData || {};
NationalInstruments.PackedData.NIPackedDataAdaptors = NIPackedDataAdaptors;
//# sourceMappingURL=niPackedDataAdaptors.js.map