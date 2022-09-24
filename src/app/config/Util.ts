import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SesionService } from '../services/sesionService/sesion.service';
import { Enumerados } from './Enumerados';
import { Functions } from './Functions';
import { ObjectModelInitializer } from './ObjectModelInitializer';
import { TextProperties } from './TextProperties';

declare var $: any;

export var objs: any;

@Injectable()
export class Util {
  msg: any;
  mensaje: any;
  const: any;
  enums: any;
  modeloTablas: any;
  func: any;
  usuarioEjemplo: any;

  constructor(public textProperties: TextProperties, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, dataFunctions: Functions, private messageService: MessageService) {
    this.mensaje = this.objectModelInitializer.getDataMessage();
    this.const = this.objectModelInitializer.getConst();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.func = dataFunctions;
    this.enums = this.enumerados.getEnumerados();
    this.modeloTablas = this.objectModelInitializer.getDataModeloTablas();
  }

  cargarMatrizPorcentajeUri() {
    // SÍMBOLOS URI
    let listaRefPorcentajesUri = [];

    //%20	%21	%22	%23	%24	%25	%26	%27	%28	%29	
    //     !   "	 #	 $	 %   &	 '	 (	 )
    let ESPACIO = this.objectModelInitializer.getDataPorcentajeURIWeb('%20', ' ');
    let CIERRA_ADMIRACION = this.objectModelInitializer.getDataPorcentajeURIWeb('%21', '!');
    let COMILLA_DOBLE = this.objectModelInitializer.getDataPorcentajeURIWeb('%22', '\"');
    let NUMERAL = this.objectModelInitializer.getDataPorcentajeURIWeb('%23', '#');
    let DOLAR = this.objectModelInitializer.getDataPorcentajeURIWeb('%24', '$');
    let PORCENTAJE = this.objectModelInitializer.getDataPorcentajeURIWeb('%25', '%');
    let AMPER = this.objectModelInitializer.getDataPorcentajeURIWeb('%26', '&');
    let COMILLA_SIMPLE = this.objectModelInitializer.getDataPorcentajeURIWeb('%27', '\'');
    let ABRE_PARENTESIS = this.objectModelInitializer.getDataPorcentajeURIWeb('%28', '(');
    let CIERRA_PARENTESIS = this.objectModelInitializer.getDataPorcentajeURIWeb('%29', ')');
    listaRefPorcentajesUri.push(ESPACIO);
    listaRefPorcentajesUri.push(CIERRA_ADMIRACION);
    listaRefPorcentajesUri.push(COMILLA_DOBLE);
    listaRefPorcentajesUri.push(NUMERAL);
    listaRefPorcentajesUri.push(DOLAR);
    listaRefPorcentajesUri.push(PORCENTAJE);
    listaRefPorcentajesUri.push(AMPER);
    listaRefPorcentajesUri.push(COMILLA_SIMPLE);
    listaRefPorcentajesUri.push(ABRE_PARENTESIS);
    listaRefPorcentajesUri.push(CIERRA_PARENTESIS);

    //%2A	%2B %2C	%2D	%2E	%2F	
    // *	 +   ,	 -   .   /
    let ASTERISCO = this.objectModelInitializer.getDataPorcentajeURIWeb('%2A', '*');
    let SIGNO_MAS = this.objectModelInitializer.getDataPorcentajeURIWeb('%2B', '+');
    let COMA = this.objectModelInitializer.getDataPorcentajeURIWeb('%2C', ',');
    let SIGNO_MENOS = this.objectModelInitializer.getDataPorcentajeURIWeb('%2D', '-');
    let PUNTO = this.objectModelInitializer.getDataPorcentajeURIWeb('%2E', '.');
    let SLASH = this.objectModelInitializer.getDataPorcentajeURIWeb('%2F', '/');
    listaRefPorcentajesUri.push(ASTERISCO);
    listaRefPorcentajesUri.push(SIGNO_MAS);
    listaRefPorcentajesUri.push(COMA);
    listaRefPorcentajesUri.push(SIGNO_MENOS);
    listaRefPorcentajesUri.push(PUNTO);
    listaRefPorcentajesUri.push(SLASH);

    //%3A	%3B	%3C	%3D	%3E	%3F	%40
    // :	 ;	 <   =	 >   ?	 @
    let DOS_PUNTOS = this.objectModelInitializer.getDataPorcentajeURIWeb('%3A', ':');
    let PUNTO_COMA = this.objectModelInitializer.getDataPorcentajeURIWeb('%3B', ';');
    let MENOR_QUE = this.objectModelInitializer.getDataPorcentajeURIWeb('%3C', '<');
    let SIGNO_IGUAL = this.objectModelInitializer.getDataPorcentajeURIWeb('%3D', '=');
    let MAYOR_QUE = this.objectModelInitializer.getDataPorcentajeURIWeb('%3E', '>');
    let CIERRA_PREGUNTA = this.objectModelInitializer.getDataPorcentajeURIWeb('%3F', '?');
    let ARROBA = this.objectModelInitializer.getDataPorcentajeURIWeb('%40', '@');
    listaRefPorcentajesUri.push(DOS_PUNTOS);
    listaRefPorcentajesUri.push(PUNTO_COMA);
    listaRefPorcentajesUri.push(MENOR_QUE);
    listaRefPorcentajesUri.push(SIGNO_IGUAL);
    listaRefPorcentajesUri.push(MAYOR_QUE);
    listaRefPorcentajesUri.push(CIERRA_PREGUNTA);
    listaRefPorcentajesUri.push(ARROBA);

    // ACENTOS
    let TILDE_A = this.objectModelInitializer.getDataPorcentajeURIWeb('%C3%A1', 'á');
    let TILDE_E = this.objectModelInitializer.getDataPorcentajeURIWeb('%C3%A9', 'é');
    let TILDE_I = this.objectModelInitializer.getDataPorcentajeURIWeb('%ED', 'í');
    let TILDE_O = this.objectModelInitializer.getDataPorcentajeURIWeb('%F3', 'ó');
    let TILDE_U = this.objectModelInitializer.getDataPorcentajeURIWeb('%FA', 'ú');
    listaRefPorcentajesUri.push(TILDE_A);
    listaRefPorcentajesUri.push(TILDE_E);
    listaRefPorcentajesUri.push(TILDE_I);
    listaRefPorcentajesUri.push(TILDE_O);
    listaRefPorcentajesUri.push(TILDE_U);

    //%5B	%5D %5C	%5E	%5F	%60	%7B	%7C	%7D	%7E	%C2%B4
    // [	 ]   \	 ^	 _   `	 { 	 |	 }	 ~ 	  ´  
    let ABRE_LLAVE_ANGULAR = this.objectModelInitializer.getDataPorcentajeURIWeb('%5B', '[');
    let CIERRA_LLAVE_ANGULAR = this.objectModelInitializer.getDataPorcentajeURIWeb('%5D', ']');
    let SLASH_INVERTIDO = this.objectModelInitializer.getDataPorcentajeURIWeb('%5C', '\\');
    let CIRCUNFLEJO = this.objectModelInitializer.getDataPorcentajeURIWeb('%5E', '^');
    let GUION_BAJO = this.objectModelInitializer.getDataPorcentajeURIWeb('%5F', '_');
    let ACENTO_INVERTIDO = this.objectModelInitializer.getDataPorcentajeURIWeb('%60', '`');
    let ABRE_LLAVE = this.objectModelInitializer.getDataPorcentajeURIWeb('%7B', '{');
    let PIPE = this.objectModelInitializer.getDataPorcentajeURIWeb('%7C', '|');
    let CIERRA_LLAVE = this.objectModelInitializer.getDataPorcentajeURIWeb('%7D', '}');
    let APROXIMADO = this.objectModelInitializer.getDataPorcentajeURIWeb('%7E', '~');
    let ACENTO = this.objectModelInitializer.getDataPorcentajeURIWeb('%C2%B4', '´');
    listaRefPorcentajesUri.push(ABRE_LLAVE_ANGULAR);
    listaRefPorcentajesUri.push(CIERRA_LLAVE_ANGULAR);
    listaRefPorcentajesUri.push(SLASH_INVERTIDO);
    listaRefPorcentajesUri.push(CIRCUNFLEJO);
    listaRefPorcentajesUri.push(GUION_BAJO);
    listaRefPorcentajesUri.push(ACENTO_INVERTIDO);
    listaRefPorcentajesUri.push(ABRE_LLAVE);
    listaRefPorcentajesUri.push(PIPE);
    listaRefPorcentajesUri.push(CIERRA_LLAVE);
    listaRefPorcentajesUri.push(APROXIMADO);
    listaRefPorcentajesUri.push(ACENTO);

    return listaRefPorcentajesUri;
  }

