const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },

    description: {
      required: true,
      type: String,
    },

    location: {
      required: true,
      type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
