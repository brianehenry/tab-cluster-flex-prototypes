"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
/* eslint-disable */
/**
 * @const
 * @namespace
 */
var NationalInstruments = NationalInstruments || {};
/**
 * @const
 * @namespace
 */
NationalInstruments.Web = NationalInstruments.Web || {};
/**
 * @const
 * @namespace
 */
NationalInstruments.Web.Interop = NationalInstruments.Web.Interop || {};
/**
 * @constructor
 */
NationalInstruments.Web.Interop.BatchItem = function () {
    /**
     * @type {flatbuffers.ByteBuffer}
     */
    this.bb = null;
    /**
     * @type {number}
     */
    this.bb_pos = 0;
};
/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {NationalInstruments.Web.Interop.BatchItem}
 */
NationalInstruments.Web.Interop.BatchItem.prototype.__init = function (i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
};
/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {NationalInstruments.Web.Interop.BatchItem=} obj
 * @returns {NationalInstruments.Web.Interop.BatchItem}
 */
NationalInstruments.Web.Interop.BatchItem.getRootAsBatchItem = function (bb, obj) {
    return (obj || new NationalInstruments.Web.Interop.BatchItem).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};
/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
NationalInstruments.Web.Interop.BatchItem.prototype.callName = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};
/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
NationalInstruments.Web.Interop.BatchItem.prototype.callJson = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};
/**
 * @param {flatbuffers.Builder} builder
 */
NationalInstruments.Web.Interop.BatchItem.startBatchItem = function (builder) {
    builder.startObject(2);
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} callNameOffset
 */
NationalInstruments.Web.Interop.BatchItem.addCallName = function (builder, callNameOffset) {
    builder.addFieldOffset(0, callNameOffset, 0);
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} callJsonOffset
 */
NationalInstruments.Web.Interop.BatchItem.addCallJson = function (builder, callJsonOffset) {
    builder.addFieldOffset(1, callJsonOffset, 0);
};
/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
NationalInstruments.Web.Interop.BatchItem.endBatchItem = function (builder) {
    var offset = builder.endObject();
    return offset;
};
/**
 * @constructor
 */
NationalInstruments.Web.Interop.Batch = function () {
    /**
     * @type {flatbuffers.ByteBuffer}
     */
    this.bb = null;
    /**
     * @type {number}
     */
    this.bb_pos = 0;
};
/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {NationalInstruments.Web.Interop.Batch}
 */
NationalInstruments.Web.Interop.Batch.prototype.__init = function (i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
};
/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {NationalInstruments.Web.Interop.Batch=} obj
 * @returns {NationalInstruments.Web.Interop.Batch}
 */
NationalInstruments.Web.Interop.Batch.getRootAsBatch = function (bb, obj) {
    return (obj || new NationalInstruments.Web.Interop.Batch).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};
/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array|null}
 */
NationalInstruments.Web.Interop.Batch.prototype.docName = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};
/**
 * @param {number} index
 * @param {NationalInstruments.Web.Interop.BatchItem=} obj
 * @returns {NationalInstruments.Web.Interop.BatchItem}
 */
NationalInstruments.Web.Interop.Batch.prototype.items = function (index, obj) {
    var offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? (obj || new NationalInstruments.Web.Interop.BatchItem).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos + offset) + index * 4), this.bb) : null;
};
/**
 * @returns {number}
 */
NationalInstruments.Web.Interop.Batch.prototype.itemsLength = function () {
    var offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? this.bb.__vector_len(this.bb_pos + offset) : 0;
};
/**
 * @param {flatbuffers.Builder} builder
 */
NationalInstruments.Web.Interop.Batch.startBatch = function (builder) {
    builder.startObject(2);
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} docNameOffset
 */
NationalInstruments.Web.Interop.Batch.addDocName = function (builder, docNameOffset) {
    builder.addFieldOffset(0, docNameOffset, 0);
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} itemsOffset
 */
NationalInstruments.Web.Interop.Batch.addItems = function (builder, itemsOffset) {
    builder.addFieldOffset(1, itemsOffset, 0);
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {Array.<flatbuffers.Offset>} data
 * @returns {flatbuffers.Offset}
 */
NationalInstruments.Web.Interop.Batch.createItemsVector = function (builder, data) {
    builder.startVector(4, data.length, 4);
    for (var i = data.length - 1; i >= 0; i--) {
        builder.addOffset(data[i]);
    }
    return builder.endVector();
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {number} numElems
 */
NationalInstruments.Web.Interop.Batch.startItemsVector = function (builder, numElems) {
    builder.startVector(4, numElems, 4);
};
/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
NationalInstruments.Web.Interop.Batch.endBatch = function (builder) {
    var offset = builder.endObject();
    return offset;
};
/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
NationalInstruments.Web.Interop.Batch.finishBatchBuffer = function (builder, offset) {
    builder.finish(offset);
};
// Exports for Node.js and RequireJS
this.NationalInstruments = NationalInstruments;
//# sourceMappingURL=Interop_generated.js.map