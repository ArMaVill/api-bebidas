const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const Bebida = require("./bebida");

const app = express();
const db =
  "mongodb+srv://vending-machine:vending-machine@vending-machine-05zou.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(db, { useNewUrlParser: true });
mongoose.set("useFindAndModify", false);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});

const bebidas = [];

let respuesta = {
  error: false,
  codigo: 200,
  mensaje: ""
};

app.get("/", (req, res) => {
  respuesta = {
    error: true,
    codigo: 200,
    mensaje: "Punto de inicio"
  };
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app
  .route("/bebidas")
  .get((req, res) => {
    if (bebidas.length < 1 || bebidas === undefined) {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: "no hay suficientes bebidas",
        respuesta: []
      };
    } else {
      Bebida.find()
        .exec()
        .then(data => {
          respuesta = {
            error: false,
            codigo: 200,
            mensaje: "Lista de bebidas",
            respuesta: data
          };
          res.send(respuesta);
        })
        .catch();
    }
  })
  .post((req, res) => {
    if (
      !req.body.nombre ||
      !req.body.descripcion ||
      !req.body.precio ||
      !req.body.cantidad
    ) {
      respuesta = {
        error: true,
        codigo: 502,
        mensaje: "Faltan datos"
      };
    } else {
      // const index = bebidas.length - 1;
      const nuevaBebida = new Bebida({
        _id: new mongoose.Types.ObjectId(),
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        cantidad: req.body.cantidad,
        precio: req.body.precio
      });
      nuevaBebida
        .save()
        .then(result => {
          console.log(result);
        })
        .catch();
      // bebidas.push(nuevaBebida);

      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Se inserto nueva bebida",
        respuesta: nuevaBebida
      };
    }
    res.send(respuesta);
  });

app
  .route("/bebidas/:id")
  .get((req, res) => {
    const { id } = req.params;

    if (bebidas.length < 1 || bebidas === undefined) {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: "no hay suficientes bebidas"
      };
    } else {
      const bebida = [];
      if (bebida === undefined) {
        respuesta = {
          error: true,
          codigo: 501,
          mensaje: `No se encontro la bebida con el id ${req.params.id}`
        };
      } else {
        Bebida.findById(id)
          .exec()
          .then(data => {
            respuesta = {
              error: false,
              codigo: 200,
              mensaje: "Bebida encontrada",
              respuesta: data
            };
            res.send(respuesta);
          })
          .catch();
      }
    }
  })
  .put((req, res) => {
    const { id } = req.params;
    if (
      !req.body.nombre ||
      !req.body.descripcion ||
      !req.body.precio ||
      !req.body.cantidad
    ) {
      respuesta = {
        error: true,
        codigo: 502,
        mensaje: "Faltan datos"
      };
    } else {
      Bebida.findByIdAndUpdate(id, {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        cantidad: req.body.cantidad,
        precio: req.body.precio
      })
        .then(data => {
          respuesta = {
            error: false,
            codigo: 200,
            mensaje: "Bebida encontrada",
            respuesta: data
          };
          res.send(respuesta);
        })
        .catch();
    }
  })
  .delete((req, res) => {
    const { id } = req.params;

    Bebida.findOneAndRemove(id, (err, data) => {
      if (err) {
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: "Se elimino la bebida",
          respuesta: err
        };
      } else {
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: "Se elimino la bebida",
          respuesta: data
        };
      }
      return res.send(respuesta);
    });
  });

app.use((req, res, next) => {
  respuesta = {
    error: true,
    codigo: 404,
    mensaje: "URL no encontrada"
  };
  res.status(404).send(respuesta);
});
