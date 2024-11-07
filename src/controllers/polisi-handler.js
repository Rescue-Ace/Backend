const prisma = require('../config/prisma');

const utusPolisi = async (request, h) => {

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