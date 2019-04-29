'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    osid: {type: mongoose.Schema.Types.ObjectId, ref: 'orderSheets'},
    bat_category: String,
    model: String,
    length: String,
    weight: String,
    wood_type: String,
    handle_color: String,
    barrel_color: String,
    cup_noCup: String,
    logo: String,
    nob_sticker: String,
    engraving: String,
    engraving_color: String,
    date: {type: Date, default: Date.now},
    note: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})
var Order = mongoose.model('Order', OrderSchema, 'orders')

module.exports.Order = Order;