const express = require("express");
const router = express.Router();

const { processData } = require("../utils/graph");

router.post("/", (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "Input must be an array"
      });
    }

    const result = processData(data);

    res.json({
      user_id: "yourname_ddmmyyyy",
      email_id: "your@email.com",
      college_roll_number: "your_roll",
      ...result
    });

  } catch (err) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;