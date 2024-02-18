const { axios, candidateId, baseUrl } = require("./config");

async function postEntity(entity, payload) {
  try {
    const url = `${baseUrl}/${entity}`;
    await axios.post(url, payload);
    console.log(
      `Posting ${entity}, The following payload was successful:`,
      payload
    );
  } catch (error) {
    console.error(
      `Error posting to ${entity}:`,
      error.response?.data || error.message
    );
  }
}

module.exports = { postEntity };
