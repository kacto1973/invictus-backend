import { Reactivo, Gabinete, Marca, UnidadMedida, Categoria, EstadoFisico } from "../models/index.js";
import { matchSorter } from "match-sorter";

const consultarReactivos = async (req, res) => {
  try {
    // Parametro de filtrado
    const { nombre } = req.query;

    // Obtener reactivos de la base de datos
    const reactivos = await Reactivo.find({})
      .select("-__v")
      .populate("idGabinete", "nombre -_id")
      .populate("idMarca", "nombre -_id")      
      .populate("idCategoria", "nombre -_id")
      .populate("idEstadoFisico", "nombre -_id")
      .populate("unidadMedida.idUnidadMedida", "nombre -_id")      
      .where({ status: true })
      .lean(); // Convertir documentos a objetos simples

    // Validaciones
    if (!reactivos || reactivos.length === 0) {
      return res.status(404).json({ message: "No se encontraron reactivos" });
    }

    // Filtrar reactivos
    const reactivosFiltrados = nombre
      ? matchSorter(reactivos, nombre.trim(), {
          keys: ["nombre"],
          threshold: matchSorter.rankings.STARTS_WITH,
        })
      : reactivos;

    if (reactivosFiltrados.length === 0) {
      return res.status(404).json({ message: "No se encontraron reactivos con ese nombre" });
    }    

    // Respuesta
    res.status(200).json(reactivosFiltrados);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al consultar los reactivos" });
  }
};

