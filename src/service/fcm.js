const admin = require("../config/firebase");

const sendNotificationToFCM = async (token, title, message, data) => {
    const payload = {
        token: token ,
        notification: {
            title: title ,
            body: message ,
        },
        data: { data } ,
    };

    try {
        const response = await admin.messaging().send(payload);
        console.log("Notifikasi"+ title +"berhasil dikirim:", response);
        return { success: true };
    } catch (error) {
        console.error("Gagal mengirim notifikasi"+ title +":", error);
        return { success: false, error: error };
    }
};

module.exports = { sendNotificationToFCM };