const axios = require('axios');

const mapboxToken = process.env.MAPBOX_TOKEN;

const getRouteMapBox = async (start, end) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?max_weight=16&steps=true&geometries=geojson&access_token=${mapboxToken}`;
  const response = await axios.get(url);
  return response.data;
};

const getSubdistrictMapBox = async (longitude, latitude) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&types=locality`;
  const response = await axios.get(url);
  const subdistrict = response.data.features.text;
  return subdistrict;
};
  
module.exports = { getRouteMapBox, getSubdistrictMapBox };
