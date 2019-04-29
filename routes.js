'use strict';

var express = require('express');
var router = express.Router();
var User = require('./models/users');
var OrderSheet = require('./models/order_sheets').OrderSheet;
var Order = require('./models/orders').Order;
var Team = require('./models/team').Team;
var TierOne = require('./models/tierOne').TierOne;
var TierTwo = require('./models/tierTwo').TierTwo;
var TierThree = require('./models/tierThree').TierThree;
var BatsRegister = require('./models/bats_register').BatsRegister;
var mid = require('./middleware');


router.param("uid", (req, res, next, id) => {
	User.findById(id, (err, doc) => {
		if(err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		req.user = doc;
		return next();
	});
});

router.param("osid", (req, res, next, id) => {
    OrderSheet.findById(id, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.order_sheet = doc;
        next();
    });
});

router.param("oid", function(req, res, next, id){
    Order.findById(id, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.order = doc;
        next();
    });
});

// GET /users/logout
router.get('/logout', (req, res, next) => {
    if (req.session){
        req.session.destroy(function(err){
            if(err){
                return next(err);
            } else {
                return res.redirect('/users/login');
            }
        });
    }
});

// GET /users/login
router.get('/login', mid.loggedOut, (req, res, next) => {
    console.log(req.session)
    return res.render('login', {title: 'Login', isHome: true});
});

// POST /users/login
router.post('/login', (req, res, next) => {
   if(req.body.email && req.body.password){
       User.authenticate(req.body.email, req.body.password, (error, user) => {
           if(error || !user){
               var err = new Error('Wrong email or password.');
               err.status = 401;
               return next(err);
           } else {
               if (user.is_admin) {
                    req.session.uid = user._id;
                    req.session.is_admin = user.is_admin
                    console.log('Session:', req.session)
                    return res.redirect('/users')
               } else {
                    req.session.uid = user._id;
                    req.session.is_admin = user.is_admin
                    console.log('Session:', req.session)
                    return res.redirect('/users/' + user._id)
               }
               
           }
       });
   } else {
       var err = new Error('Email and password are required.');
       err.status = 401;
       return next(err);
   }
});

// GET /users/register
router.get('/register', mid.loggedOut, (req, res, next) => {
    return res.render('login', {title: 'Login', isHome: true});
});

// POST /users/register
router.post('/register', (req, res, next) => {
    if(req.body.name && req.body.email && req.body.password && req.body.confirm_password){

        if(req.body.password !== req.body.confirm_password){
            var err = new Error('Passwords do not match.');
            err.status = 400
            return next(err);
        } else {
            if(req.body.is_admin === 'true') {
                var isTrueSet = (req.body.is_admin === 'true')
                User.create(req.body, (err, users) => {
                    if(err) return next(err);
                    res.status(201);
                    User.findOneAndUpdate({_id: req.session.uid}, {$push: {teamOne: users._id}}, function (error, success) {
                        if (error) {
                            console.log("Error", error);
                        } else {
                            console.log("Success", success);
                        }
                        return next()
                    });
                    return res.redirect('/users')
                });   
            }
            User.create(req.body, (err, users) => {
                if(err) return next(err);
                res.status(201);
                User.findOneAndUpdate({_id: req.session.uid}, {$push: {teamOne: users._id}}, function (error, success) {
                    if (error) {
                        console.log("Error", error);
                    } else {
                        console.log("Success", success);
                    }
                    return next()
                });
                return res.redirect('/users')
            });
        }

    } else {
        var err = new Error('All fields required.');
        err.status = 400
        return next(err);
    }
});

//GET /users/create
router.get('/create', mid.requiresLogin, (req, res, next) => {
    return res.render('create', {isCreate: true})
});

// GET /users
// Route to return all users
router.get('/', (req, res, next) => {
    if(!req.session.is_admin || !req.session) {
        var err = new Error('You are not authorized to view this page.');
        err.status = 403;
        return next(err);
    }

    User.find({})
            .sort({created_at: -1})
            .exec((err, users) => {
                if(err) return next(err);
                res.render('users', {users: users, is_admin: req.session.is_admin});
            });
});

// POST /users
// Route for create users
router.post('/', mid.requiresLogin, (req, res, next) => {
    User.create(req.body, (err, users) => {
        if(err) return next(err);
        res.status(201);
        res.json(users);
    });
})