  transformarSimboloUri(uriSimbolos: string, listaRefPorcentajesUri: any[]) {
    for (let uriObject of listaRefPorcentajesUri) {
      uriSimbolos = uriSimbolos.split(uriObject.codigo).join(uriObject.simbolo);
    }

    return uriSimbolos;
  }

  limpiarExcepcion() {
    console.clear;
    this.messageService.clear();
  }

  actualizarLista(listaRemover: any[], listaActualizar: any[]) {
    if (listaRemover.length <= 0) {
      return listaActualizar;
    }
    let nuevaLista: any[] = [];
    let lista = listaRemover;
    listaActualizar.forEach(function (element: any, index: number) {
      if (listaRemover.indexOf(index) < 0) {
        nuevaLista.push(element);
      }
    })
    return nuevaLista;
  }

  llenarListaRemover(listaRemover: any[], indiceLista: number) {
    let p = listaRemover.indexOf(indiceLista)
    if (p < 0) {
      listaRemover.push(indiceLista);
    } else {
      delete listaRemover[p];
    }
  }

  readOnlyXphase(listaPhases: any[]) {
    if (listaPhases === null || listaPhases.length <= 0) {
      return false;
    }
    for (let item in listaPhases) {
      if (listaPhases[item].toString().toUpperCase() === this.sesionService.objServiceSesion.phase.toString().toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  visebleXphase(listaPhases: any[]) {
    if (listaPhases === null || listaPhases.length <= 0) {
      return false;
    }
    for (let item in listaPhases) {
      if (listaPhases[item].toString().toUpperCase() === this.sesionService.objServiceSesion.phase.toString().toUpperCase()) {
        return true;
      }
    }
    return false;
  }

  limpiarConsolaStorage() {
    localStorage.clear();
    console.clear();
    return true;
  }

  getEnumValString(array: any[]) {
    let lis = [];
    for (let ind in array) {
      let obj = { value: 0, label: '' };
      obj.value = array[ind].value.toString();
      obj.label = array[ind].label;
      lis.push(obj);
    }
    return lis;
  }

  getEmunName(enumerado: any[], id: number) {
    let name = '';
    enumerado.forEach(function (obj) {
      if (obj.value === id) {
        name = obj.label;
      }
    })
    return name;
  }

  getValorEnumerado(enumerado: any, id: number) {
    let valor = { value: 0, label: '' };

    for (let obj of enumerado) {
      if (obj.value === id) {
        valor = obj;
        break;
      }
    }

    return valor;
  }

  getLabelEnumerado(enumerado: any, idLabel: string) {
    let valor = { value: 0, label: '' };

    for (let obj of enumerado) {
      if (obj.label === idLabel) {
        valor = obj;
        break;
      }
    }

    return valor;
  }

  //mostrar o ocultar un modal
  ocultarMostrarModal(idModal: string, cuerpoModal: string) {
    if (cuerpoModal !== null) {
      this.cambiarTextoModal(idModal, cuerpoModal)
    }
    this.classToggleModalParam(idModal);
  }
  classToggleModal(idModal: string) {
    $('#' + idModal).toggleClass('show');
    $('#' + idModal).toggleClass('modalVisible');
  }
  classToggleModalParam(id: string) {
    $('#' + id).toggleClass('show');
    $('#' + id).toggleClass('modalVisible');
    return true;
  }
  tipoDeVariable(obj: any) {
    try {
      let x = ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/);
      if (x) {
        return x[1].toLowerCase();
      } else {
        return "Type not mapped";
      }
    } catch (e) {
      return "Type not mapped";
    }
  }
  cambiarTextoModal(idModal: string, cuerpoModal: string) {
    $('#' + idModal + ' .replc').html(function (reemplaza: string) {
      return reemplaza.replace('XXX', cuerpoModal);
    });
  }

  clonarObj(obj: any) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = this.clonarObj(obj[key]);
    }

    return temp;
  }

