import { Injectable } from '@angular/core';

//export var HOST = 'http://localhost:9002';
//export var HOST = 'https://10.176.56.211:9002';
export var HOST = 'https://cbaeneprojects.com:8443/CentralContactos';

//export var SYSTEM = 'http://localhost:4200';
//export var SYSTEM = 'https://10.176.56.211:7001';
export var SYSTEM = 'https://www.contact-manager.cbaeneprojects.com';

@Injectable()
export class ObjectModelInitializer {

  constructor() {
  }

  getLocaleESForCalendar() {
    return {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }
  };

  getLocaleENForCalendar() {
    return {
      firstDayOfWeek: 1,
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'Today',
      clear: 'Clear'
    }
  };

  getConst() {
    return {
      // URL'S + Info del Sistema
      urlDomain: `${SYSTEM}/`,
      urlRestService: `${HOST}/`,
      urlRestOauth: `${HOST}/oauth/token`,
      urlVCode: `${SYSTEM}/vCode/`,
      // Usuarios
      urlLoginUsuario: `${HOST}/central/contactos/loginUsuario`,
      urlRestaurarClave: `${HOST}/central/contactos/restaurarClave`,
      urlModificarClaveUsuario: `${HOST}/central/contactos/modificarClaveUsuario`,
      // Archivos
      urlEnviarEmailContacto: `${HOST}/central/contactos/archivos/enviarEmailContacto`,
      urlEnviarEmailContactoCliente: `${HOST}/central/contactos/archivos/emailContactoCliente`,
      urlEnviarEmailFactura: `${HOST}/central/contactos/archivos/enviarEmailFactura`,
      urlGenerarReporteFactura: `${HOST}/central/contactos/reportes/generarReporteFactura`,
      // Contactos
      urlContarContactos: `${HOST}/central/contactos/contarContactos`,
      urlConsultarContactosPorFiltros: `${HOST}/central/contactos/consultarContactosPorFiltros`,
      urlCrearContacto: `${HOST}/central/contactos/crearContacto`,
      urlModificarContacto: `${HOST}/central/contactos/modificarContacto`,
      // Empresas
      urlContarEmpresas: `${HOST}/central/contactos/contarEmpresas`,
      urlConsultarEmpresasPorFiltros: `${HOST}/central/contactos/consultarEmpresasPorFiltros`,
      urlCrearEmpresa: `${HOST}/central/contactos/crearEmpresa`,
      urlModificarEmpresa: `${HOST}/central/contactos/modificarEmpresa`,
      // Tareas
      urlContarTarea: `${HOST}/central/contactos/contarTareas`,
      urlConsultarTareasPorFiltros: `${HOST}/central/contactos/consultarTareasPorFiltros`,
      urlCrearTarea: `${HOST}/central/contactos/crearTarea`,
      urlModificarTarea: `${HOST}/central/contactos/modificarTarea`,
      // Seguimiento
      urlSeguimientoContacto: `${HOST}/central/contactos/seguimientoContacto`,
      urlConsultarIdContactosSeg: `${HOST}/central/contactos/consultarIdContactosSeg`,
      urlCrearSeguimiento: `${HOST}/central/contactos/crearSeguimiento`,
      urlModificarSeguimiento: `${HOST}/central/contactos/modificarSeguimiento`,
      // Facturas
      urlContarFacturas: `${HOST}/central/contactos/contarFacturas`,
      urlConsultarFacturasPorFiltros: `${HOST}/central/contactos/consultarFacturasPorFiltros`,
      urlCrearFactura: `${HOST}/central/contactos/crearFactura`,
      urlModificarFactura: `${HOST}/central/contactos/modificarFactura`,
      urlEliminarFactura: `${HOST}/central/contactos/eliminarFactura`,
      // Conceptos Facturas
      urlContarConceptosFacturas: `${HOST}/central/contactos/contarConceptosFacturas`,
      urlConsultarConceptosFacturasPorFiltros: `${HOST}/central/contactos/consultarConceptosFacturasPorFiltros`,
      urlCrearConceptoFactura: `${HOST}/central/contactos/crearConceptoFactura`,
      urlModificarConceptoFactura: `${HOST}/central/contactos/modificarConceptoFactura`,
      // Otras Parametrizaciones
      tokenRecordarClave: '3vkd3ugAOnnXZGfUER8',
      correoRemitente: 'XXX@gmail.com',
      tokenUsernameAUTH: 'BaeneApp',
      tokenPasswordAUTH: 'Baene2021codex',
      tokenNameAUTH: 'access_token',
      codigoADMIN: 'RMRADM',

      // Model rango de fechas para NGBDatePicker
      minDate: { year: 1000, month: 1, day: 1 },
      maxDate: new Date(),
      actualDate: new Date(),
      formatoFecha: 'dd/mm/yy',
      rangoYears: '1900:3000',

      // Otras Variables
      idiomaEs: 1,
      idiomaEn: 2,
      phaseAdd: 'add',
      phaseDelete: 'delete',
      phaseSearch: 'search',
      phaseEdit: 'edit',
      phasePlus: 'plus',
      tipoCampoTexto: 1,
      tipoCampoEnum: 2,
      disabled: 'disabled',
      readOnly: 'readOnly',
      severity: ['info', 'success', 'warn', 'error'],
      actionModal: { 'show': 1, 'hidde': 2 },
      collectionSize: 0,
      maxSize: 1,
      rotate: true,
      pageSize: 1,
      menuConfiguracion: "C",
      menuAdministracion: "A",
      menuInventario: "I",
      menuAgenda: "G",
      menuMovimientos: "M",
      estadoActivoNumString: 1,
      estadoInactivoNumString: 0
    }
  };