// GET /users/:uid
// Route for specific user
router.get('/:uid', (req, res, next) => {
    User.findById({_id: req.user._id})
            .sort({created_at: -1})
            .exec((err, user) => {
                if(err) return next(err);
                User.find({ _id: {$in: user.teamOne} }, function (error, success) {
                    if (error) {
                        console.log("Error", error);
                    } else {
                        console.log("Success", success);
                    }
                    res.render('profile', {user: user, teamOne: success, is_admin: req.session.is_admin, is_profile: true});
                });
                
            });
})

// POST /users/:uid/register
router.post('/:uid/register', (req, res, next) => {
    if(req.body.name && req.body.email && req.body.password && req.body.confirm_password){
        console.log("Referral_Id: ", req.body.referral_id)
        if(req.body.password !== req.body.confirm_password){
            var err = new Error('Passwords do not match.');
            err.status = 400
            return next(err);
        } else {
            User.create(req.body, (err, users) => {
                if(err) return next(err);
                res.status(201);
                req.session.uid = users._id;
                User.findOneAndUpdate({_id: req.body.referral_id}, {$push: {teamOne: users._id}}, function (error, success) {
                    if (error) {
                        console.log("Error", error);
                    } else {
                        console.log("Success", success);
                    }
                    return next()
                });
                return res.redirect('/users/'+ users._id)
            });
        }

    } else {
        var err = new Error('All fields required.');
        err.status = 400
        return next(err);
    }
});

// PUT /users/:uid
// Update specific user
router.put('/:uid', (req, res, next) => {
    req.user.update(req.body, (err, result) => {
        if(err) return next(err);
        res.json(result);
    });
});

// DELETE /user/:uid
// Delete specific user
router.delete('/:uid', (req, res, next) => {
    req.user.remove((err) => {
        req.user.save((err, user) => {
            if(err) return next(err);
            res.json(user);
        })
    });
});

// GET /users/:uid/order_sheet
// GET all order_sheet
router.get('/:uid/order_sheet', mid.requiresLogin, mid.allOrderSheets, (req, res, next) => {
    if(!req.session.is_admin){
        OrderSheet.find({uid: req.session.uid})
            .sort({created_at: -1})
            .exec((err, order_sheets) => {
                if(err) return next(err);
                console.log(order_sheets)
                res.render('order_sheets', {order_sheets: order_sheets, is_order_sheets:true, user: req.user});
            });
    }
})

// GET /users/:uid/order_sheet/create
router.get('/:uid/order_sheet/create', mid.requiresLogin, (req, res, next) => {
    return res.render('create_order_sheet', {is_create_order_sheet:true, user: req.user})
})

// GET /users/:uid/order_sheet
// GET a specific order_sheet
router.get('/:uid/order_sheet/:osid', mid.requiresLogin, (req, res, next) => {
    res.json(req.order_sheet)
})

// POST /users/:uid/order_sheet
// Route for create an order_sheet
router.post('/:uid/order_sheet', mid.requiresLogin, (req, res, next) => {
    var new_order_sheet = new OrderSheet(req.body);
    new_order_sheet.uid = req.user._id;
    new_order_sheet.save((err, order_sheet) => {
        if(err) return next(err);
        res.status(201);
        User.findOneAndUpdate({_id: req.user._id}, {$push: {order_sheet: order_sheet._id}}, function (error, success) {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("Success", success);
            }
        });
        res.redirect('/users/' + req.user._id + '/order_sheet');
    })
})

// PUT /users/:uid/order_sheet/:osid
// Edit a specific order_sheet
router.put('/:uid/order_sheet/:osid', (req, res, next) => {
    req.order_sheet.update(req.body, (err, result) => {
        if(err) return next(err);
        res.json(result);
    });
});

// Delete /users/:uid/order_sheet/:osid
// Delete a specific order_sheet
router.delete('/:uid/order_sheet/:osid', (req, res, next) => {
    req.order_sheetId.remove((err) => {
        req.user.save((err, user) => {
            if(err) return next(err);
            res.json(user);
        })
    });

});

// GET /users/:uid/order_sheet/:osid/ordes
// GET all orders in an order sheet
router.get('/:uid/order_sheet/:osid/orders', mid.requiresLogin, (req, res, next) => {
    Order.find({osid: req.order_sheet._id})
            .sort({created_at: -1})
            .exec((err, orders) => {
                if(err) return next(err);
                res.render('orders', {orders: orders, is_order:true, user: req.user, order_sheet: req.order_sheet});
            });

});

// GET /users/:uid/order_sheet/:osid/orders/create
router.get('/:uid/order_sheet/:osid/orders/create', mid.requiresLogin, (req, res, next) => {
    return res.render('create_order', {is_create_order:true, user: req.user, order_sheet: req.order_sheet})
});

