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
      user_id: "jaygupta_17-05-2005",
      email_id: "jg5835@srmist.edu.in",
      college_roll_number: "RA2311003030470",
      ...result
    });

  } catch (err) {
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;