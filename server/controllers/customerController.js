const { shopifyRequest } = require("../utils/shopify");

const updateCustomer = async (req, res) => {
  const { id, gender, birthday, country, timezone } = req.body;

  const customerData = {
    customer: {
      id,
      metafields: [
        { namespace: "custom", key: "gender", value: gender, type: "single_line_text_field" },
        { namespace: "custom", key: "birthday", value: birthday, type: "date" },
        { namespace: "custom", key: "country", value: country, type: "single_line_text_field" },
        { namespace: "custom", key: "timezone", value: timezone, type: "single_line_text_field" },
      ],
    },
  };

  try {
    const result = await shopifyRequest(`customers/${id}`, "PUT", customerData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer info" });
  }
};

module.exports = { updateCustomer };