  abrirNav(event: any) {
    let element = $(event.target);
    while (element.get(0).tagName.toString().toUpperCase() !== 'LI') {
      element = $(element).parent();
    }
    element.toggleClass('open');
  }

  abrirDropMenu(event: any) {
    let element = $(event.target);
    let isOpened = element.get(0).getAttribute('aria-expanded');
    if (isOpened === 'true') {
      element.get(0).setAttribute('aria-expanded', false);
    }
    else {
      element.get(0).setAttribute('aria-expanded', true);
    }
    $(element).parent().toggleClass('open');
  }

  abrirDropButton(event: any) {
    let element = $(event.target);

    while (element.get(0).tagName.toString().toUpperCase() !== 'BUTTON') {
      element = $(element).parent();
    }
    let isOpened = element.get(0).getAttribute('aria-expanded');
    if (isOpened === 'true') {
      element.get(0).setAttribute('aria-expanded', false);
    }
    else {
      element.get(0).setAttribute('aria-expanded', true);
    }
    element.parent().toggleClass('open');
  }

  getUrlActual() {
    let url = window.location.href.toString();
    return url.split('4200')[1];
  }

  showPopUpById(id: string) {
    $('#' + id).fadeIn();
    $('#' + id).toggleClass('in');
    $('body').append($('<div>', { class: 'modal-backdrop fade in' }));
  }

