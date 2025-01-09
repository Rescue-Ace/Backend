const prisma = require('../config/prisma');
const { routeFinder, damkarTerdekat } = require('../service/damkarLogic');
const { sendNotificationToFCM } = require('../service/fcm');
const { persimpangan, polsekTerdekat } = require('../service/polisiLogic');

const buttonPresseds = async (request, h) => {
  const { id } = request.params;

  try {
    const alat = await prisma.alat.findUnique({
      where: { id_alat : parseInt(id) },
    });

    if (!alat) {
      return h.response({ message: 'Alat not found' }).code(404);
    }

    const pos_damkar = await damkarTerdekat( alat.longitude, alat.latitude);

    if (!pos_damkar[0]) {
      return h.response({ message: 'pos damkar not found' }).code(404);
    }

    const damkars = await prisma.damkar.findMany({
      where: {
        id_pos_damkar: pos_damkar[0].id_pos_damkar,
      }
    })

    const kebakaran = await prisma.Kebakaran.create({
      data: {
        waktu_pelaporan: new Date(),
        status_kebakaran: 'diproses',
        id_alat: alat.id_alat,
        id_pos_damkar: pos_damkar[0].id_pos_damkar,
      }
    })

    const rute = await routeFinder(pos_damkar[0], alat.longitude, alat.latitude);
    console.log(rute.routes[0].geometry);
    const simpang = await persimpangan(rute);
    console.log(simpang);

    if (!simpang){
      const polsek = await polsekTerdekat(alat.longitude, alat.latitude)

      if (!polsek[0]) {
        return h.response({ message: 'polsek not found' }).code(404);
      }

      const komandans = await prisma.polisi.findMany({
        where: {
          AND: [
            {id_polsek: polsek[0].id_polsek},
            {komandan: true}
          ]
        }
      })

      damkars.forEach(damkar =>{
        sendNotificationToFCM(damkar.token_user, 'Rute Kebakaran', 'ADA KEBAKARAN', rute.routes[0].geometry);
      });

      komandans.forEach(komandan =>{
        sendNotificationToFCM(komandan.token_user, 'lokasi kebakaran', 'ADA KEBAKARAN', [alat.longitude, alat.latitude]);
      });

      return h.response(alat).code(200);
    }

    const polsek = await polsekTerdekat(simpang[0][0], simpang[0][1])

    if (!polsek[0]) {
      return h.response({ message: 'polsek not found' }).code(404);
    }

    const komandans = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: polsek[0].id_polsek},
          {komandan: true}
        ]
      }
    })

    damkars.forEach(damkar =>{
      sendNotificationToFCM(damkar.token_user, 'Rute Kebakaran', 'ADA KEBAKARAN', rute.routes[0].geometry);
    });

    komandans.forEach(komandan =>{
      sendNotificationToFCM(komandan.token_user, 'Titik penetralan', 'ADA KEBAKARAN', simpang);
    });

    komandans.forEach(komandan =>{
      sendNotificationToFCM(komandan.token_user, 'Lokasi kebakaran', 'ADA KEBAKARAN', [alat.longitude, alat.latitude]);
    });

    return h.response(alat).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};

