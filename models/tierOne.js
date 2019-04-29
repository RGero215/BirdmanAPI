'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TierOneSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierOne = mongoose.model('TierOne', TierOneSchema, 'tierOne')

module.exports.TierOne = TierOne;
