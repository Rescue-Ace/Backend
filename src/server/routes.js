const { 
    registerDamkar, 
    loginUser, 
    registerPolisi, 
    getAllDamkar,
    getAllPolisi,
    getDamkarById,
    getPolisiById,
    putTokenDamkar,
    putTokenPolisi,
    updateDamkar,
    updatePolisi,
    deleteDamkar,
    deletePolisi
} = require("../controllers/user-handler");

const {
    reqBantuan,
    getAllPosDamkar,
    getPosDamkarById
} = require("../controllers/damkar-handler");

const { 
    getAllPosPolisi,
    getPosPolisiById,
    getAllPolsek,
    getPolsekById 
} = require("../controllers/polisi-handler");

const { 
    getAllPic, 
    getPicById 
} = require("../controllers/pic-handler");

const { buttonPressed } = require("../controllers/button-handler");
const { 
    getAllKebakaran, 
    getKebakaranById 
} = require("../controllers/kebakaran-handler");

const routes = [
    {
        method: 'POST',
        path: '/user/registerDamkar',
        handler: registerDamkar
    },
    {
        method: 'POST',
        path: '/user/loginUser',
        handler: loginUser
    },
    {
        method: 'POST',
        path: '/user/registerPolisi',
        handler: registerPolisi
    },
/*    {
        method: 'POST',
        path: '/user/loginPolisi',
        handler: loginPolisi
    },*/
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
    },
    {
        method: 'PUT',
        path: '/user/Damkar/putToken',
        handler: putTokenDamkar
    },
    {
        method: 'PUT',
        path: '/user/Polisi/putToken',
        handler: putTokenPolisi
    },
    {
        method: 'POST',
        path: '/Damkar/reqBantuan/{bantuan}',
        handler: reqBantuan
    },
    {
        method: 'GET',
        path: '/Damkar/PosDamkar',
        handler: getAllPosDamkar
    },
    {
        method: 'GET',
        path: '/Damkar/PosDamkar/{id}',
        handler: getPosDamkarById
    },
    {
        method: 'POST',
        path: '/Polisi/utusPolisi',
        handler: reqBantuan
    },
    {
        method: 'GET',
        path: '/Polisi/PosPolisi',
        handler: getAllPosPolisi
    },
    {
        method: 'GET',
        path: '/Polisi/PosPolisi/{id}',
        handler: getPosPolisiById
    },
    {
        method: 'GET',
        path: '/Polisi/Polsek',
        handler: getAllPolsek
    },
    {
        method: 'GET',
        path: '/Polisi/Polsek/{id}',
        handler: getPolsekById
    },
    {
        method: 'GET',
        path: '/PIC',
        handler: getAllPic
    },
    {
        method: 'GET',
        path: '/PIC/{id}',
        handler: getPicById
    },
    {
        method: 'GET',
        path: '/Kebakaran',
        handler: getAllKebakaran
    },
    {
        method: 'GET',
        path: '/Kebakaran/{id}',
        handler: getKebakaranById
    },
    {
        method: 'GET',
        path: '/button/{id}',
        handler: buttonPressed
    },
    {
        method: 'PUT',
        path: '/user/Damkar/{id}',
        handler: updateDamkar
    },
    {
        method: 'PUT',
        path: '/user/Polisi/{id}',
        handler: updatePolisi
    },
    {
        method: 'DELETE',
        path: '/user/Damkar/{id}',
        handler: deleteDamkar
    },
    {
        method: 'DELETE',
        path: '/user/Polisi/{id}',
        handler: deletePolisi
    },
    {
        method: 'PUT',
        path: '/user/Damkar/tokenFCM',
        handler: putTokenDamkar
    },
    {
        method: 'PUT',
        path: '/user/Polisi/tokenFCM',
        handler: putTokenPolisi
    }
];

module.exports = routes;