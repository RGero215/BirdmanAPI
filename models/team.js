'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tierOne: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierOne'}],
    tierTwo: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierTwo'}],
    tierThree: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierThree'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var Team = mongoose.model('Team', TeamSchema, 'team')

module.exports.Team = Team;
