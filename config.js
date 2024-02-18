const axios = require("axios");
const axiosRetry = require("axios-retry").default;

const candidateId = "16e93548-b816-4a41-81d8-bfbde44fdfa3";
const baseUrl = "https://challenge.crossmint.io/api";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount, error) => {
    if (error.response && error.response.status === 429) {
      return 3000; // Wait for 3 seconds before retrying
    }
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.response.status === 429,
});

module.exports = { axios, candidateId, baseUrl };
