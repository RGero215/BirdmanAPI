'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var InventorySchema = new Schema({
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
    in_stock: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})
var Inventory = mongoose.model('Inventory', InventorySchema, 'inventory')

module.exports.Inventory = Inventory;