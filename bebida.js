const mongoose = require("mongoose");

const esquemaBebidas = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nombre: String,
  descripcion: String,
  precio: Number,
  cantidad: Number
});

module.exports = mongoose.model("Bebida", esquemaBebidas);
