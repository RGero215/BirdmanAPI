'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BatsRegisterSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, 
    file: {type: Object, required: true},
    videoURL: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var BatsRegister = mongoose.model('BatsRegister', BatsRegisterSchema, 'batsRegister')

module.exports.BatsRegister = BatsRegister;
