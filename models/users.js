'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var sort_order = (a, b) => {
    return b.updated_at - a.updated_at
}


var UserSchema = new Schema({
    name: {type: String, required: true, trim: true},
    email: {type: String, unique: true, required: true, trim: true}, 
    password: {type: String, required: true},
    is_admin: {type: Boolean, default: false},
    order_sheet: [{type: mongoose.Schema.Types.ObjectId, ref: 'orderSheets'}],
    teamOne: [{type: mongoose.Schema.Types.ObjectId, ref: 'teamOne'}],
    teamTwo: [{type: mongoose.Schema.Types.ObjectId, ref: 'teamTwo'}],
    teamThree: [{type: mongoose.Schema.Types.ObjectId, ref: 'teamThree'}],
    teamFour: [{type: mongoose.Schema.Types.ObjectId, ref: 'teamFour'}],
    bats_register: [{type: mongoose.Schema.Types.ObjectId, ref: 'batsRegister'}],
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
})

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({email: email})
        .exec(function(error, user){
            if(error){
                return callback(error);
            } else if (!user) {
                var err = new Error('User not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, user.password, function(error, result) {
                console.log(user)
                console.log(password === user.password)
                if(result === true){  
                    return callback(null, user);
                } else {
                    console.log("Thissss")
                    return callback();
                }
            })
        });
}

UserSchema.method('update', (updates, callback) => {
    Object.assign(this, updates, {updated_at: new Date()});
    this.parent().save(callback);
})

UserSchema.pre('save', function(next) {
    // this.order_sheet.sort(sort_order);
    // this.order_sheet.order.sort(sort_order);
    var user = this;
    bcrypt.hash(user.password, 10, function(err, hash) {
        if(err){
            console.log('this is being call...')
            return next(err);
        }
        user.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema, 'users');

module.exports = User;