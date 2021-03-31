import { Injectable } from '@angular/core';
import { Functions } from './Functions';
import { TextProperties } from './TextProperties';
import { ObjectModelInitializer } from './ObjectModelInitializer';
import { Enumerados } from './Enumerados';
import { SesionService } from '../services/sesionService/sesion.service';
import { MessageService } from 'primeng/api';

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

  limpiarExcepcion() {
    console.clear;
    this.messageService.clear();
  }

  actualizarLista(listaRemover, listaActualizar) {
    if (listaRemover.length <= 0) {
      return listaActualizar;
    }
    let nuevaLista = [];
    let lista = listaRemover;
    listaActualizar.forEach(function (element, index) {
      if (listaRemover.indexOf(index) < 0) {
        nuevaLista.push(element);
      }
    })
    return nuevaLista;
  }

  llenarListaRemover(listaRemover, indiceLista) {
    let p = listaRemover.indexOf(indiceLista)
    if (p < 0) {
      listaRemover.push(indiceLista);
    } else {
      delete listaRemover[p];
    }
  }

  readOnlyXphase(listaPhases) {
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

  readOnlyXpermiso(accion) {

    return false;
  }

  visebleXphase(listaPhases) {
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
    sessionStorage.clear();
    sessionStorage.clear();
    console.clear();
    return true;
  }

  getEnum(enumerado) {
    if (enumerado === this.enums.sino.cod) {
      return this.enums.sino.valores;
    } else if (enumerado === this.enums.sexo.cod) {
      return this.enums.sexo.valores;
    } else if (enumerado === this.enums.tipoUsuario.cod) {
      return this.enums.tipoUsuario.valores;
    } else if (enumerado === this.enums.tipoDocumento.cod) {
      return this.enums.tipoDocumento.valores;
    } else if (enumerado === this.enums.tipoUbicacion.cod) {
      return this.enums.tipoUbicacion.valores;
    }

    else if (enumerado === null) {
      return false;
    }
    return false;
  }

  getEnumValString(array) {
    let lis = [];
    for (let ind in array) {
      let obj = { value: 0, label: '' };
      obj.value = array[ind].value.toString();
      obj.label = array[ind].label;
      lis.push(obj);
    }
    return lis;
  }

  getEmunName(enumerado, id) {
    let name = '';
    enumerado.forEach(function (obj) {
      if (obj.value === id) {
        name = obj.label;
      }
    })
    return name;
  }

  getValorEnumerado(enumerado, id) {
    let valor = { value: 0, label: '' };

    for (var obj of enumerado) {
      if (obj.value === id) {
        valor = obj;
        break;
      }
    }

    return valor;
  }

  //mostrar o ocultar un modal
  ocultarMostrarModal(idModal, cuerpoModal) {
    if (cuerpoModal !== null) {
      this.cambiarTextoModal(idModal, cuerpoModal)
    }
    this.classToggleModalParam(idModal);
  }
  classToggleModal(idModal) {
    $('#' + idModal).toggleClass('show');
    $('#' + idModal).toggleClass('modalVisible');
  }
  classToggleModalParam(id) {
    $('#' + id).toggleClass('show');
    $('#' + id).toggleClass('modalVisible');
    return true;
  }
  tipoDeVariable(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }
  cambiarTextoModal(idModal, cuerpoModal) {
    $('#' + idModal + ' .replc').html(function (buscayreemplaza, reemplaza) {
      return reemplaza.replace('XXX', cuerpoModal);
    });
  }

  clonarObj(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    var temp = obj.constructor();
    for (var key in obj) {
      temp[key] = this.clonarObj(obj[key]);
    }

    return temp;
  }

  abrirNav(event) {
    let element = $(event.target);
    while (element.get(0).tagName.toString().toUpperCase() !== 'LI') {
      element = $(element).parent();
    }
    element.toggleClass('open');
  }

  abrirDropMenu(event) {
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

  abrirDropButton(event) {
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

  showPopUpById(id) {
    $('#' + id).fadeIn();
    $('#' + id).toggleClass('in');
    $('body').append($('<div>', { class: 'modal-backdrop fade in' }));
  }

  hidePopUpById(id) {
    $('#' + id).fadeOut();
    $('#' + id).toggleClass('in');
    $('.modal-backdrop').remove();
  }

  // Función que arma el enumerado de Ubicaciones desde la lista
  obtenerEnumeradoDeListaUbicacion(lista, tipoUbicacion) {
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
  obtenerEnumeradoDeListaTercero(lista) {
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
  armarTabla(cabeceras, lista) {
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
  mostrarNotificacion(exc) {
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
  obtenerUbicacionDeEnum(idUbicacionEnum, listaUbicaciones) {
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
  obtenerUbicacionPorCodigo(codigoUbicacion, listaUbicaciones, tipoUbicacion) {
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
  obtenerTerceroDeEnum(idTerceroEnum, listaTerceros) {
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
  validarEstructuraEmail(email) {
    let emailRegex = new RegExp('^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$');

    return emailRegex.test(email);
  }

  // Función para buscar el código de un usuario en una lista de usuarios
  usuarioInLista(usuario, listaUsuarios) {
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
  emailInLista(email, listaUsuarios) {
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
  documentoInLista(tipoDocumento, numeroDocumento, listaUsuarios) {
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
  simularClick(id) {
    document.getElementById(id).click();
  }

  // Función que copia de uno a otro elemento
  copiarElemento(source, target) {
    return Object.assign(target, source);
  }

  construirMensajeExcepcion(error, summary) {
    let listaMensajes = [];

    if (error !== undefined && error !== null && error.mensaje !== undefined && error.mensaje !== null) {
      // Extraemos por el split de mensajes |
      let listaErrores = error.mensaje.split('|');
      listaErrores.forEach(errorMSG => {
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
}