// POST /users/:uid/order_sheet/:osid/ordes
// POST create orders in an order sheet
router.post('/:uid/order_sheet/:osid/orders', mid.requiresLogin, (req, res, next) => {
    var new_order = new Order(req.body);
    new_order.osid = req.order_sheet._id;
    new_order.save((err, order) => {
        if(err) return next(err);
        res.status(201);
        OrderSheet.findOneAndUpdate({_id: req.order_sheet._id}, {$push: {order: order._id}}, function (error, success) {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("Success", success);
            }
        });
        
        return res.redirect('/users/'+ req.user._id + '/order_sheet/' + req.order_sheet._id + '/orders');
    })
});

// GET /users/:uid/order_sheet/:osid/ordes/:oid
// GET a specific order in an order sheet
router.get('/:uid/order_sheet/:osid/orders/:oid', mid.requiresLogin, (req, res, next) => {
    return res.render('show_order', {order: req.order})
});

// GET /users/:uid/order_sheet/:osid/ordes/:oid/update
// Use GET request to UPDATE || POST AND DELETE doesn't work
router.get('/:uid/order_sheet/:osid/orders/:oid/update', mid.requiresLogin, (req, res, next) => {
    return res.render('update_order', {order: req.order, is_create_order:true, user: req.user, order_sheet: req.order_sheet})
});

// DELETE /users/:uid/order_sheet/:osid/ordes/:oid/delete
// DELETE orders in an order sheet
router.get('/:uid/order_sheet/:osid/orders/:oid/delete', mid.requiresLogin, (req, res, next) => {
    req.order.remove((err) => {
        OrderSheet.findOneAndUpdate({_id: req.order_sheet._id}, {$pull: {order: req.order._id}}, function (error, success) {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("Success", success);
            }
        });
        return res.redirect('/users/' + req.user._id + '/order_sheet/' + req.order_sheet._id + '/orders')
    });

});

// GET /users/:uid/team
// GET all the team members
router.get('/:uid/team', (req, res, next) => {

});

// POST /users/:uid/team
// POST creates team
router.post('/:uid/team', (req, res, next) => {

});

// GET /users/:uid/team/:utid
// GET specific team member (utid = user team id)
router.get('/:uid/team/:utid', (req, res, next) => {

});

// POST /users/:uid/team/:utid
// POST creates team member (utid = user team id)
router.post('/:uid/team/:utid', (req, res, next) => {

});

// GET /users/:uid/team/tier_one
// GET all tier one members
router.get('/:uid/team/tier_one', (req, res, next) => {

});

// POST /users/:uid/team/tier_one
// POST creates tier one member
router.post('/:uid/team/tier_one', (req, res, next) => {

});

// GET /users/:uid/team/tier_one/:t1id
// GET specific tier one member (t1id = tier one id)
router.get('/:uid/team/tier_one/:t1id', (req, res, next) => {

});

// GET /users/:uid/team/tier_two
// GET all tier two members
router.get('/:uid/team/tier_two', (req, res, next) => {

});

// GET /users/:uid/team/tier_two/:t2id
// GET specific tier two member (t2id = tier two id)
router.get('/:uid/team/tier_two/:t2id', (req, res, next) => {

});

// GET /users/:uid/team/tier_three
// GET all tier three members
router.get('/:uid/team/tier_three', (req, res, next) => {

});

// GET /users/:uid/team/tier_three/:t3id
// GET specific tier three member (t2id = tier two id)
router.get('/:uid/team/tier_three/:t3id', (req, res, next) => {

});

// GET /users/:uid/team/tier_three
// GET all tier four members
router.get('/:uid/team/tier_four', (req, res, next) => {

});

// GET /users/:uid/team/tier_three/:t3id
// GET specific tier four member (t4id = tier four id)
router.get('/:uid/team/tier_four/:t4id', (req, res, next) => {

});

// GET /users/:uid/bats_register
// GET all bats register
router.get('/:uid/bats_register', (req, res, next) => {

});

// POST /users/:uid/bats_register
// POST creates bat 
router.post('/:uid/bats_register', (req, res, next) => {

});

// GET /users/:uid/bats_register
// GET specific bat (bid = bat id)
router.get('/:uid/bats_register/:bid', (req, res, next) => {

});

// PUT /users/:uid/bats_register
// PUT update bat (bid = bat id)
router.put('/:uid/bats_register/:bid', (req, res, next) => {

});

// DELETE /users/:uid/bats_register
// DELETE delete bat (bid = bat id)
router.delete('/:uid/bats_register/:bid', (req, res, next) => {

});






module.exports = router;
