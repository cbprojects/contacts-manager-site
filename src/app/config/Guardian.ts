import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TextProperties } from './TextProperties';
import { ObjectModelInitializer } from './ObjectModelInitializer';
import { SesionService } from '../services/sesionService/sesion.service';
import { MessageService } from 'primeng/api';
import { Util } from './Util';

declare var $: any;

@Injectable()
export class Guardian implements CanActivate {
  msg: any;
  const: any;
  listaRefPorcentajesUri: any[];

  constructor(private router: Router, public messageService: MessageService, public objectModelInitializer: ObjectModelInitializer, public textProperties: TextProperties, public sesionService: SesionService, public util: Util) {
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
    this.listaRefPorcentajesUri = this.util.cargarMatrizPorcentajeUri();
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let URLactual = window.location.href;
    let sesionOK = false;
    let user = localStorage.getItem("usuarioSesionContactM");
    if (URLactual.split("#").length === 1 || URLactual.split("#")[1].includes('home')
      || URLactual.split("#")[1].includes('q-contacto') || URLactual.split("#")[1].includes('m-contacto')
      || URLactual.split("#")[1].includes('q-tarea') || URLactual.split("#")[1].includes('m-tarea')
      || URLactual.split("#")[1].includes('q-factura') || URLactual.split("#")[1].includes('m-factura')
      || URLactual.split("#")[1].includes('q-concepto') || URLactual.split("#")[1].includes('m-concepto')
      || URLactual.split("#")[1].includes('q-empresa') || URLactual.split("#")[1].includes('m-empresa')
      || URLactual.split("#")[1] !== "/") {
      //let URLTransformada = this.util.transformarSimboloUri(URLactual, this.listaRefPorcentajesUri);

      // Contacto
      // if (URLTransformada.split('?').length === 2) {
      //   this.sesionService.contactoEnSesionTB = null;
      //   let variableContacto = URLTransformada.split("#")[1].split("?")[1].split("=")[0];
      //   let contacto: string = URLTransformada.split("#")[1].split("?")[1].split("=")[1];
      //   let contactoTemp = JSON.parse(contacto);
      //   if (contacto !== undefined && contacto !== null && variableContacto === this.const.tokenRecordarClave && contactoTemp.idContacto !== undefined && contactoTemp.idContacto !== null && contactoTemp.idContacto > 0 && contactoTemp.estado !== undefined && contactoTemp.estado !== null && contactoTemp.estado > 0 && contactoTemp.nombreContacto !== undefined && contactoTemp.nombreContacto !== null && contactoTemp.nombreContacto !== '' && contactoTemp.correoContacto !== undefined && contactoTemp.correoContacto !== null && contactoTemp.correoContacto !== '') {
      //     this.sesionService.contactoEnSesionTB = contactoTemp;
      //     this.sesionService.contactoEnSesionTB.fechaActualizacion = '';
      //     this.sesionService.contactoEnSesionTB.fechaCreacion = '';
      //     this.listaRefPorcentajesUri = [];
      //     this.router.navigate(['/home']);
      //   }
      // }

      if (user !== undefined && user !== null) {
        let usuarioTB = JSON.parse(user);
        if (usuarioTB.usuario !== undefined && usuarioTB.clave !== undefined && usuarioTB.usuario !== null && usuarioTB.clave !== null) {
          sesionOK = true;
        } else {
          let mensaje = { severity: '', summary: '', detail: '', sticky: true };
          mensaje.severity = this.objectModelInitializer.getConst().severity[2];
          mensaje.summary = this.msg.lbl_summary_warning;
          mensaje.detail = this.msg.lbl_mensaje_error_500_no_sesion;
          this.messageService.add(mensaje);
          this.router.navigateByUrl('/home');
        }
      } else {
        let mensaje = { severity: '', summary: '', detail: '', sticky: true };
        mensaje.severity = this.objectModelInitializer.getConst().severity[2];
        mensaje.summary = this.msg.lbl_summary_warning;
        mensaje.detail = this.msg.lbl_mensaje_error_500_no_sesion;
        this.messageService.add(mensaje);
        this.router.navigateByUrl('/home');
      }
    } else {
      sesionOK = true;
    }

    return sesionOK;
  }
}