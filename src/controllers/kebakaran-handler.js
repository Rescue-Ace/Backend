const prisma = require('../config/prisma');
const { sendNotificationToFCM } = require('../service/fcm');
const { persimpangan } = require('../service/polisiLogic');

const getAllKebakaran = async (request, h) => {
  try {
    const kebakarans = await prisma.kebakaran.findMany({
      include: {
        Alat: true,
      },
    });

    const dataKebakarans = kebakarans.map((kebakaran) => ({
      ...kebakaran,
      waktu_pelaporan: kebakaran.waktu_pelaporan.toISOString().split('T')[0], // Mengambil hanya tanggal
    }));

    return h.response(dataKebakarans).code(200);
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

const updateKebakaran = async (request, h) => {
  const { id } = request.params;
  const { status_kebakaran } = request.payload;

  try{
    const kebakaran =  await prisma.kebakaran.findUnique({
      where: { id_kebakaran : parseInt(id) },
    });

    if (!kebakaran) {
      return h.response({ message: 'Kebakaran tidak ditemukan' }).code(401);
    }

    const damkars = await prisma.damkar.findMany({
      where: {
        id_pos_damkar: kebakaran.id_pos_damkar,
      }
    })

    const polisis = await prisma.polisi.findMany({
      where: {
        id_polsek : kebakaran.id_polsek,
      }
    })

    const alat = await prisma.Alat.findUnique({
      where: { id_alat : kebakaran.id_alat },
    });

    const updateStatus = await prisma.kebakaran.update({
      where: { id_kebakaran : parseInt(id)},
      data: {
        status_kebakaran : status_kebakaran
      }
    })

    const payload = {
      "status": status_kebakaran,
      "location": {
      "latitude": alat.latitude,
      "longitude": alat.latitude
    },
    "timestamp": new Date()
    }

    damkars.forEach(damkar =>{
      sendNotificationToFCM(damkar.token_user, 'Status kebakaran', 'KEBAKARAN TELAH PADAM', JSON.stringify(payload));
    });

    polisis.forEach(polisi =>{
      sendNotificationToFCM(polisi.token_user, 'Status kebakaran', 'KEBAKARAN TELAH PADAM', JSON.stringify(payload))
    })

    return h.response({ updateStatus, message: 'Data kebakaran berhasil di-update' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching data' }).code(500);
  }
}

const ruteKebakaran = async (request, h) => {
  const { id } = request.params;

  try {
    const kebakaran = prisma.kebakaran.findUnique({
      where: {
        id_kebakaran : parseInt(id),
      }
    })

    return h.response({ message: "Rute kebakaran dan titik penetralan", rute: JSON.parse(kebakaran.rute) }).code(200);
  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching data' }).code(500);
  }
}
const simpangPenetralan = async (request, h) => {
  const { id } = request.params;

  try {
    const kebakaran = prisma.kebakaran.findUnique({
      where: {
        id_kebakaran : parseInt(id),
      }
    })

    const rute = JSON.parse(kebakaran.rute);

    const simpang = await persimpangan(rute)

    return h.response({ message: "Rute kebakaran", rute: JSON.parse(kebakaran.rute), simpang: simpang }).code(200);
  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching data' }).code(500);
  }
}

const titikPenetralan = async (request, h) => {
  const { id } = request.params;
  const { id_kebakaran } = request.payload;

  try {    
    const anggota = prisma.polisi.findUnique({
      where: {
        id_polisi : parseInt(id),
      }
    })

    const kebakaran = prisma.kebakaran.findUnique({
      where: {
        id_kebakaran : parseInt(id_kebakaran),
      }
    })

    return h.response({ message: "Rute kebakaran", rute: JSON.parse(kebakaran.rute), titik_penetralan: prisma.polisi }).code(200);
  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching data' }).code(500);
  }
}

module.exports = {
    getAllKebakaran,
    getKebakaranById,
    updateKebakaran
};