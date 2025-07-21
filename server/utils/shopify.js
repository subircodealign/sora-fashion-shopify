// server/utils/shopify.js
const axios = require("axios");

const shopifyRequest = async (endpoint, method = "GET", data = {}) => {
  try {
    const response = await axios({
      url: `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-07/${endpoint}.json`,
      method,
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      data,
    });
    return response.data;
  } catch (err) {
    console.error("Shopify API error:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { shopifyRequest };
