const express = require("express");
const Employee = require("../models/employee");
const Unit = require("../models/unit");

const auth = require("../middleware/auth");
const router = new express.Router();

// add employee
router.post("/:id", auth, async (req, res) => {
  const employee = new Employee({
    ...req.body,
    unitID: req.params.id,
  });

  try {
    await employee.save();
    res.status(201).send(employee);
  } catch (e) {
    res.status(400).send(e);
  }
});

// get all employees based on unit id
router.get("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.find({
      unitID: req.params.id,
    });

    if (!employee) {
      return res.status(404).send({ error: "No employee found" });
    }
    res.send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

// update employee based on id
router.patch("/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "address",
    "position",
    "education",
    "age",
    "empName",
    "active",
    "location",
    "unitName",
  ];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const employee = await Employee.findOne({ _id: req.params.id });

    if (!employee) {
      return res.status(404).send({ error: "No employee found" });
    }

    updates.forEach((update) => (employee[update] = req.body[update]));
    await employee.save();

    res.send(employee);
  } catch (e) {
    res.status(400).send(e);
  }
});

// delete employee based on id

router.delete("/:id", auth, async (req, res) => {
  try {
    // look for employee
    const employee = await Employee.find({
      _id: req.params.id,
    });
    if (!employee.length) {
      return res.status(404).send({ msg: "No employee found" });
    }
    // adding employee to unit before deleting
    const unit = await Unit.findById(employee[0].unitID);
    const removedEmployes = employee[0];
    unit.delEmployes = unit.delEmployes.concat({
      removedEmployes,
    });
    await unit.save();

    // remove employee
    const deletedEmployee = await Employee.findOneAndDelete({
      _id: req.params.id,
    });

    res.send(deletedEmployee);
  } catch (e) {
    res.status(500).send();
  }
});
module.exports = router;
