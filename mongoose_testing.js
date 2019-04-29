'use strict';

var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.connect('mongodb://localhost:27017/birdman_bats', { useNewUrlParser: true });

var db = mongoose.connection;

db.on('error', (err) => {
    console.error('Connection error: ', err);
})

db.once('open', () => {
    console.log('db connection successful');

    var Schema = mongoose.Schema;
    var UserSchema = new Schema({
        first_name: String,
        last_name: String,
        email: {type: String, unique: true}, 
        password: String,
        is_admin: Boolean,
        order_sheet: [{
            order: [{
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
            }],
            created_at: {type: Date, default: Date.now},
            updated_at: {type: Date, default: Date.now}
        }],
        created_at: {type: Date, default: Date.now}
    });

    var User = mongoose.model('User', UserSchema);
    
    var ramon = new User({
        first_name: 'Ramon',
        last_name: 'Geronimo',
        email: 'rgero215@gmail.com',
        password: '12345678',
        is_admin: true,
        order_sheet: [{
            order: [{
                bat_category: 'Adult',
                model: 'BM243',
                length: 34,
                weight: 31,
                wood_type: 'Professional',
                handle_color: 'Red',
                barrell_color: 'Blue',
                cup_noCup: true,
                logo: 'White',
                nob_sticker: 'Pizza',
                engraving: 'Ramon Geronimo',
                engraving_color: 'white',
                note: 'This is my game day bat'
            }]
        }]
    });

    var userData = [
        ramon,
        {
            first_name: 'Gary',
            last_name: 'Malec',
            email: 'gary@birdmanbats.com',
            password: '12345678',
            is_admin: true,
            order_sheet: [{
                order: [{
                    bat_category: 'Adult',
                    model: 'BM318',
                    length: 33,
                    weight: 30,
                    wood_type: 'Professional',
                    handle_color: 'Natural',
                    barrell_color: 'Natural',
                    cup_noCup: true,
                    logo: 'White',
                    nob_sticker: 'Bomb',
                    engraving: 'Gary Malec',
                    engraving_color: 'Black',
                    note: 'This is my game day bat'
                }]
            }]
        },
        {
            first_name: 'Juan',
            last_name: 'Geronimo',
            email: 'juan@gmail.com',
            password: '12345678',
            is_admin: false,
            order_sheet: [{
                order: [{
                    bat_category: 'Adult',
                    model: 'BM271',
                    length: 33,
                    weight: 30,
                    wood_type: 'Professional',
                    handle_color: 'black',
                    barrell_color: 'natural',
                    cup_noCup: false,
                    logo: 'White',
                    nob_sticker: 'Birdman',
                    engraving: 'Juan Geronimo',
                    engraving_color: 'black',
                    note: 'This is my game day bat'
                }]
            }]
        },
        {
            first_name: 'Jessie',
            last_name: 'Pichardo',
            email: 'jessiepichardo@gmail.com',
            password: '12345678',
            is_admin: false,
            order_sheet: [{
                order: [{
                    bat_category: 'Adult',
                    model: 'BM161',
                    length: 30,
                    weight: 38,
                    wood_type: 'Professional',
                    handle_color: 'Pink',
                    barrell_color: 'White',
                    cup_noCup: true,
                    logo: 'White',
                    nob_sticker: 'Pizza',
                    engraving: 'Jessie Pichardo',
                    engraving_color: 'white',
                    note: 'This is my game day bat'
                }]
            }]
        }
    ]

    User.create(userData, (err, users) => {
        if(err) console.log('Save Failed. ', err);
        User.find({is_admin: true}, (err, users) => {
            users.forEach((user) => {
                console.log('Admins: ' + user.first_name + ' ' + user.last_name)
            });
            db.close(() => {
                console.log('db connection closed')
            });
        })
    })
})

