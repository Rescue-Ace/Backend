const prisma = require('../config/prisma');

const getAllKebakaran = async (request, h) => {
  try {
    const kebakarans = await prisma.kebakaran.findMany();
    return h.response(kebakarans).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};

const getKebakaranById = async (request, h) => {
  const { id } = request.params;

  try {
    const kebakaran = await prisma.kebakaran.findUnique({
      where: { id_kebakaran : parseInt(id) },
    });

    if (!kebakaran) {
      return h.response({ message: 'Kebakaran tidak ditemukan' }).code(404);
    }

    return h.response(kebakaran).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching' }).code(500);
  }
};

module.exports = {
    getAllKebakaran,
    getKebakaranById
};