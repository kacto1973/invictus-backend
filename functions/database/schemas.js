/* 
Aquí estarán todos los esquemas y modelos de la base de datos de MongoDB.
*/

const mongoose = require('./connect');

// Aquí se definen los esquemas de la base de datos
const reactivoSchema = new mongoose.Schema({
  idGabinete: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gabinete', 
    required: true
  },
  idMarca: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marca', 
    required: true
  },
  idUnidadMedida: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnidadMedida', 
    required: true
  },
  estadoFisico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstadoFisico', 
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  esPeligroso: {
    type: Boolean,
    required: true
  },
  cantidad: {
    type: Number,
    min: 0,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  presentacion: {
    type: Number,
    required: true,
    min: 0
  }
});

const gabineteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String
  },
  status: {
    type: Boolean,
    required: true
  }
});

const marcaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  }
});

const unidadMedidaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    enum: ["l", "ml", "kg", "g", "mg"]
  }
});

const estadoFisicoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    enum: ["solido", "liquido"]
  }
});

const reactivoDefectuosoSchema = new mongoose.Schema({
  idReactivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reactivo',
    required: true
  },
  idMotivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Motivo',
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  },
  cantidad: {
    type: Number,
    min: 1,
    required: true
  }
});

const movimientoReactivoSchema = new mongoose.Schema({
  idReactivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reactivo',
    required: true
  },
  idTipoMovimiento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoMovimiento',
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    min: 1,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const tipoMovimientoSchema = new mongoose.Schema({
    nombre: {
      type: String,
      required: true,
      enum: ["salida", "entrada"]
    }
});

const reportesSchema = new mongoose.Schema({
  idTipoReporte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoReporte',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now
  },
  urlReporte: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
});

const tipoReporteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

const notificacionSchema = new mongoose.Schema({
  idTipoNotificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TipoNotificacion',
    required: true
  },
  idEstadoNotificacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EstadoNotificacion',
    required: true
  },
  idReactivo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reactivo'
  },
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo'
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaGeneracion: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    required: true
  }
});

const tipoNoficacionSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    enum: ["reactivoAgotado", "equipoCalendarizado", "actualmenteEnMantenimiento"]
  }
});

const equipoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  urlImagen: {
    type: String,
    required: true
  },
  requiereServicio: {
    type: Boolean,
    required: true
  },
  status: {
    type: Boolean,
    required: true
  }
});

const reservaSchema = new mongoose.Schema({
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
});

const mantenimientoSchema = new mongoose.Schema({
  idEquipo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipo',
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
});

const motivoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    }
});

const estadoNotificacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        enum: ["leido", "noLeido", "eliminado"]
    }
})

// Aquí se crean los modelos a partir de los esquemas
reactivos = mongoose.model("Reactivo", reactivoSchema);
gabinetes = mongoose.model("Gabinete", gabineteSchema);
marcas = mongoose.model("Marca", marcaSchema);
unidadesMedidas = mongoose.model("UnidadMedida", unidadMedidaSchema);
estadosFisicos = mongoose.model("EstadoFisico", estadoFisicoSchema);
reactivosDefectuosos = mongoose.model("ReactivoDefectuoso", reactivoDefectuosoSchema);
movimientosReactivos = mongoose.model("MovimientoReactivo", movimientoReactivoSchema);
tiposMovimientos = mongoose.model("TipoMovimiento", tipoMovimientoSchema);
reportes = mongoose.model("Reporte", reportesSchema);
tiposReportes = mongoose.model("TipoReporte", tipoReporteSchema);
notificaciones = mongoose.model("Notificacion", notificacionSchema);
tiposNotificaciones = mongoose.model("TipoNotificacion", tipoNoficacionSchema);
estadoNotificaciones = mongoose.model("EstadoNotificacion", estadoNotificacionSchema);
equipos = mongoose.model("Equipo", equipoSchema);
reservas = mongoose.model("Reserva", reservaSchema);
mantenimientos = mongoose.model("Mantenimiento", mantenimientoSchema);
motivos = mongoose.model("Motivo", motivoSchema);

// Aquí se exportan los modelos
module.exports = {
  reactivos,
  gabinetes,
  marcas,
  unidadesMedidas,
  estadosFisicos,
  reactivosDefectuosos,
  movimientosReactivos,
  tiposMovimientos,
  reportes,
  tiposReportes,
  notificaciones,
  estadoNotificaciones,
  tiposNotificaciones,
  equipos,
  reservas,
  mantenimientos,
  motivos,
};
