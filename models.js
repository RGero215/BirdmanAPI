'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sort_order = (a, b) => {
    return b.updated_at - a.updated_at
}

var OrderSchema = new Schema({
    osid: {type: mongoose.Schema.Types.ObjectId, ref: 'orderSheets'},
    bat_category: String,
    model: String,
    length: Number,
    weight: Number,
    wood_type: String,
    handle_color: String,
    barrell_color: String,
    cup_noCup: Boolean,
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

var OrderSheetSchema = new Schema({
    name: {type: String, required: true},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    order: [{type: mongoose.Schema.Types.ObjectId, ref: 'orders'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})

var OrderSheet = mongoose.model('OrderSheet', OrderSheetSchema, 'orderSheets')

var TierFourSchema = new Schema({
    utid: {type: mongoose.Schema.Types.ObjectId, ref: 'team'}, // team it belongs too.
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tier_four_compasation: Number, // 2% for each team member sale 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}], // team members
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierFour = mongoose.model('TierFour', TierFourSchema, 'tierFour')

var TierThreeSchema = new Schema({
    utid: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tier_three_compensation: Number, // 4% direct sale
    tier_four_compasation: Number, // 2% for each team member sale 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierThree = mongoose.model('TierThree', TierThreeSchema, 'tierThree')

var TierTwoSchema = new Schema({
    utid: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tier_two_compensation: Number, // 7% direct sale
    tier_three_compasation: Number, // 4% for each team member sale 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierTwo = mongoose.model('TierTwo', TierTwoSchema, 'tierTwo')

var TierOneSchema = new Schema({
    utid: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tier_one_compensation: Number, // 10% direct sale
    tier_two_compasation: Number, // 7% for each team member sale 
    team: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var TierOne = mongoose.model('TierOne', TierOneSchema, 'tierOne')

var TeamSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    tier_one_members: Number,
    tier_two_members: Number,
    tier_three_members: Number,
    tier_four_members: Number,
    total_members: Number,
    tier_one_compensations: Number,
    tier_two_compensations: Number,
    tier_three_compensations: Number,
    tier_four_compensations: Number,
    total_compensations: Number,
    tier_one: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierOne'}],
    tier_two: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierTwo'}],
    tier_three: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierThree'}],
    tier_four: [{type: mongoose.Schema.Types.ObjectId, ref: 'tierFour'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var Team = mongoose.model('Team', TeamSchema, 'team')

var BatsRegisterSchema = new Schema({
    uid: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    image: { data: Buffer, contentType: String },
    videoURL: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

var BatsRegister = mongoose.model('BatsRegister', BatsRegisterSchema, 'batsRegister')

var UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true}, 
    password: {type: String, required: true},
    is_admin: {type: Boolean, default: false},
    order_sheet: [{type: mongoose.Schema.Types.ObjectId, ref: 'orderSheets'}],
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'team'},
    bats_register: [{type: mongoose.Schema.Types.ObjectId, ref: 'batsRegister'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})

UserSchema.method('update', (updates, callback) => {
    Object.assign(this, updates, {updated_at: new Date()});
    this.parent().save(callback);
})

UserSchema.pre('save', (next) => {
    // this.order_sheet.sort(sort_order);
    // this.order_sheet.order.sort(sort_order);
    console.log('Saving...')
    next();
})

var User = mongoose.model('User', UserSchema, 'users');

module.exports.User = User;
module.exports.OrderSheet = OrderSheet;
module.exports.Order = Order;
