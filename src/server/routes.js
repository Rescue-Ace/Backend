/*
const {
    laporanTombol,
} = require('../controllers/button-handler');
const {
    Handler,
} = require('../controllers/damkar-handler');
const {
    Handler,
} = require('../controllers/kebakaran-handler');
const {
    Handler,
} = require('../controllers/pic-handler');
const {
    Handler,
} = require('../controllers/polisi-handler');
const {
    registerUser,
    loginUser,
    logoutUser,
    resetPassword
} = require('../controllers/user-handler');

const router = [
    
    {
        method: 'POST',
        path: '/user/register',
        handler: registerUser
    },
    {
        method: 'POST',
        path: '/user/login',
        handler: loginUser
    },
    {
        method: 'POST',
        path: '/user/logout',
        handler: logoutUser
    },
    {
        method: 'POST',
        path: '/user/reset-password',
        handler: resetPassword
    }
];
*/

const { 
    registerDamkar, 
    loginDamkar, 
    registerPolisi, 
    loginPolisi, 
    getAllDamkar,
    getAllPolisi,
    getDamkarById,
    getPolisiById
} = require("../controllers/user-handler");

const routes = [
    {
        method: 'POST',
        path: '/user/registerDamkar',
        handler: registerDamkar
    },
    {
        method: 'POST',
        path: '/user/loginDamkar',
        handler: loginDamkar
    },
    {
        method: 'POST',
        path: '/user/registerPolisi',
        handler: registerPolisi
    },
    {
        method: 'POST',
        path: '/user/loginPolisi',
        handler: loginPolisi
    },
    {
        method: 'GET',
        path: '/user/Damkar',
        handler: getAllDamkar
    },
    {
        method: 'GET',
        path: '/user/Polisi',
        handler: getAllPolisi
    },
    {
        method: 'GET',
        path: '/user/Damkar/{id}',
        handler: getDamkarById
    },
    {
        method: 'GET',
        path: '/user/Polisi/{id}',
        handler: getPolisiById
    }
];

module.exports = routes;