const express = require("express");
const router = express.Router();

const Unit = require("../models/unit");
const auth = require("../middleware/auth");

// add unit
router.post("/", auth, async (req, res) => {
  const unit = new Unit(req.body);

  try {
    await unit.save();

    res.status(201).send(unit);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all units
router.get("/", auth, async (req, res) => {
  try {
    const units = await Unit.find({});

    // const unitMap = {};
    // units.forEach((unit) => (unitMap[unit._id] = unit));

    res.status(201).send(units);
  } catch (error) {
    res.status(400).send(error);
  }
});

// get unit by id
router.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const unit = await Unit.findOne({ _id });

    if (!unit) {
      return res.status(404).send();
    }

    res.send(unit);
  } catch (e) {
    res.status(500).send();
  }
});
// get  deleted unit by id

// router.get("/deletedunits/:id", auth, async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const unit = await Unit.findOne({ _id });

//     if (!unit) {
//       return res.status(404).send();
//     }

//     res.send(unit[0].delEmployes);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

// update Unit
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "unitName",
    "typesOfService",
    "employees",
    "active",
    "location",
    "startedAt",
    "activeUpto",
    "sector",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const unit = await Unit.findOne({
      _id: req.params.id,
    });

    if (!unit) {
      return res.status(404).send();
    }

    updates.forEach((update) => (unit[update] = req.body[update]));
    await unit.save();

    res.send(unit);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete unit
router.delete("/", auth, async (req, res) => {
  try {
    // const unit = await Unit.findOneAndDelete({
    //   _id: req.params.id,
    // });
    const unit = await Unit.deleteMany({ _id: { $in: req.body.payload } });

    if (unit.deletedCount === 1) {
      return res.send({
        msg: ` Deleted ${unit.deletedCount} unit`,
      });
    }
    res.send({ msg: ` Deleted ${unit.deletedCount} units` });
  } catch (e) {
    res.status(500).send({ msg: "Error occured while deleting unit" });
  }
});

module.exports = router;
