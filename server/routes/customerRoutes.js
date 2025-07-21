const express = require("express");
const { updateCustomer } = require("../controllers/customerController");
const router = express.Router();

router.put("/customer/update", updateCustomer);

module.exports = router;
