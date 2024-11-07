const admin = require("../config/firebase");

const sendNotificationToFCM = async (token, title, message) => {
    const payload = {
        notification: {
            title: title,
            body: message,
        },
    };

    try {
        const response = await admin.messaging().sendToDevice(token, payload);
        console.log("Notifikasi berhasil dikirim:", response);
        return { success: true };
    } catch (error) {
        console.error("Gagal mengirim notifikasi:", error);
        return { success: false, error: error };
    }
};

module.exports = { sendNotificationToFCM };