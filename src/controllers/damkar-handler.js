const prisma = require('../config/prisma');

const reqBantuan = async (request, h) => {
    const bantuan = request.params;
    
}

const getAllPosDamkar = async (request, h) => {
    try {
      const pos = await prisma.Pos_damkar.findMany();
      return h.response(pos).code(200);
    } catch (error) {
      console.error(error);
      return h.response({ message: 'Error fetching' }).code(500);
    }
  };
  
const getPosDamkarById = async (request, h) => {
  const { id } = request.params;

  try {
    const pos = await prisma.Pos_damkar.findUnique({
      where: { id_pos_damkar : parseInt(id) },
    });

    if (!pos) {
      return h.response({ message: 'Pos damkar tidak ditemukan' }).code(404);
    }

    return h.response(pos).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

module.exports = {
    reqBantuan,
    getAllPosDamkar,
    getPosDamkarById,
}
