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