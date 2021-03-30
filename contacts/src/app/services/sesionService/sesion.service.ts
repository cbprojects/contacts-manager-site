import { Injectable } from '@angular/core';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { ContactoModel } from 'src/app/model/contacto-model';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  // Fases
  objServiceSesion: any;
  objContactoCargado: ContactoModel;

  constructor(public objectModelInitializer: ObjectModelInitializer) {
    this.inicializar();
    if (sessionStorage.getItem('objServiceSesion') !== undefined && sessionStorage.getItem('objServiceSesion') !== null) {
      this.objServiceSesion = JSON.parse(sessionStorage.getItem('objServiceSesion'));
    }
  }

  inicializar() {
    this.objContactoCargado = null;

    this.objServiceSesion = this.objectModelInitializer.getDataServiceSesion();
    this.objServiceSesion.phase = undefined;
    this.objServiceSesion.usuarioSesion = undefined;
    this.objServiceSesion.usuarioRegister = undefined;
    this.objServiceSesion.tokenSesion = undefined;
    this.objServiceSesion.decodedToken = undefined;
    this.objServiceSesion.expirationDate = undefined;
    this.objServiceSesion.mensajeError403 = undefined;
    this.objServiceSesion.mensajeError404 = undefined;
    this.objServiceSesion.mensajeError500 = undefined;
    this.objServiceSesion.mensajeConfirmacion = undefined;
    this.objServiceSesion.idioma = this.objectModelInitializer.getConst().idiomaEs;
  }

  getUsuarioSesionActual() {
    let result = null;
    if (typeof this.objServiceSesion.usuarioSesion !== 'undefined' && this.objServiceSesion.usuarioSesion !== null && this.objServiceSesion.usuarioSesion !== 'null') {
      result = this.objServiceSesion.usuarioSesion;
    }
    return result;
  }

  isSesionActiva() {

  }

  tienePermisos(URLactual: String) {
    let resultTienePermisos = false;
    if (this.objServiceSesion.usuarioSesion.usuarioTb !== undefined && this.objServiceSesion.usuarioSesion.usuarioTb !== null && this.objServiceSesion.usuarioSesion.usuarioTb.listaRoles !== undefined && this.objServiceSesion.usuarioSesion.usuarioTb.listaRoles !== null) {
      for (let i in this.objServiceSesion.usuarioSesion.usuarioTb.listaRoles) {
        let rolUsuario = this.objServiceSesion.usuarioSesion.usuarioTb.listaRoles[i];

        if (!URLactual.includes("dashboard")) {
          if (URLactual.includes(rolUsuario.path) || rolUsuario.codigo === this.objectModelInitializer.getConst().codigoADMIN) {
            resultTienePermisos = true;
            break;
          }
        }
        else {
          resultTienePermisos = true;
          break;
        }
      }
    }

    return resultTienePermisos;
  }
}
