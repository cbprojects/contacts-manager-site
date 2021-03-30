import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { TextProperties } from './TextProperties';
import { ObjectModelInitializer } from './ObjectModelInitializer';
import { SesionService } from '../services/sesionService/sesion.service';
import { MessageService } from 'primeng/api';

declare var $: any;

@Injectable()
export class Guardian implements CanActivate {
  msg: any;

  constructor(private router: Router, public messageService: MessageService, public objectModelInitializer: ObjectModelInitializer, public textProperties: TextProperties, public sesionService: SesionService) {
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    let URLactual = window.location.href;
    let sesionOK = false;
    let user = sessionStorage.getItem("usuarioSesion");
    if (URLactual.split("#")[1].includes('home') || URLactual.split("#")[1].includes('query') || URLactual.split("#")[1].includes('management') || URLactual.split("#")[1] !== "/") {
      if (user !== undefined && user !== null) {
        let usuarioTB = JSON.parse(user);
        if (usuarioTB.usuario !== undefined && usuarioTB.clave !== undefined && usuarioTB.usuario !== null && usuarioTB.clave !== null) {
          sesionOK = true;
        } else {
          let mensaje = { severity: '', summary: '', detail: '' };
          mensaje.severity = this.objectModelInitializer.getConst().severity[2];
          mensaje.summary = this.msg.lbl_summary_warning;
          mensaje.detail = this.msg.lbl_mensaje_error_500_no_sesion;
          this.messageService.add(mensaje);
          this.router.navigateByUrl('/home');
        }
      } else {
        let mensaje = { severity: '', summary: '', detail: '' };
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