const getAllAlat = async (request, h) => {
  try {
    const alats = await prisma.Alat.findMany({
      include: {
        PIC: true,
        PIC2: true
      },
    });

    const payload = alats.map((alat) => ({
      id_alat: alat.id_alat,
      alamat: alat.alamat,
      latitude: alat.latitude,
      longitude: alat.longitude,
      name: alat.name,
      nama_pic1: alat.PIC?.nama || null,
      telp_pic1: alat.PIC?.telp || null,
      nama_pic2: alat.PIC2?.nama || null,
      telp_pic2: alat.PIC2?.telp || null,
    }));
    return h.response(payload).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};

const getAlatById = async (request, h) => {
  const { id } = request.params;

  try {
    const alat = await prisma.Alat.findUnique({
      where: { id_alat : parseInt(id) },
    });

    if (!alat) {
      return h.response({ message: 'Alat tidak ditemukan' }).code(404);
    }

    return h.response(alat).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};

const addAlat = async (request, h) => {
  const { 
    nama_pic1,
    telp_pic1,
    nama_pic2,
    telp_pic2, 
    alamat, 
    link_maps, 
    longitude, 
    latitude
  } = request.payload;

  const existingtelp1 = await prisma.PIC.findFirst({
    where: {
      telp : telp_pic1,
    },
  });

  if (existingtelp1) {
    return h.response({ message: 'Telepon PIC 1 sudah terdaftar' }).code(400);
  }

  const existingtelp2 = await prisma.PIC.findFirst({
    where: {
      telp : telp_pic2,
    },
  });

  if (existingtelp2) {
    return h.response({ message: 'Telepon PIC 2 sudah terdaftar' }).code(400);
  }

  const pic1 = await prisma.PIC.create({
    data: {
      nama: nama_pic1,
      telp: telp_pic1
    }
  });

  const pic2 = await prisma.PIC.create({
    data: {
      nama: nama_pic2,
      telp: telp_pic2
    }
  });

  const alat = await prisma.alat.create({
    data: {
      alamat,
      link_maps,
      longitude,
      latitude,
      id_pic: pic1.id_pic,
      id_pic2: pic2.id_pic
    }
  });

  return h.response({ message: 'Alat berhasil ditambahkan', pic1, pic2, alat}).code(201);
};

const buttonPressednew = async (request, h) => {
  const { id } = request.params;

  try {
    const alat = await prisma.alat.findUnique({
      where: { id_alat : parseInt(id) },
    });

    if (!alat) {
      return h.response({ message: 'Alat not found' }).code(404);
    }

    const pos_damkar = await prisma.pos_damkar.findUnique({
      where: { id_pos_damkar : parseInt(24) },
    });
    
    const polsek = await prisma.Polsek.findUnique({
      where: { id_polsek : parseInt(2) },
    });
    
    if (!polsek) {
      return h.response({ message: 'polsek not found' }).code(404);
    }

    if (!pos_damkar) {
      return h.response({ message: 'pos damkar not found' }).code(404);
    }

    const damkars = await prisma.damkar.findMany({
      where: {
        id_pos_damkar: 24,
      }
    })

    const rute = await routeFinder(pos_damkar, alat.longitude, alat.latitude);
    const simpang = await persimpangan(rute);

    const kebakaran = await prisma.Kebakaran.create({
      data: {
        waktu_pelaporan: new Date(),
        status_kebakaran: 'diproses',
        id_alat: alat.id_alat,
        id_pos_damkar: pos_damkar.id_pos_damkar,
        rute: JSON.stringify(rute.routes[0].geometry),
        simpang: JSON.stringify(simpang),
        id_polsek: polsek.id_polsek
      }
    })


    if (!simpang){
      const komandans = await prisma.polisi.findMany({
        where: {
          AND: [
            {id_polsek: polsek.id_polsek},
            {komandan: true}
          ]
        }
      })

      const anggotas = await prisma.polisi.findMany({
        where: {
          AND: [
            {id_polsek: polsek.id_polsek},
            {komandan: false}
          ]
        }
      })

      damkars.forEach(damkar =>{
        if(damkar.token_user){
        sendNotificationToFCM(
          damkar.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
        }
      });
      anggotas.forEach(anggota =>{
        if(anggota.token_user){
        sendNotificationToFCM(
          anggota.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
        }
      });
      komandans.forEach(komandan =>{
        if(komandan.token_user){
        sendNotificationToFCM(
          komandan.token_user, 
          'lokasi kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            },
            "lokasi alat":{
              longitude: alat.longitude, 
              latitude: alat.latitude
            }, 
            simpang: [], 
            rute: rute.routes[0].geometry}));
        }
      });

      return h.response(alat).code(200);
    }

    const komandans = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: polsek.id_polsek},
          {komandan: true}
        ]
      }
    })

    const anggotas = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: polsek.id_polsek},
          {komandan: false}
        ]
      }
    })

    damkars.forEach(damkar =>{
      if(damkar.token_user){
        sendNotificationToFCM(
          damkar.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
      }    
    });

    anggotas.forEach(anggota =>{
      if(anggota.token_user){
      sendNotificationToFCM(
        anggota.token_user, 
        'Rute Kebakaran', 
        'ADA KEBAKARAN', 
        JSON.stringify({
          kebakaran: {id_kebakaran: kebakaran.id_kebakaran, 
            lokasi: alat.alamat}, 
            rute: rute.routes[0].geometry}));
      }
    });

    komandans.forEach(komandan =>{
      if(komandan.token_user){
      sendNotificationToFCM(
        komandan.token_user, 
        'Lokasi kebakaran dan titik penetralan', 
        'ADA KEBAKARAN', 
        JSON.stringify({
          kebakaran: {
            id_kebakaran: kebakaran.id_kebakaran, 
            lokasi: alat.alamat
          }, 
          "lokasi alat":{
            longitude: alat.longitude, 
            latitude: alat.latitude}, 
            simpang: simpang, 
            rute: rute.routes[0].geometry}));
      }
    });

    console.log(JSON.stringify({kebakaran: {id_kebakaran: kebakaran.id_kebakaran, lokasi: alat.alamat}, rute: rute.routes[0].geometry}))
    console.log(JSON.stringify({kebakaran: {id_kebakaran: kebakaran.id_kebakaran, lokasi: alat.alamat}, "lokasi alat":{longitude: alat.longitude, latitude: alat.latitude}, simpang: simpang, rute: rute.routes[0].geometry}))

    return h.response(alat).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};

