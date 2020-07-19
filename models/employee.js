const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    unitID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Unit",
    },
    empName: {
      type: String,
      required: true,
      trim: true,
    },
    startedAt: {
      type: Date,
    },
    age: {
      type: Number,
      required: true,
    },
    aadharDetails: {
      type: String,
    },
    education: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    address: { required: true, type: String },
    active: {
      type: Boolean,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    activeUpto: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
