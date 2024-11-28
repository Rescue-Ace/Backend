const { getRouteMapBox } = require('../config/mapbox');
const prisma = require('../config/prisma');

const damkarTerdekat = async (longitude, latitude) => {
  /*
  const query = `
    SELECT id_pos_damkar, longitude, latitude,
    (6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${longitude})) + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)))) AS distance
    FROM pos_damkar
    ORDER BY distance
    LIMIT 1;
  `;*/

  const pos_terdekat = await prisma.$queryRaw`
    SELECT id_pos_damkar, longitude, latitude,
    (6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${longitude})) + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)))) AS distance
    FROM pos_damkar
    ORDER BY distance
    LIMIT 1;
  `;
  return pos_terdekat;
};

const routeFinder = async (pos_damkar, longitude, latitude) => {
    const start = {
      'longitude': pos_damkar.longitude,
      'latitude': pos_damkar.latitude
    };
    const end = { 
      'longitude': longitude, 
      'latitude': latitude 
    };
    const rute = await getRouteMapBox(start, end);
    return rute;
};

module.exports = { damkarTerdekat, routeFinder };