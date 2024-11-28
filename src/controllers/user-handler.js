const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerDamkar = async (request, h) => {
  const { nama, telp, id_pos_damkar, email, password } = request.payload;
  
  const existingUser = await prisma.Damkar.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return h.response({ message: 'Email sudah digunakan' }).code(400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const role = "Damkar"

  try{
    // Save user to database
    const user = await prisma.Damkar.create({
      data: {
        nama,
        telp,
        id_pos_damkar,
        email,
        password: hashedPassword,
        aktif: false,
        role
      }
    });

    return h.response({ message: 'User registered successfully' }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error adding user' }).code(500);
  }
};

const registerPolisi = async (request, h) => {
  const { nama, telp, id_polsek, komandan, email, password } = request.payload;
  
  const existingUser = await prisma.Polisi.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return h.response({ message: 'Email sudah digunakan' }).code(400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  role = "Anggota"

  if (komandan) {
    role = "Komandan"
  }

  // Save user to database
  const user = await prisma.Polisi.create({
    data: {
      nama,
      telp,
      id_polsek,
      komandan,
      email,
      password: hashedPassword,
      aktif: false,
      role
    }
  });

  return h.response({ message: 'User registered successfully' }).code(201);
};

const loginUser = async (request, h) => {
  const { email, password } = request.payload;

  const user_damkar = await prisma.Damkar.findFirst({
    where: { email },
  });

  if (user_damkar) {
    const pos_damkar = await prisma.Pos_damkar.findUnique({
      where: {id_pos_damkar : user_damkar.id_pos_damkar}
    })

    const isValid = await bcrypt.compare(password, user_damkar.password);

    if (!isValid) {
      return h.response({ message: 'Invalid username or password' }).code(401);
    }

    const token = jwt.sign({ userId: user_damkar.id_damkar }, 'your_jwt_secret', {
      expiresIn: '30d',
    });

    return h.response({ 
      token,
      id_damkar : user_damkar.id_damkar,
      nama : user_damkar.nama,
      telp : user_damkar.telp,
      email : user_damkar.email,
      id_pos_damkar : user_damkar.id_pos_damkar,
      role : user_damkar.role,
      cabang_damkar : pos_damkar.nama
     }).code(200);
  }

  const user_polisi = await prisma.Polisi.findFirst({
    where: { email },
  });

  if (user_polisi) {
    const polsek = await prisma.Polsek.findUnique({
      where: {id_polsek : user_polisi.id_polsek}
    })

    const isValid = await bcrypt.compare(password, user_polisi.password);

    if (!isValid) {
      return h.response({ message: 'Invalid username or password' }).code(401);
    }

    const token = jwt.sign({ userId: user_polisi.id_polisi }, 'your_jwt_secret', {
      expiresIn: '30d',
    });

    return h.response({ 
      token,
      id_polisi : user_polisi.id_polisi,
      nama : user_polisi.nama,
      telp : user_polisi.telp,
      email : user_polisi.email,
      id_polsek : user_polisi.id_polsek,
      komandan : user_polisi.komandan,
      role : user_polisi.role,
      cabang_polsek : polsek.nama
    }).code(200);
  }

  if (!user_damkar && !user_polisi) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }
};

const passwordDamkar = async (request, h) => {
  const { id } = request.params;
  const { old_password, new_password, confirm_password } = request.payload;

  try {
    const user = await prisma.Damkar.findUnique({
      where: { id_damkar : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'User not found' }).code(401);
    }

    const isValid = await bcrypt.compare(old_password, user.password);

    if (!isValid) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    if ( new_password != confirm_password){
      return h.response({ message: 'Konfirmasi password tidak sama dengan password baru' }).code(401);
    }

    const hashedNew_password = await bcrypt.hash(new_password, 10);

    const updateUser = await prisma.Damkar.update({
      where: { id_damkar : parseInt(id)},
      data: {
        password : hashedNew_password,
      }
    })

    return h.response({ 
      message: 'Password berhasil diganti', updateUser
    }).code(200);

  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const passwordPolisi = async (request, h) => {
  const { id } = request.params;
  const { old_password, new_password, confirm_password } = request.payload;

  try {
    const user = await prisma.Polisi.findUnique({
      where: { id_polisi : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'User not found' }).code(401);
    }

    const isValid = await bcrypt.compare(old_password, user.password);

    if (!isValid) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    if ( new_password != confirm_password){
      return h.response({ message: 'Konfirmasi password tidak sama dengan password baru' }).code(401);
    }

    const hashedNew_password = await bcrypt.hash(new_password, 10);

    const updateUser = await prisma.Polisi.update({
      where: { id_polisi : parseInt(id)},
      data: {
        password : hashedNew_password,
      }
    })

    return h.response({ 
      message: 'Password berhasil diganti', updateUser
    }).code(200);

  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const registerAdmin = async (request, h) => {
  const { nama, telp, pass_key, email, password } = request.payload;
  
  const key4Admin = require('../../credentials/admin-pass-key.json')

  if(pass_key != key4Admin.key){
    return h.response({ message: 'Pass key tidak sesuai' }).code(400);
  }

  const existingUser = await prisma.Admin.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return h.response({ message: 'Email sudah digunakan' }).code(400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.Admin.create({
    data: {
      nama,
      telp,
      email,
      password: hashedPassword,
    }
  });

  return h.response({ message: 'Admin registered successfully' }).code(201);
};

const loginAdmin = async (request, h) => {
  const { email, password } = request.payload;

  const user_admin = await prisma.Admin.findFirst({
    where: { email },
  });

  if (!user_admin) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  const isValid = await bcrypt.compare(password, user_admin.password);

  if (!isValid) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  const token = jwt.sign({ userId: user_admin.id_admin }, 'your_jwt_secret', {
    expiresIn: '30d',
  });

  return h.response({ 
    message: 'Admin berhasil login', 
    token: token, 
    nama: user_admin.nama,
    telp: user_admin.telp,
    email: user_admin.email
    }).code(200);
};

const passwordAdmin = async (request, h) => {
  const { id } = request.params;
  const { old_password, new_password, confirm_password } = request.payload;

  try {
    const user_admin = await prisma.Admin.findUnique({
      where: { id_admin : parseInt(id) },
    });

    if (!user_admin) {
      return h.response({ message: 'User not found' }).code(401);
    }

    const isValid = await bcrypt.compare(old_password, user_admin.password);

    if (!isValid) {
      return h.response({ message: 'Invalid password' }).code(401);
    }

    if ( new_password != confirm_password){
      return h.response({ message: 'Konfirmasi password tidak sama dengan password baru' }).code(401);
    }

    const hashedNew_password = await bcrypt.hash(new_password, 10);

    const updateUser = await prisma.Admin.update({
      where: { id_admin : parseInt(id)},
      data: {
        password : hashedNew_password,
      }
    })

    return h.response({ 
      message: 'Password berhasil diganti', updateUser
    }).code(200);

  } catch (error){
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const logoutUser = async (request, h) => {
  const { role, id } = request.payload;
  try{
    if (role == "Anggota" || role == "Komandan" || role == "Polisi") {
      const user_polisi = await prisma.Polisi.findUnique({
        where: { id_polisi: parseInt(id) },
      });

      const deleteToken = await prisma.Polisi.update({
        where: { id_polisi: parseInt(id) },
        data: { token_user: null},
      })

      return h.response({ message: 'User berhasil logout' }).code(200);
    }

    else if (role == "Damkar") {
      const user_damkar = await prisma.Damkar.findUnique({
        where: { id_damkar: parseInt(id) },
      });

      const deleteToken = await prisma.Damkar.update({
        where: { id_damkar: parseInt(id) },
        data: { token_user: null},
      })

      return h.response({ message: 'User berhasil logout' }).code(200);
    }

    else {
      h.response({ message: "Role tidak ditemukan"}).code(401);
    }
  } catch (error) {
    console.error("User tidak berhasil logout ", error);
    return h.response({ message: "User tidak berhasil logout "}).code(401);
  }
};

/*
const loginPolisi = async (request, h) => {
  const { email, password } = request.payload;

  const user = await prisma.Polisi.findFirst({
    where: { email },
  });

  if (!user) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {
    expiresIn: '3h',
  });

  return h.response({ token }).code(200);
};
*/
const getAllDamkar = async (request, h) => {
  try {
    const users = await prisma.Damkar.findMany();
    return h.response(users).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching users' }).code(500);
  }
};

const getAllPolisi = async (request, h) => {
  try {
    const users = await prisma.Polisi.findMany();
    return h.response(users).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching users' }).code(500);
  }
};

const getDamkarById = async (request, h) => {
  const { id } = request.params;

  try {
    const user = await prisma.Damkar.findUnique({
      where: { id_damkar : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Damkar not found' }).code(404);
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const getPolisiById = async (request, h) => {
  const { id } = request.params;

  try {
    const user = await prisma.Polisi.findUnique({
      where: { id_polisi : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'User not found' }).code(404);
    }

    return h.response(user).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const getAnggotaByPolsek = async (request, h) => {
  const { id } = request.params;

  try {
    const polsek = await prisma.Polsek.findUnique({
      where: { id_polsek : parseInt(id) },
    });

    if (!polsek) {
      return h.response({ message: 'Polsek not found' }).code(404);
    }

    const anggotas = await prisma.polisi.findMany({
      where: {
        AND: [
          {id_polsek: parseInt(id)},
          {komandan: false}
        ]
      }
    })

    return h.response(anggotas).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
};

const putTokenDamkar = async (request, h) => {
  const { id_damkar, token_user } = request.payload;

  const checkId = await prisma.Damkar.findFirst({
    where: { id_damkar },
  });

  if (!checkId) {
    return h.response({ message: 'Damkar tidak ditemukan' }).code(401);
  }

  const updateToken = await prisma.Damkar.update({
    where : { id_damkar },
    data : { token_user },
  })

  if (!updateToken) {
    return h.response({ message: 'Token FCM gagal di-update' }).code(401);
  }

  
  return h.response({ message: 'Tokwn FCM berhasil di-update' }).code(200);
};

const putTokenPolisi = async (request, h) => {
  const { id_polisi, token_user } = request.payload;

  const checkId = await prisma.Polisi.findFirst({
    where: { id_polisi },
  });

  if (!checkId) {
    return h.response({ message: 'Polisi tidak ditemukan' }).code(401);
  }

  const updateToken = await prisma.Polisi.update({
    where : { id_polisi },
    data : { token_user },
  })

  if (!updateToken) {
    return h.response({ message: 'Token FCM gagal di-update' }).code(401);
  }

  
  return h.response({ message: 'Tokwn FCM berhasil di-update' }).code(200);
};

const updateDamkar = async (request, h) => {
  const { id } = request.params;
  const { nama, telp, id_pos_damkar, email } = request.payload;

  try{
    const user =  await prisma.Damkar.findUnique({
      where: { id_damkar : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Damkar tidak ditemukan' }).code(401);
    }

    const updateUser = await prisma.Damkar.update({
      where: { id_damkar : parseInt(id)},
      data: {
        nama,
        telp,
        id_pos_damkar,
        email
      }
    })

    return h.response({ updateUser, message: 'Data Damkar berhasil di-update' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
}

const updatePolisi = async (request, h) => {
  const { id } = request.params;
  const { nama, telp, id_polsek, email } = request.payload;

  try{
    const user =  await prisma.Polisi.findUnique({
      where: { id_polisi : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Polisi tidak ditemukan' }).code(401);
    }

    const updateUser = await prisma.Polisi.update({
      where: { id_polisi : parseInt(id)},
      data: {
        nama,
        telp,
        id_polsek,
        email,
      }
    });

    return h.response({ updateUser, message: 'Data Polisi berhasil di-update' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
}

const updateAdmin = async (request, h) => {
  const { id } = request.params;
  const { nama, telp, email } = request.payload;

  try{
    const user =  await prisma.Admin.findUnique({
      where: { id_admin : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Admin tidak ditemukan' }).code(401);
    }

    const updateUser = await prisma.Admin.update({
      where: { id_admin : parseInt(id)},
      data: {
        nama,
        telp,
        email
      }
    });

    return h.response({ updateUser, message: 'Data Admin berhasil di-update' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
}

const deleteDamkar = async (request, h) => {
  const { id } = request.params;

  try{
    const user = await prisma.Damkar.findUnique({
      where: { id_damkar : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Damkar tidak ditemukan' }).code(401);
    }

    await prisma.Damkar.delete({
      where: { id_damkar : parseInt(id) },
    })

    return h.response({ message: 'Damkar berhasil dihapus' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
}

const deletePolisi = async (request, h) => {
  const { id } = request.params;

  try{
    const user = await prisma.Polisi.findUnique({
      where: { id_polisi : parseInt(id) },
    });

    if (!user) {
      return h.response({ message: 'Polisi tidak ditemukan' }).code(401);
    }

    await prisma.Polisi.delete({
      where: { id_polisi : parseInt(id) },
    })

    return h.response({ message: 'Polisi berhasil dihapus' }).code(200);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error fetching user' }).code(500);
  }
}

module.exports = {
  registerDamkar, 
  registerPolisi, 
  loginUser,
  passwordDamkar,
  passwordPolisi,
  registerAdmin,
  loginAdmin,
  passwordAdmin,
  logoutUser,
  getAllDamkar,
  getAllPolisi,
  getAnggotaByPolsek,
  getDamkarById,
  getPolisiById,
  putTokenDamkar,
  putTokenPolisi,
  updateDamkar,
  updatePolisi,
  updateAdmin,
  deleteDamkar,
  deletePolisi
};
