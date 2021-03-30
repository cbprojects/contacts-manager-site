import { Injectable } from '@angular/core';

export var HOST = 'http://localhost:9002';
//export var HOST = 'http://10.176.56.211:9002';
//export var HOST = 'http://192.168.1.15:9002';

export var SYSTEM = 'http://localhost:4200';
//export var SYSTEM = 'http://10.176.56.211:7001';
//export var SYSTEM = 'http://192.168.1.15:4200';

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
      urlContarContactos: `${HOST}/central/contactos/contarContactos`,
      urlConsultarContactosPorFiltros: `${HOST}/central/contactos/consultarContactosPorFiltros`,
      urlCrearContacto: `${HOST}/central/contactos/crearContacto`,
      urlModificarContacto: `${HOST}/central/contactos/modificarContacto`,
      urlLoginUsuario: `${HOST}/central/contactos/loginUsuario`,
      urlRestaurarClave: `${HOST}/central/contactos/restaurarClave`,
      urlModificarClaveUsuario: `${HOST}/central/contactos/modificarClaveUsuario`,
      urlEnviarEmailContacto: `${HOST}/central/contactos/archivos/enviarEmailContacto`,
      correoRemitente: 'eutanasiarockandroll@gmail.com',
      tokenUsernameAUTH: 'BaeneApp',
      tokenPasswordAUTH: 'Baene2021codex',
      tokenNameAUTH: 'access_token',
      codigoADMIN: 'RMRADM',

      // Model rango de fechas para NGBDatePicker
      minDate: { year: 1000, month: 1, day: 1 },
      maxDate: new Date(),
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
  }

  getTokenSesion() {
    return {
      name: '',
      token: ''
    }
  }

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

  getDataImagenGalleria(nombreImagen, rutaImagen) {
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
      procesoContacto: 0,

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
}