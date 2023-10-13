const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    event: { type: String, required: true },
    site: { type: String, required: true },
    date: { type: String, required: true },
    white: { type: String, required: true },
    black: { type: String, required: true },
    result: { type: String, required: true },
    whiteelo: { type: Number, required: true },
    blackelo: { type: Number, required: true },
    timecontrol: { type: String, required: true },
    endtime: { type: String, required: true },
    termination: { type: String, required: true },
    moves: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