  hidePopUpById(id: string) {
    $('#' + id).fadeOut();
    $('#' + id).toggleClass('in');
    $('.modal-backdrop').remove();
  }

  // Función que arma el enumerado de Ubicaciones desde la lista
  obtenerEnumeradoDeListaUbicacion(lista: any[], tipoUbicacion: number) {
    let enumerado = [];
    for (let i in lista) {
      let ubicacion = lista[i];
      let nombreUbicacion = tipoUbicacion === 0 ? ubicacion.nombrePais : (tipoUbicacion === 1 ? ubicacion.nombreDepartamento + ' - (' + ubicacion.nombrePais + ')' : ubicacion.nombreCiudad + ' - (' + ubicacion.nombreDepartamento + ')');
      let enumObj = { value: ubicacion, label: nombreUbicacion };
      enumerado.push(enumObj);
    }

    return enumerado;
  }

  // Función que arma el enumerado de Terceros desde la lista
  obtenerEnumeradoDeListaTercero(lista: any[]) {
    let enumerado = [];
    for (let i in lista) {
      let tercero = lista[i];
      let nombreTercero = tercero.razonSocial;
      let enumObj = { value: tercero, label: nombreTercero };
      enumerado.push(enumObj);
    }

    return enumerado;
  }

  // Función que arma el model de las tablas de la aplicación
  armarTabla(cabeceras: any[], lista: any[]) {
    let cols = [];

    if (lista !== null && lista.length > 0) {
      let rows = Object.keys(lista[0]);
      for (let j in rows) {
        for (let c in cabeceras) {
          let head = cabeceras[c];
          let campo = rows[j].toString();
          if (head.campoLista === campo) {
            let obj = { field: '', header: '' };
            Object.assign(this.modeloTablas, obj);
            obj.header = head.nombreCabecera;
            obj.field = campo;

            cols.push(obj);
          }
        }
      }
    }

    return cols;
  }

  // Funcion que muestra notificaciones de errores, advertencias o informativos
  mostrarNotificacion(exc: any) {
    let listaMensajes: any = [];
    if (exc !== null && exc.mensaje !== null && typeof exc.mensaje !== 'undefined' && exc.mensaje.length > 0) {
      let title = exc.mensaje.split(":")[0];
      let validaciones = exc.mensaje.split(":")[1].split("<br>");

      let mensajeTitulo = { severity: '', summary: '', detail: '', sticky: true };
      Object.assign(this.mensaje, mensajeTitulo);
      mensajeTitulo.severity = title.length > 0 ? this.const.severity[2] : this.const.severity[3];
      mensajeTitulo.summary = title.length > 0 ? this.msg.lbl_summary_warning : this.msg.lbl_summary_unknown_danger;
      mensajeTitulo.detail = title.length > 0 ? title : this.msg.lbl_mensaje_sin_detalles_error;
      listaMensajes.push(mensajeTitulo);

      for (let valid of validaciones) {
        let validacion = valid.trim();
        if (validacion.length > 0) {
          let campo = validacion.split("-")[0];
          let mensaje = validacion.split("-")[1];

          let msgValidacion = { severity: '', summary: '', detail: '', sticky: true };
          Object.assign(this.mensaje, msgValidacion);
          msgValidacion.severity = mensajeTitulo.severity;
          msgValidacion.summary = campo;
          msgValidacion.detail = mensaje;
          listaMensajes.push(msgValidacion);
        }
      }
    }
    else {
      return [{ severity: this.const.severity[3], summary: this.msg.lbl_summary_danger, detail: this.msg.lbl_mensaje_no_conexion_servidor, sticky: true }];
    }

    let audio = new Audio();
    audio.src = "assets/audio/guitarBad.mp3";
    audio.load();
    audio.play();

    return listaMensajes;
  }

  // Reproducir sonido error
  playError() {
    let audio = new Audio();
    audio.src = "assets/audio/guitarBad.mp3";
    fetch('assets/audio/guitarBad.mp3')
      .then(response => response.blob())
      .then(blob => {
        audio.load();
        return audio.play();
      })
      .then(_ => {
        console.log('Video playback started');
      })
      .catch(e => {
        console.log('Video playback failed');
      });
  }

