
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/');
    }
}

const isManager = async (req, res, next) => {
    try {
        if (req.session.user && ['manager', 'admin'].includes(req.session.user.role.toLowerCase())) {
            return next();
        } else {
            return res.render('403');
            // return res.status(403).send('Unauthorized');
        }
    } catch (error) {
        console.error('Error in isManager middleware:', error);
        return res.status(500).send('Internal Server Error');
    }
};

function addCommonData(req, res, next) {
    if (req.session.user && req.session.user.role) {

        const currentPath = req.path;

        if (req.session.user.fullName) {
            const fullName = req.session.user.fullName;
            res.locals.userFullName = fullName;
        } else {
            res.locals.userFullName = '';
        }

        const isAdminOrManager = req.session.user.role.toLowerCase() === 'admin' || req.session.user.role.toLowerCase() === 'manager';
        res.locals.isAdminOrManager = isAdminOrManager;

        res.locals.currentPath = currentPath;
    } else {
        res.locals.isAdminOrManager = false;
        res.locals.currentPath = '';
    }
    next();
}


module.exports = { isAuthenticated, addCommonData, isManager };