const consultarReactivoPorId = async (req, res) => {
  try {
    // Obtener el ID del reactivo desde los parámetros de la solicitud
    const { id } = req.params;

    // Validaciones
    if (!id) {
      return res.status(400).json({ message: "ID de reactivo no proporcionado" });
    }

    // Buscar el reactivo por ID en la base de datos
    const reactivo = await Reactivo.findById(id)
      .select("-__v")
      .populate("idGabinete", "nombre -_id")
      .populate("idMarca", "nombre -_id")      
      .populate("idCategoria", "nombre -_id")
      .populate("idEstadoFisico", "nombre -_id")
      .populate("unidadMedida.idUnidadMedida", "nombre -_id")
      .where({ status: true });

    // Validaciones
    if (!reactivo) {
      return res.status(404).json({ message: "Reactivo no encontrado" });
    }

    // Respuesta
    res.status(200).json(reactivo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al consultar el reactivo" });
  }
};

const crearReactivo = async (req, res) => {
  try {
    // Obtener los datos del reactivo desde el cuerpo de la solicitud
    const reactivo = new Reactivo(req.body);

    // Validaciones
    if (!reactivo.idGabinete || !reactivo.idMarca || !reactivo.idCategoria) {
      return res.status(400).json({ message: "Faltan datos requeridos para crear el reactivo" });
    }

    const gabineteExistente = await Gabinete.findById(reactivo.idGabinete);
    if (!gabineteExistente) {
      return res.status(404).json({ message: "Gabinete no encontrado" });
    }

    const marcaExistente = await Marca.findById(reactivo.idMarca);
    if (!marcaExistente) {
      return res.status(404).json({ message: "Marca no encontrada" });
    }    

    const idCategoriaExistente = await Categoria.findById(reactivo.idCategoria);
    if (!idCategoriaExistente) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    const idEstadoFisicoExistente = await EstadoFisico.findById(
      reactivo.idEstadoFisico
    );
    if (!idEstadoFisicoExistente) {
      return res.status(404).json({ message: "Estado físico no encontrado" });
    }

    // Validación de cantidad
    if (reactivo.cantidad < 0) {
      return res.status(400).json({ message: "La cantidad no puede ser negativa" });
    }

    if (reactivo.cantidad === undefined) {
      reactivo.cantidad = 0; // Asignar valor por defecto si no se proporciona
    }

    // Validación y asignación de código catálogo
    reactivo.codigoCatalogo = reactivo.codigoCatalogo?.trim() || "N/D";

    if (req.body.unidadMedida && req.body.unidadMedida.valor && req.body.unidadMedida.idUnidadMedida) {
      const unidadMedidaExistente = await UnidadMedida.findById(req.body.unidadMedida.idUnidadMedida);
    
      if (!unidadMedidaExistente) {
        return res.status(404).json({ message: "Unidad de medida no encontrada" });
      }
          
      reactivo.unidadMedida = {
        valor: req.body.unidadMedida.valor,
        idUnidadMedida: req.body.unidadMedida.idUnidadMedida,
      };
    } else {
      return res.status(400).json({ message: "Unidad de medida y su valor son requeridos" });
    }

    // Guardar el reactivo en la base de datos
    await reactivo.save();
    res.status(201).json({ message: "Reactivo creado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el reactivo" });
  }
};

const actualizarReactivo = async (req, res) => {
  try {
    const { id } = req.params;
    const reactivo = await Reactivo.findById(id);

    if (!reactivo) {
      return res.status(404).json({ message: "Reactivo no encontrado" });
    }

    // Validaciones de datos relacionados
    if (req.body.idGabinete) {
      const gabineteExistente = await Gabinete.findById(req.body.idGabinete);
      if (!gabineteExistente) {
        return res.status(404).json({ message: "Gabinete no encontrado" });
      }
    }

    if (req.body.idMarca) {
      const marcaExistente = await Marca.findById(req.body.idMarca);
      if (!marcaExistente) {
        return res.status(404).json({ message: "Marca no encontrada" });
      }
    }

    if (req.body.idUnidadMedida) {
      const unidadMedidaExistente = await UnidadMedida.findById(
        req.body.idUnidadMedida
      );
      if (!unidadMedidaExistente) {
        return res.status(404).json({ message: "Unidad de medida no encontrada" });
      }
    }

    if (req.body.idCategoria) {
      const idCategoriaExistente = await Categoria.findById(
        req.body.idCategoria
      );
      if (!idCategoriaExistente) {
        return res.status(404).json({ message: "Categoria no encontrada" });
      }
    }

    if (req.body.idEstadoFisico) {
      const idEstadoFisicoExistente = await EstadoFisico.findById(
        req.body.idEstadoFisico
      );
      if (!idEstadoFisicoExistente) {
        return res.status(404).json({ message: "Estado físico no encontrado" });
      }
    }

    // Validación de cantidad
    if (req.body.cantidad !== undefined && req.body.cantidad < 0) {
      return res.status(400).json({ message: "La cantidad no puede ser negativa" });
    }

    req.body.codigoCatalogo = req.body.codigoCatalogo?.trim() || "N/D";

    // Validación y asignación de unidad de medida
    if (req.body.unidadMedidaValor && req.body.idUnidadMedida) {
      const unidadMedidaExistente = await UnidadMedida.findById(req.body.idUnidadMedida);
      if (!unidadMedidaExistente) {
        return res.status(404).json({ message: "Unidad de medida no encontrada" });
      }
      req.body.unidadMedida = {
        valor: req.body.unidadMedidaValor,
        id: req.body.idUnidadMedida,
      };
    }

    // Verificar si hay cambios en los datos
    const cambios = {
      idGabinete: req.body.idGabinete || reactivo.idGabinete,
      idMarca: req.body.idMarca || reactivo.idMarca,
      idUnidadMedida: req.body.idUnidadMedida || reactivo.idUnidadMedida,
      idCategoria: req.body.idCategoria || reactivo.idCategoria,
      idEstadoFisico: req.body.idEstadoFisico || reactivo.idEstadoFisico,
      nombre: req.body.nombre || reactivo.nombre,
      codigoCatalogo: req.body.codigoCatalogo || reactivo.codigoCatalogo,
      esPeligroso: req.body.esPeligroso || reactivo.esPeligroso,
      cantidad: req.body.cantidad || reactivo.cantidad,
      unidadMedida: req.body.unidadMedida || reactivo.unidadMedida,
    };

    const noHayCambios = Object.keys(cambios).every(
      (key) => String(cambios[key]) === String(reactivo[key])
    );

    if (noHayCambios) {
      return res.status(400).json({ message: "No se realizaron cambios en el reactivo" });
    }

    // Actualizar reactivo
    Object.keys(cambios).forEach((key) => {
      reactivo[key] = cambios[key];
    });

    await reactivo.save();
    res.status(200).json({ message: "Reactivo actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el reactivo" });
  }
};

const eliminarReactivo = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea un formato válido de MongoDB
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID de reactivo no válido" });
    }

    const reactivo = await Reactivo.findById(id);

    if (!reactivo) {
      return res.status(404).json({ message: "Reactivo no encontrado" });
    }

    // Cambiar el estado a inactivo
    reactivo.status = false;
    await reactivo.save();

    res.status(200).json({ message: "Reactivo eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el reactivo" });
  }
};

export {
  consultarReactivos,
  consultarReactivoPorId,
  crearReactivo,
  actualizarReactivo,
  eliminarReactivo,
};