  // Función para obtener el objeto ubicacion de una lista con el Id que está en un combo
  obtenerUbicacionDeEnum(idUbicacionEnum: number, listaUbicaciones: any[]) {
    let ubicacion: any;
    for (let i in listaUbicaciones) {
      let ubi = listaUbicaciones[i];
      if (ubi.idUbicacion === idUbicacionEnum) {
        ubicacion = ubi;
        break;
      }
    }
    return ubicacion;
  }

  // Función para obtener el objeto ubicacion de una lista con el código
  obtenerUbicacionPorCodigo(codigoUbicacion: string, listaUbicaciones: any[], tipoUbicacion: number) {
    let ubicacion: any;
    let label = "";

    for (let i in listaUbicaciones) {
      let ubi = listaUbicaciones[i];

      if (tipoUbicacion === 0) {
        if (ubi.codigoPais === codigoUbicacion) {
          label = ubi.nombrePais;
          ubicacion = ubi;
          break;
        }
      }
      else if (tipoUbicacion === 1) {
        if (ubi.codigoDepartamento === codigoUbicacion) {
          label = ubi.nombreDepartamento;
          ubicacion = ubi;
          break;
        }
      }
      else if (tipoUbicacion === 2) {
        if (ubi.codigoCiudad === codigoUbicacion) {
          label = ubi.nombreCiudad;
          ubicacion = ubi;
          break;
        }
      }
    }
    return { value: ubicacion, label: label };
  }

  // Función para obtener el objeto Tercero de una lista con el Id que está en un combo
  obtenerTerceroDeEnum(idTerceroEnum: number, listaTerceros: any[]) {
    let tercero: any;
    for (let i in listaTerceros) {
      let ter = listaTerceros[i];
      if (ter.idTercero === idTerceroEnum) {
        tercero = ter;
        break;
      }
    }
    return tercero;
  }

  // Función que permite validar la estructura de un Email de acuerdo a un patrón REGEX
  validarEstructuraEmail(email: string) {
    let emailRegex = new RegExp('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$');

    return emailRegex.test(email);
  }

  // Función para buscar el código de un usuario en una lista de usuarios
  usuarioInLista(usuario: string, listaUsuarios: any[]) {
    let result = false;
    for (let i in listaUsuarios) {
      let user = listaUsuarios[i];
      if (user.usuario === usuario) {
        result = true;
        break;
      }
    }
    return result;
  }

  // Función para buscar el email de un usuario en una lista de usuarios
  emailInLista(email: string, listaUsuarios: any[]) {
    let result = false;
    for (let i in listaUsuarios) {
      let user = listaUsuarios[i];
      if (user.email === email) {
        result = true;
        break;
      }
    }
    return result;
  }

  // Función para buscar el numero de documento y tipo de documento de un usuario en una lista de usuarios
  documentoInLista(tipoDocumento: number, numeroDocumento: string, listaUsuarios: any[]) {
    let result = false;
    for (let i in listaUsuarios) {
      let user = listaUsuarios[i];
      if (user.tipoDocumento === tipoDocumento && user.numeroDocumento === numeroDocumento) {
        result = true;
        break;
      }
    }
    return result;
  }

  // Función que simula un click en un componente dado su ID
  simularClick(id: string) {
    $(`#${id}`).click();
  }

  // Función que copia de uno a otro elemento
  copiarElemento(source: any, target: any) {
    return Object.assign(target, source);
  }

  construirMensajeExcepcion(error: any, summary: string) {
    let listaMensajes = [];

    if (error !== undefined && error !== null && error.mensaje !== undefined && error.mensaje !== null) {
      // Extraemos por el split de mensajes |
      let listaErrores = error.mensaje.split('|');
      listaErrores.forEach((errorMSG: string) => {
        let mensaje = { severity: '', summary: '', detail: '', sticky: true };
        Object.assign(this.mensaje, mensaje);
        mensaje.severity = this.const.severity[3];
        mensaje.summary = summary;
        mensaje.detail = errorMSG;
        if (errorMSG.length > 0) {
          listaMensajes.push(mensaje);
        }
      });
    } else {
      let mensaje = { severity: '', summary: '', detail: '', sticky: true };
      mensaje.severity = this.const.severity[3];
      mensaje.summary = summary;
      mensaje.detail = this.msg.lbl_mensaje_sin_detalles_error;
      listaMensajes.push(mensaje);
    }
    return listaMensajes;
  }

  soloNumeros(e: any) {
    let key = window.Event ? e.which : e.keyCode;
    return (key >= 37 && key <= 40) || (key >= 48 && key <= 57) || (key === 46) || (key === 8) || (e.shiftKey === 1);
  }

  toggleMenu() {
    $('#toggleMenuMobile').click();
  }
}