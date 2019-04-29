'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TierTwoSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}, 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierTwo = mongoose.model('TierTwo', TierTwoSchema, 'tierTwo')

module.exports.TierTwo = TierTwo;
