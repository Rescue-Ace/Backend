const { getSubdistrictMapBox, getRouteMapBox } = require("../config/mapbox");
const prisma = require('../config/prisma');

const persimpangan = async (rute) => {
    const simpang = [];

    if(rute){
      rute.routes.forEach(route => {
        route.legs.forEach(leg => {
          leg.steps.forEach(step => {
            simpang.push(...step.intersections);
          });
        });
      });

      const simpangLama = simpang.sort((a, b) => b.duration - a.duration);
      
      if(simpang.length < 5){

        const koordinatSimpangLama = simpangLama.map(intersection => intersection.location);

        return koordinatSimpangLama;
      }

      const simpangTerlama = simpangLama.slice(0, 5);
      const koordinatSimpangTerlama = simpangTerlama.map(intersection => intersection.location);

      return koordinatSimpangTerlama;
    }
};

const polsekTerdekat = async (longitude, latitude) => {

    const polsek_terdekat = await prisma.$queryRaw`
      SELECT id_polsek, longitude, latitude,
      (6371 * ACOS(COS(RADIANS(${latitude})) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(${longitude})) + SIN(RADIANS(${latitude})) * SIN(RADIANS(latitude)))) AS distance
      FROM polsek
      ORDER BY distance
      LIMIT 1;
    `;
    return polsek_terdekat;
  };

module.exports = { persimpangan, polsekTerdekat };