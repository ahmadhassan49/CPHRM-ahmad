const express = require('express');
const router = express.Router();
const { isAuthenticated, isManager, addCommonData } = require('../middleware/middleware');

const authentication = require('../controllers/auth');
const register = require('../controllers/register');
const profile = require('../controllers/profile');
const leavetable = require('../controllers/leavetable');
const createtable = require('../controllers/createleave');
const ctrlrole = require('../controllers/role');
const atten = require('../controllers/attendance');
const all_users = require('../controllers/all_users');
const leaveqoutes1 = require('../controllers/leaveqoute1');
const dashboard2 = require('../controllers/dashboard2');

router.use(addCommonData);

router.get('/', authentication.login);
router.get('/dashboard', isAuthenticated, authentication.dashboard);
router.get('/logout', isAuthenticated, authentication.logout);
router.get('/admin', isManager, isAuthenticated, profile.Userprofile);
router.get('/register', isManager, isAuthenticated, register.register_user);
router.get('/profile', isAuthenticated, profile.profile);
router.get('/basic-table', isAuthenticated, leavetable.basictable);
router.get('/createleave', isAuthenticated, createtable.createleave);
router.get('/role', isManager, isAuthenticated, ctrlrole.role);
router.get('/attendance', isAuthenticated, atten.attendance);
router.get('/alluser', isManager, isAuthenticated, all_users.alluser);
router.get('/leaveqoute',isManager, isAuthenticated,leaveqoutes1.leaveqoute);
router.get('/leaveqoute1',isManager, isAuthenticated,leaveqoutes1.leaveqoute1);
router.get('/dashboard2',isManager, isAuthenticated,dashboard2.dashboard2);


router.post('/register', isManager, isAuthenticated, register.register_user);

// router.post('/signin',authen.signin);
router.post('/add_dept',ctrlrole.adddepts);
router.post('/add_role',isAuthenticated, ctrlrole.addrole);
router.post('/admin',isAuthenticated, profile.Userprofile);
router.post('/user-profile', profile.saveUserProfile);

router.post('/', authentication.login);
module.exports = router;