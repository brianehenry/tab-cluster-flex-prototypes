"use strict";
/**
 * Nipacked array data adaptor
 * Adaptor for generic packed arrays whose type of specificed by a provided NIType
 * Provides virtualization support and unpacking to a javascript object
 */
class NIPackedArrayDataAdaptor {
    /**
     * Creates an instance of nipacked array data adaptor.
     * @param packedData the packed data to wrap
     * @param niType The type ofthe packed data
     */
    constructor(packedData, niType) {
        this.packedData = packedData;
        this.niType = niType;
    }
    /**
     * Gets type  Gets the type of this array as an NIType
     * @returns The NIType
     */
    getType() {
        return this.niType;
    }
    /**
     * Unpacks this array into a standard JavaScript object
     * @returns the unpacked JS object
     */
    unpack() {
        // TODO: add multi-dimension support
        const result = [];
        for (let x = 0; x < this.packedData.valueLength(); ++x) {
            const dataValue = this.packedData.value(x);
            const genericCluster = new NationalInstruments.PackedData.PackedGenericClusterValue(dataValue.bb_pos, dataValue.bb);
            const cluster = new NationalInstruments.PackedData.NIPackedClusterDataAdaptor(genericCluster, this.niType.getSubtype());
            result[x] = cluster.unpack();
        }
        return result;
    }
}
// @ts-ignore
NationalInstruments.PackedData = NationalInstruments.PackedData || {};
NationalInstruments.PackedData.NIPackedArrayDataAdaptor = NIPackedArrayDataAdaptor;
//# sourceMappingURL=niPackedArrayAdaptor.js.map