const buttonPressed = async (request, h) => {
  const { id } = request.params;

  try {
    const alat = await prisma.alat.findUnique({
      where: { id_alat : parseInt(id) },
    });

    if (!alat) {
      return h.response({ message: 'Alat not found' }).code(404);
    }

    const pos_damkar = await damkarTerdekat( alat.longitude, alat.latitude);

    if (!pos_damkar[0]) {
      return h.response({ message: 'pos damkar not found' }).code(404);
    }
    console.log(pos_damkar[0].id_pos_damkar);
    
    const polsek = await polsekTerdekat(alat.longitude, alat.latitude);

    if (!polsek[0]) {
      return h.response({ message: 'polsek not found' }).code(404);
    }
    console.log(polsek[0].id_polsek);

    const damkars = await prisma.damkar.findMany({
      where: {
        id_pos_damkar: pos_damkar[0].id_pos_damkar,
      }
    })

    const rute = await routeFinder(pos_damkar[0], alat.longitude, alat.latitude);
    const simpang = await persimpangan(rute);

    const kebakaran = await prisma.Kebakaran.create({
      data: {
        waktu_pelaporan: new Date(),
        status_kebakaran: 'diproses',
        id_alat: alat.id_alat,
        id_pos_damkar: pos_damkar[0].id_pos_damkar,
        rute: JSON.stringify(rute.routes[0].geometry),
        simpang: JSON.stringify(simpang),
        id_polsek: polsek[0].id_polsek
      }
    })


    if (!simpang){
      const komandans = await prisma.polisi.findMany({
        where: {
          AND: [
            {id_polsek: polsek[0].id_polsek},
            {komandan: true}
          ]
        }
      })

      const anggotas = await prisma.polisi.findMany({
        where: {
          AND: [
            {id_polsek: polsek[0].id_polsek},
            {komandan: false}
          ]
        }
      })

      damkars.forEach(damkar =>{
        if(damkar.token_user){
        sendNotificationToFCM(
          damkar.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
        }
      });
      anggotas.forEach(anggota =>{
        if(anggota.token_user){
        sendNotificationToFCM(
          anggota.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
        }
      });
      komandans.forEach(komandan =>{
        if(komandan.token_user){
        sendNotificationToFCM(
          komandan.token_user, 
          'lokasi kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            },
            "lokasi alat":{
              longitude: alat.longitude, 
              latitude: alat.latitude
            }, 
            simpang: [], 
            rute: rute.routes[0].geometry}));
        }
      });

      return h.response(alat).code(200);
    }

    const komandans = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: polsek[0].id_polsek},
          {komandan: true}
        ]
      }
    })

    const anggotas = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: polsek[0].id_polsek},
          {komandan: false}
        ]
      }
    })

    damkars.forEach(damkar =>{
      if(damkar.token_user){
        sendNotificationToFCM(
          damkar.token_user, 
          'Rute Kebakaran', 
          'ADA KEBAKARAN', 
          JSON.stringify({
            kebakaran: {
              id_kebakaran: kebakaran.id_kebakaran, 
              lokasi: alat.alamat
            }, 
            rute: rute.routes[0].geometry}));
      }    
    });

    anggotas.forEach(anggota =>{
      if(anggota.token_user){
      sendNotificationToFCM(
        anggota.token_user, 
        'Rute Kebakaran', 
        'ADA KEBAKARAN', 
        JSON.stringify({
          kebakaran: {id_kebakaran: kebakaran.id_kebakaran, 
            lokasi: alat.alamat}, 
            rute: rute.routes[0].geometry}));
      }
    });

    komandans.forEach(komandan =>{
      if(komandan.token_user){
      sendNotificationToFCM(
        komandan.token_user, 
        'Lokasi kebakaran dan titik penetralan', 
        'ADA KEBAKARAN', 
        JSON.stringify({
          kebakaran: {
            id_kebakaran: kebakaran.id_kebakaran, 
            lokasi: alat.alamat
          }, 
          "lokasi alat":{
            longitude: alat.longitude, 
            latitude: alat.latitude}, 
            simpang: simpang, 
            rute: rute.routes[0].geometry}));
      }
    });

    console.log(JSON.stringify({kebakaran: {id_kebakaran: kebakaran.id_kebakaran, lokasi: alat.alamat}, rute: rute.routes[0].geometry}))
    console.log(JSON.stringify({kebakaran: {id_kebakaran: kebakaran.id_kebakaran, lokasi: alat.alamat}, "lokasi alat":{longitude: alat.longitude, latitude: alat.latitude}, simpang: simpang, rute: rute.routes[0].geometry}))

    return h.response(alat).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching alat' }).code(500);
  }
};
module.exports = { buttonPressed, getAlatById, getAllAlat, addAlat };