const prisma = require('../config/prisma');
const { sendNotificationToFCM } = require('../service/fcm');

const utusPolisi = async (request, h) => {
  const { id_polisi, longitude, latitude} = request.payload;
  
  try {
    const user = await prisma.Polisi.findUnique({
      where: { id_polisi : parseInt(id_polisi) },
    });

    if (!user) {
      return h.response({ message: 'Polisi not found' }).code(404);
    }

    sendNotificationToFCM(
      user.token_user, 
      'Titik penetralan', 
      'ADA KEBAKARAN', 
      JSON.stringify({"utus":{"longitude": longitude, "latitude": latitude}}));

    return h.response(user).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }

};

const getAllPosPolisi = async (request, h) => {
  try {
    const pos = await prisma.Pos_polisi.findMany();
    return h.response(pos).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};
  
const getPosPolisiById = async (request, h) => {
  const { id } = request.params;

  try {
    const pos = await prisma.Pos_polisi.findUnique({
      where: { id_pos_polisi : parseInt(id) },
    });

    if (!pos) {
      return h.response({ message: 'Pos polisi tidak ditemukan' }).code(404);
    }

    return h.response(pos).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};

const getAllPolsek = async (request, h) => {
  try {
    const polsek = await prisma.Polsek.findMany();
    return h.response(polsek).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};
  
const getPolsekById = async (request, h) => {
  const { id } = request.params;

  try {
    const polsek = await prisma.Polsek.findUnique({
      where: { id_polsek : parseInt(id) },
    });

    if (!polsek) {
      return h.response({ message: 'Polsek tidak ditemukan' }).code(404);
    }

    return h.response(polsek).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};

module.exports = {
    utusPolisi,
    getAllPosPolisi,
    getPosPolisiById,
    getAllPolsek,
    getPolsekById,
}