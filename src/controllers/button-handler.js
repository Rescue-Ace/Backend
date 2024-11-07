const prisma = require('../config/prisma');

const buttonPressed = async (request, h) => {
  const { id } = request.params;

  try {
    const alat = await prisma.Alat.findUnique({
      where: { id_alat : parseInt(id) },
    });

    if (!alat) {
      return h.response({ message: 'Alat not found' }).code(404);
    }

    return h.response(alat).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};

module.exports = { buttonPressed };