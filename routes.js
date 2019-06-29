'use strict';
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var Grid = require('gridfs-stream');

var express = require('express');
var router = express.Router();
var User = require('./models/users');
var OrderSheet = require('./models/order_sheets').OrderSheet;
var Order = require('./models/orders').Order;
var Inventory = require('./models/inventory').Inventory;
var BatsRegister = require('./models/bats_register').BatsRegister;
var mid = require('./middleware');

var mongoURI = process.env.MONGODB_URI ||'mongodb://localhost:27017/birdman_bats'
let gfs;

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});



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

router.param("filename", function(req, res, next, id){
    BatsRegister.find({file: {filename: req.params.filename}}, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.filename = doc;
        next();
    })
})

router.param("update", function(req, res, next, id){
    Inventory.findById(id, (err, doc) => {
        if(err) return next(err);
        if(!doc) {
            err = new Error("Not Found");
            err.status = 404;
            return next(err);
        }
        req.update = doc;
        next();
    })
})


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

// GET /users/register
router.get('/register', mid.loggedOut, (req, res, next) => {
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

// GET /users/:uid/register
router.get(':uid/register', mid.loggedOut, (req, res, next) => {
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
            // To Count Documents of a particular collection
            mongoose.connection.db.collection('users').count(function(err, count) {
    
                if( count == 0) {
                    console.log("No Found Records.");
                    req.body.is_admin = true
                    User.create(req.body, (err, newUser) => {
                        if(err) return next(err);
                        res.status(201);
                        req.session.uid = newUser._id; //creates a session with new user
                        console.log(req.body)
                        return res.redirect('/users/'+ newUser._id)
                    })
                }
                else {
                    console.log("Found Records : " + count);
                    // console.log(req.body)
                    User.create(req.body, (err, newUser) => {
                        if(err) return next(err);
                        res.status(201);
                        req.session.uid = newUser._id; //creates a session with new user
                        return res.redirect('/users/'+ newUser._id)
                    })
                }
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
        res.render('not_authorized')
        // return next(err);
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
            //1. check if referal_uid is empty
            if(!req.user.referral_id){
                //2. assign user who refer id to new user referral uid
                req.body.referral_id = req.user._id
                //3. Create the new user 
                User.create(req.body, (err, newUser) => {
                    if(err) return next(err);
                    res.status(201);
                    req.session.uid = newUser._id; //creates a session with new user
                    //6. Finds user who refer him using the request body referral id 
                    // and append the team with new user level one info to the user who refer him team one
                    User.findOneAndUpdate({_id: req.body.referral_id}, {$push: {teamOne: newUser._id}}, function (error, success) {
                        if (error) {
                            console.log("Error", error);
                        } else {
                            console.log("Success", success);
                        }
                        res.status(201)
                        return next()
                    });
                    return res.redirect('/users/'+ newUser._id)
                });
            } else if(req.user.referral_id) {
                //2. assign user who refer id to new user referral uid
                req.body.referral_id = req.user._id
                //3. Create the new user 
                User.create(req.body, (err, newUser) => {
                    if(err) return next(err);
                    res.status(201);
                    req.session.uid = newUser._id; //creates a session with new user
                    //6. Finds user who refer him using the request body referral id 
                    // and append the team with new user level one info to the user who refer him team one
                    User.findOneAndUpdate({_id: req.body.referral_id}, {$push: {teamOne: newUser._id}}, function (error, userOneLevelUp) {
                        if (error) {
                            console.log("Error", error);
                        } else {
                            if(userOneLevelUp.referral_id){
                                User.findOneAndUpdate({_id: userOneLevelUp.referral_id}, {$push: {teamTwo: newUser._id}}, function (error, userTwoLevelUp) {
                                    if (error) {
                                        console.log("Error", error);
                                    } else {
                                        if(userTwoLevelUp.referral_id){
                                            User.findOneAndUpdate({_id: userTwoLevelUp.referral_id}, {$push: {teamThree: newUser._id}}, function (error, userThreeLevelUp) {
                                                if (error) {
                                                    console.log("Error", error);
                                                } else {
                                                    User.findOneAndUpdate({_id: userThreeLevelUp.referral_id}, {$push: {teamFour: newUser._id}}, function (error, userFourLevelUp) {
                                                        if (error) {
                                                            console.log("Error", error);
                                                        } else {
                                                            console.log("User Four Level Up", userFourLevelUp);
                                                        }
                                                        return next()
                                                    });
                                                    console.log("User Three Level Up: ", userThreeLevelUp);
                                                }
                                                return next()
                                            });
                                        }
                                        console.log("User Two Level UP: ", userTwoLevelUp);
                                    }
                                    return next()
                                });
                            }
                            console.log("User One Level Up: ", userOneLevelUp);
                        }
                        return next()
                    });
                    return res.redirect('/users/'+ newUser._id)
                });
            }
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

// GET /users/:uid/inventory/add_to_inventory
router.get('/:uid/inventory/add_to_inventory', mid.requiresLogin, (req, res, next) => {
    return res.render('add_to_inventory', {is_add_to_inventory:true, user: req.user})
});


// GET /users/:uid/inventory
// GET Inventory
router.get('/:uid/inventory', mid.requiresLogin, (req, res, next) => {
    Inventory.find({})
            .sort({created_at: -1})
            .exec((err, items) => {
                if(err) return next(err);
                console.log(items)
                res.render('inventory', {items: items, is_inventory:true, user: req.user});
            });

});

// POST /users/:uid/inventory/add_to_inventory
router.post('/:uid/inventory', mid.requiresLogin, (req, res, next) => {
    var inventory = new Inventory(req.body);
    inventory.save((err, order) => {
        if(err) return next(err);
        res.status(201);
        console.log(order)
    })
    return res.redirect('/users/' + req.user._id + '/inventory')
});

// GET /users/:uid/inventory/:update/update
// Use GET request to UPDATE || POST AND DELETE doesn't work
router.get('/:uid/invetory/:update/update', mid.requiresLogin, (req, res, next) => {
    return res.render('update_inventory', {item: req.update, is_add_to_inventory:true, user: req.user})
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



// GET /users/:uid/tierTwo
// GET all tier two members
router.get('/:uid/tierTwo', mid.requiresLogin, (req, res, next) => {
    User.find({ _id: {$in: req.user.teamTwo} }, function (error, success) {
        if (error) {
            console.log("Error", error);
        } else {
            console.log("Success", success);
            res.render('tierTwo', {user: req.user, teamTwo: success, is_profile: true});
        }
        
    });
});

// GET /users/:uid/tierTwo
// GET all tier two members
router.get('/:uid/tierThree', mid.requiresLogin, (req, res, next) => {
    User.find({ _id: {$in: req.user.teamThree} }, function (error, success) {
        if (error) {
            console.log("Error", error);
        } else {
            console.log("Success", success);
            res.render('tierThree', {user: req.user, teamThree: success, is_profile: true});
        }
        
    });
});

// GET /users/:uid/tierTwo
// GET all tier two members
router.get('/:uid/tierFour', mid.requiresLogin, (req, res, next) => {
    User.find({ _id: {$in: req.user.teamFour} }, function (error, success) {
        if (error) {
            console.log("Error", error);
        } else {
            console.log("Success", success);
            res.render('tierFour', {user: req.user, teamFour: success, is_profile: true});
        }
        
    });
});



// GET /users/:uid/bats_register
// GET all bats register
router.get('/:uid/bats_register', (req, res, next) => {
    var isImage;
    gfs.files.find().toArray((err, files) => {
        // check if files
        if(!files || files.length === 0) {
            res.render('bat_register', {files: false});
        } else {
            files.map(file => {
                if(file.contentType === 'image/jpeg' || file.contentType === 'image/png'){
                    file.isImage = true;
                    isImage = true;
                } else {
                    file.isImage = false;
                    isImage = false;
                }
            })
            BatsRegister.find({uid: req.user._id}, (err, bats) => {
                if(err) return next(err);
                res.status(201)
                console.log('Bats', bats)
                return res.render('bat_register', {files: files, bats: bats, isImage: isImage})
            })
            
        }
       
    });
    
});

// POST /users/:uid/bats_register
// POST creates bat 
router.post('/:uid/bats_register', mid.requiresLogin, mid.upload.single('file'), (req, res, next) => {
    
    var new_bat_register = new BatsRegister({file: req.file});
    new_bat_register.uid = req.user._id;
    new_bat_register.save((err, bat_register) => {
        if(err) return next(err);
        res.status(201);
        User.findOneAndUpdate({_id: req.user._id}, {$push: {bats_register: bat_register._id}}, function (error, success) {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("Success", success);
            }
        });
        res.redirect('/users/' + req.user._id + '/bats_register');
    })
});

// GET /users/:uid/all_bats
// Display all files
router.get('/:uid/all_bats', (req, res, next) => {
    gfs.files.find().toArray((err, files) => {
        // check if files
        if(!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            })
        }
        return res.json(files)
    });
});

// GET /users/:uid/all_bats/:filename
// Display single file
router.get('/:uid/all_bats/:filename', (req, res, next) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        return res.json(file);
    })
});

// GET /users/:uid/image/:filename
router.get('/:uid/image/:filename', mid.requiresLogin, (req, res, next) => {
    gfs.files.findOne({filename: req.params.filename}, (err, file) => {
        if(!file || file.length === 0) {
            return res.status(404).json({
                err: 'No file exists'
            })
        }
        if(file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
            var readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res); 
        } else {
            res.status(404).json({
                err: 'Not an image'
            })
        }
    })
});

// GET /users/:uid/bats_register/:filename/delete
// Delete bat
router.get('/:uid/bats_register/:filename/delete', mid.requiresLogin,(req, res, next) => {
    
    gfs.remove({_id: req.params.filename, root: 'uploads'}, (err, gridStore) => {
        if(err){
            return res.status(404).json({err:err});
        }
       
        User.findOneAndUpdate({_id: req.user._id}, {$pull: {bats_register: req.params.filename}}, function (error, success) {
            if (error) {
                console.log("Error", error);
            } else {
                console.log("Success", success);
                
            }
        });


     
       
        res.redirect('/users/' + req.user._id + '/bats_register')
    })
})

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