  getDataServiceSesion() {
    return {
      // data
      phase: '',
      usuarioSesion: '',
      usuarioRegister: '',
      tokenSesion: '',
      decodedToken: '',
      expirationDate: '',
      idioma: '',

      // Excepciones
      mensajeError403: '',
      mensajeError404: '',
      mensajeError500: '',

      // Mensajes
      mensajeConfirmacion: ''
    }
  };

  getTokenSesion() {
    return {
      name: '',
      token: ''
    }
  };

  getDataModeloTablas() {
    return {
      // Campo de la tabla
      field: '',
      // Encabezado
      header: ''
    }
  };

  getDataMessage() {
    return {
      // info, success, warning, danger
      severity: '',
      // Title of MSG
      summary: '',
      // Description of MSG
      detail: ''
    }
  };

  getDataImagenGalleria(nombreImagen: string, rutaImagen: string) {
    return {
      previewImageSrc: rutaImagen,
      thumbnailImageSrc: rutaImagen,
      alt: nombreImagen,
      title: nombreImagen
    }
  };

  getDataContactoModel() {
    return {
      idContacto: 0,
      nombreEmpresa: '',
      telefonoEmpresa: '',
      descripcionEmpresa: '',
      nombreContacto: '',
      correoContacto: '',
      cargoContacto: '',
      telefonoContacto: '',
      ciudadContacto: '',
      procesoContacto: 0,
      industria: 0,

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataUsuarioModel() {
    return {
      idUsuario: 0,
      usuario: '',
      clave: '',
      correoUsuario: '',

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataDTOContactoModel() {
    return {
      seleccionado: false,
      contactoTB: this.getDataContactoModel()
    }
  };

  getDataDTOTareaModel() {
    return {
      seleccionado: false,
      tareaTB: this.getDataTareaModel()
    }
  };

  getDataDTOFacturaModel() {
    return {
      total: 0,
      facturaTB: this.getDataFacturaModel(),
      conceptoTempTB: this.getDataEnumerado()
    }
  };

  getDataRequestEmailDtoModel() {
    return {
      desde: '',
      para: [],
      asunto: '',
      parametros: []
    }
  };

  getDataRequestContactoEmailDtoModel() {
    return {
      desde: '',
      destinatarios: [],
      asunto: ''
    }
  };

  getDataRequestContactoXEmpresaEmailDtoModel() {
    return {
      desde: '',
      empresa: this.getDataEmpresaModel(),
      destinatarios: [],
      asunto: '',
      template: ''
    }
  };

  getDataEmpresaModel() {
    return {
      idEmpresa: 0,
      nombre: '',
      telefono: '',
      descripcion: '',
      correo: '',
      paginaWeb: '',
      ciudad: '',
      industria: 0,
      color: '',

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataTareaModel() {
    return {
      idTarea: 0,
      descripcion: '',
      fechaRecordatorio: '',
      realizado: false,

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataFacturaModel() {
    return {
      idFactura: 0,
      numeroFactura: 0,
      conceptoFacturaTB: this.getDataConceptoFacturaModel(),
      tipoFactura: 0,
      cantidad: 0,
      valorTotal: 0,

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataConceptoFacturaModel() {
    return {
      idConcepto: 0,
      codigo: '',
      descripcion: '',
      unidad: '',
      tipoConcepto: '',
      valorUnitario: 0,

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

  getDataEnumerado() {
    return {
      label: '',
      value: 0
    }
  }

  getDataRequestFacturacionDTOModel() {
    return {
      listaFacturacion: [],
      tipoFactura: 0,
      total: 0
    }
  }

  getDataFacturaConsultaDTOModel() {
    return {
      numeroFactura: 0,
      total: 0,
      tipoFactura: {},
      listaFacturas: []
    }
  }

  getDataReporteFacturaDTOModel() {
    return {
      numeroFactura: 0,
      empresaTB: this.getDataEmpresaModel(),
      contactoTB: this.getDataContactoModel()
    }
  }

  getDataPorcentajeURIWeb(code: String, symbol: String) {
    return {
      codigo: code,
      simbolo: symbol
    }
  };

  getDataSeguimientoModel() {
    return {
      idSeguimiento: 0,
      descripcion: '',
      contactoTB: this.getDataContactoModel(),
      fechaSeguimiento: '',
      nivel: 0,

      // Auditoria
      estado: 0,
      fechaCreacion: '',
      fechaActualizacion: '',
      usuarioCreacion: '',
      usuarioActualizacion: ''
    }
  };

}