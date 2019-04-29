function loggedOut(req, res, next){
    if(req.session && req.session.uid) {
        return res.redirect('/users/'+ req.session.uid);
    }
    return next();
}

function allOrderSheets(req, res, next){
    if(req.session.is_admin) {
        OrderSheet.find({})
            .sort({created_at: -1})
            .exec((err, order_sheets) => {
                if(err) return next(err);
                console.log(order_sheets)
                res.render('order_sheets', {order_sheets: order_sheets, is_order_sheets:true, user: req.user});
            });
    }
    return next();
}

function requiresLogin(req, res, next){
    if (req.session && req.session.uid){
        return next()
    } else {
        var err = new Error('You must be logged in to view this page.');
        err.status = 401;
        return next(err);
    }
}




module.exports.loggedOut = loggedOut;
module.exports.allOrderSheets = allOrderSheets;
module.exports.requiresLogin = requiresLogin;

