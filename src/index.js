const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let x;

const bebidas = [
  {
    id: 1,
    nombre: "Cafe negro",
    descripcion: "taza de Cafe negro",
    precio: 500,
    cantidad: 20
  },
  {
    id: 2,
    nombre: "Cafe con leche",
    descripcion: "taza de cafe negro",
    precio: 550,
    cantidad: 20
  },
  {
    id: 3,
    nombre: "Expreso",
    descripcion: "taza de cafe negro, fuerte",
    precio: 550,
    cantidad: 20
  },
  {
    id: 4,
    nombre: "Cappuccino",
    descripcion:
      "A cappuccino is an espresso-based coffee drink that originated in Italy, and is traditionally prepared with steamed milk foam.",
    precio: 550,
    cantidad: 20
  },
  {
    id: 5,
    nombre: "Cafe con leche",
    descripcion: "taza de Cafe negro",
    precio: 550,
    cantidad: 20
  }
];

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
  res.send(respuesta);
});

app
  .route("/bebidas")
  .get((req, res) => {
    if (bebidas.length < 1 || bebidas === undefined) {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: "no hay suficientes bebidas"
      };
    } else {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Lista de bebidas",
        respuesta: bebidas
      };
    }
    res.send(respuesta);
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
      const index = bebidas.length - 1;
      const nuevaBebida = {
        id: bebidas[index].id + 1,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        cantidad: req.body.cantidad,
        precio: req.body.precio
      };
      bebidas.push(nuevaBebida);

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
    const id = Number(req.params.id);

    if (bebidas.length < 1 || bebidas === undefined) {
      respuesta = {
        error: true,
        codigo: 501,
        mensaje: "no hay suficientes bebidas"
      };
    } else {
      const bebida = bebidas.find(item => item.id === id);
      if (bebida === undefined) {
        respuesta = {
          error: true,
          codigo: 501,
          mensaje: `No se encontro la bebida con el id${req.params.id}`
        };
      } else {
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: "Bebida encontrada",
          respuesta: bebida
        };
      }
    }
    res.send(respuesta);
  })
  .put((req, res) => {
    const id = Number(req.params.id);
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
    } else if (Number.isNaN(id) || id > bebidas.length) {
      respuesta = {
        error: false,
        codigo: 200,
        mensaje: `No se encontro la bebida con el id ${req.params.id}`
      };
    } else {
      const index = bebidas.findIndex(item => item.id === id);
      bebidas[index].nombre = req.body.nombre;
      bebidas[index].descripcion = req.body.descripcion;
      bebidas[index].cantidad = req.body.cantidad;
      bebidas[index].precio = req.body.precio;

      respuesta = {
        error: false,
        codigo: 200,
        mensaje: "Se inserto nueva bebida",
        respuesta: bebidas[index]
      };
    }
    res.send(respuesta);
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      respuesta = {
        error: true,
        codigo: 502,
        mensaje: `No se puede eliminar la bebida con el id ${req.params.id}`
      };
    } else {
      const index = bebidas.findIndex(item => item.id === id);
      if (index >= 0) {
        const bebida = bebidas[index];
        bebidas.splice(index, 1);
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: "Se elimino la bebida",
          respuesta: bebida
        };
      } else {
        respuesta = {
          error: false,
          codigo: 200,
          mensaje: `No se puede eliminar la bebida con el id ${req.params.id}`
        };
      }
    }
    res.send(respuesta);
  });

app.use((req, res, next) => {
  respuesta = {
    error: true,
    codigo: 404,
    mensaje: "URL no encontrada"
  };
  res.status(404).send(respuesta);
});

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});
