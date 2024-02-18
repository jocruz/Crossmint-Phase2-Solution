const { axios, baseUrl } = require("./config");

const mapUrl = `${baseUrl}/map/16e93548-b816-4a41-81d8-bfbde44fdfa3/goal`;

const getMap = async () => {
  try {
    const response = await axios.get(mapUrl);
    return response.data.goal;
  } catch (err) {
    console.error("There was an error retrieving the map:", err.message);
    throw err;
  }
};

module.exports = { getMap };
