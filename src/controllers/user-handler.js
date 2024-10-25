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
  try{
    // Save user to database
    const user = await prisma.Damkar.create({
      data: {
        nama,
        telp,
        id_pos_damkar,
        email,
        password: hashedPassword,
        status_aktif: 'i'
      }
    });

    return h.response({ message: 'User registered successfully' }).code(201);
  } catch (error) {
    console.error(error);
    return h.response({ message: 'Error adding user' }).code(500);
  }
};

const registerPolisi = async (request, h) => {
  const { nama, telp, id_polsek, tag, email, password } = request.payload;
  
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
  
  // Save user to database
  const user = await prisma.Polisi.create({
    data: {
      nama,
      telp,
      id_polsek,
      tag,
      email,
      password: hashedPassword,
        status_aktif: 'i'
    }
  });

  return h.response({ message: 'User registered successfully' }).code(201);
};


const loginDamkar = async (request, h) => {
  const { email, password } = request.payload;

  // Check if user exists
  const user = await prisma.Damkar.findUnique({
    where: { email },
  });

  if (!user) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  // Compare password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return h.response({ token }).code(200);
};

const loginPolisi = async (request, h) => {
  const { email, password } = request.payload;

  // Check if user exists
  const user = await prisma.Polisi.findUnique({
    where: { email },
  });

  if (!user) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  // Compare password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return h.response({ message: 'Invalid username or password' }).code(401);
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', {
    expiresIn: '1h',
  });

  return h.response({ token }).code(200);
};

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


module.exports = {
  registerDamkar, 
  registerPolisi, 
  loginDamkar, 
  loginPolisi,
  getAllDamkar,
  getAllPolisi,
  getDamkarById,
  getPolisiById
};
