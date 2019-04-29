'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TierThreeSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierThree = mongoose.model('TierThree', TierThreeSchema, 'tierThree')

module.exports.TierThree = TierThree;
