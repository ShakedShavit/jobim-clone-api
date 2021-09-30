const Axios = require("axios");

const getGeocode = async (address) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${process.env.MAPBOX_API_ACCESS_TOKEN}`;

    const result = await Axios.get(url);
    const data = result.data;
    if (data.features.length === 0)
      throw new Error("Unable to find location. Try another search");

    return {
      latitude: data.features[0].center[0],
      longitude: data.features[0].center[1],
      location: data.features[0].place_name,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = getGeocode;
