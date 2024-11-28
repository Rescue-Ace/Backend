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
    deletePolisi,
    getAnggotaByPolsek,
    logoutUser,
    registerAdmin,
    loginAdmin,
    passwordAdmin,
    passwordDamkar,
    passwordPolisi,
    updateAdmin
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
    getPolsekById, 
    utusPolisi
} = require("../controllers/polisi-handler");

const { 
    getAllPic, 
    getPicById 
} = require("../controllers/pic-handler");

const { buttonPressed, getAllAlat, getAlatById, addAlat } = require("../controllers/button-handler");
const { 
    getAllKebakaran, 
    getKebakaranById, 
    updateKebakaran
} = require("../controllers/kebakaran-handler");

const routes = [
    {
        method: 'POST',
        path: '/user/registerDamkar',
        handler: registerDamkar
    },
    {
        method: 'POST',
        path: '/user/registerPolisi',
        handler: registerPolisi
    },
    {
        method: 'POST',
        path: '/user/loginUser',
        handler: loginUser
    },
    {
        method: 'PUT',
        path: '/Damkar/updatePassword/{id}',
        handler: passwordDamkar
    },
    {
        method: 'PUT',
        path: '/Polisi/updatePassword/{id}',
        handler: passwordPolisi
    },
    {
        method: 'POST',
        path: '/admin/registerAdmin',
        handler: registerAdmin
    },
    {
        method: 'POST',
        path: '/admin/loginAdmin',
        handler: loginAdmin
    },
    {
        method: 'PUT',
        path: '/admin/updatePassword/{id}',
        handler: passwordAdmin
    },
    {
        method: 'POST',
        path: '/user/logoutUser',
        handler: logoutUser
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
    },
    {
        method: 'GET',
        path: '/user/Anggota/{id}',
        handler: getAnggotaByPolsek
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
        handler: utusPolisi
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
        method: 'PUT',
        path: '/Kebakaran/{id}',
        handler: updateKebakaran
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
        method: 'PUT',
        path: '/admin/{id}',
        handler: updateAdmin
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
    },
    {
        method: 'GET',
        path: '/Alat',
        handler: getAllAlat
    },
    {
        method: 'GET',
        path: '/Alat/{id}',
        handler: getAlatById
    },
    {
        method: 'POST',
        path: '/Alat',
        handler: addAlat
    },
];

module.exports = routes;