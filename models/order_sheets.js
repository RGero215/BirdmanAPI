'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSheetSchema = new Schema({
    name: {type: String, required: true},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    order: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})

var OrderSheet = mongoose.model('OrderSheet', OrderSheetSchema, 'orderSheets')

module.exports.OrderSheet = OrderSheet;