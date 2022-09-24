import { Injectable } from '@angular/core';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { ConceptoFacturaModel } from 'src/app/model/concepto-factura-model';
import { ContactoModel } from 'src/app/model/contacto-model';
import { FacturaConsultaDTOModel } from 'src/app/model/dto/factura-consulta-dto';
import { EmpresaModel } from 'src/app/model/empresa-model';
import { TareaModel } from 'src/app/model/tarea-model';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SesionService {
  // Fases
  objServiceSesion: any;
  objContactoCargado: ContactoModel | undefined;
  objEmpresaCargado: EmpresaModel | undefined;
  objTareaCargado: TareaModel | undefined;
  objFacturaCargado: FacturaConsultaDTOModel | undefined;
  objConceptoFacturaCargado: ConceptoFacturaModel | undefined;
  contactoEnSesionTB: ContactoModel | undefined;
  usuarioRestaurarClave: any;
  esLogueado: boolean = false;

  constructor(public objectModelInitializer: ObjectModelInitializer) {
    this.inicializar();
    if (localStorage.getItem('objServiceSesion') !== undefined && localStorage.getItem('objServiceSesion') !== null) {
      this.objServiceSesion = JSON.parse(JSON.stringify(localStorage.getItem('objServiceSesion')));
    }
  }

  inicializar() {
    this.objContactoCargado = undefined;
    this.objEmpresaCargado = undefined;
    this.objTareaCargado = undefined;
    this.objFacturaCargado = undefined;
    this.objConceptoFacturaCargado = undefined;

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
