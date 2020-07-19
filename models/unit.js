const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema(
  {
    unitName: {
      type: String,
      required: true,
      trim: true,
    },
    startedAt: {
      type: String,
      required: true,
    },
    typesOfService: {
      type: String,
      required: true,
    },
    sector: {
      type: String,
      required: true,
    },
    employees: {
      type: Number,
      required: true,
    },
    active: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    activeUpto: {
      type: String,
    },
    delEmployes: [
      {
        removedEmployes: {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
          },

          unitID: {
            type: mongoose.Schema.Types.ObjectId,

            ref: "Unit",
          },
          empName: {
            type: String,

            trim: true,
          },
          startedAt: {
            type: Date,
          },
          age: {
            type: Number,
          },
          aadharDetails: {
            type: String,
          },
          education: {
            type: String,
          },
          position: {
            type: String,
          },
          address: { type: String },
          active: {
            type: Boolean,
          },
          location: {
            type: String,
          },
          activeUpto: {
            type: Date,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

unitSchema.virtual("employee", {
  ref: "Employee",
  localField: "_id",
  foreignField: "unitID",
});

const Unit = mongoose.model("Unit", unitSchema);

module.exports = Unit;
