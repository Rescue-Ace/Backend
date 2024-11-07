const prisma = require('../config/prisma');

const getAllPic = async (request, h) => {
  try {
    const pics = await prisma.PIC.findMany();
    return h.response(pics).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching users' }).code(500);
  }
};

const getPicById = async (request, h) => {
  const { id } = request.params;

  try {
    const pic = await prisma.PIC.findUnique({
      where: { id_pic : parseInt(id) },
    });

    if (!pic) {
      return h.response({ message: 'PIC tidak ditemukan' }).code(404);
    }

    return h.response(pic).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

module.exports = {
    getAllPic,
    getPicById
};