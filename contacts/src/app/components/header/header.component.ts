import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../.././services/rest.service';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { tada, fadeIn } from 'ng-animate';
import { MessageService } from 'primeng/api';
import { UsuarioModel } from 'src/app/model/usuario-model';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [RestService, MessageService],
  animations: [
    trigger('fadeIn', [transition('* => open', useAnimation(fadeIn))])
  ]
})
export class HeaderComponent implements OnInit {
  // Objetos de datos

  // Objetos de Animaciones
  fadeIn: any;
  displayModalLogin: boolean = false;
  displayModalRestaurar: boolean = false;
  usuario: any = "";
  usuarioRecordar: any = "";
  clave: any = "";

  // Utilidades
  msg: any;
  const: any;

  constructor(public router: Router, private route: ActivatedRoute, public restService: RestService, public messageService: MessageService, public textProperties: TextProperties, public objectModelInitializer: ObjectModelInitializer, public sesionService: SesionService, public util: Util) {
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
  }

  ngOnInit() {
    let user = sessionStorage.getItem("usuarioSesion");
    if (user !== undefined && user !== null) {
      this.sesionService.objServiceSesion.usuarioSesion = JSON.parse(user);
      this.sesionService.objServiceSesion.esLogueado = true;
    }
  }

  showDialogLogin() {
    this.toggleDropdown('dropdownProfile');
    this.displayModalLogin = true;
  }

  aplicarMDBLogin() {
    setTimeout(() => {
      $('#login').bootstrapMaterialDesign();
      $('#restaurarClave').bootstrapMaterialDesign();
    }, 10);
  }

  obtenerBreadcrumb(url: string) {
    let ruta = "";
    if (url === '/home') {
      ruta = this.msg.lbl_menu_inicio;
    } else if (url === '/query') {
      ruta = this.msg.lbl_menu_consulta;
    } else if (url === '/management') {
      ruta = this.msg.lbl_menu_gestion;
    } else if (url === '/reports') {
      ruta = this.msg.lbl_menu_reportes;
    } else if (url === '/locations') {
      ruta = this.msg.lbl_menu_ubicaciones;
    } else if (url === '/notys') {
      ruta = this.msg.lbl_menu_notificaciones;
    }

    return ruta;
  }

  toggleDropdown(id) {
    if (id === 'dropdownProfile' && $('#dropdownNotys').hasClass('show')) {
      $('#dropdownNotys').removeClass('show');
    }
    if (id === 'dropdownNotys' && $('#dropdownProfile').hasClass('show')) {
      $('#dropdownProfile').removeClass('show');
    }
    $('#' + id).toggleClass('show');
  }

  login() {
    try {
      let usuario = this.objectModelInitializer.getDataUsuarioModel();
      usuario.usuario = this.usuario;
      usuario.clave = this.clave;
      this.restService.postREST(this.const.urlLoginUsuario, usuario)
        .subscribe(resp => {
          let respuesta: UsuarioModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });
            this.sesionService.objServiceSesion.usuarioSesion = respuesta;
            sessionStorage.setItem("usuarioSesion", JSON.stringify(this.sesionService.objServiceSesion.usuarioSesion));
            this.usuario = "";
            this.clave = "";
            this.sesionService.objServiceSesion.esLogueado = true;
            this.cerrarModalLogin();
            $('.card').bootstrapMaterialDesign();
          }
        },
          error => {
            let listaMensajes = this.util.construirMensajeExcepcion(error.error, this.msg.lbl_summary_danger);
            let titleError = listaMensajes[0];
            listaMensajes.splice(0, 1);
            let mensajeFinal = { severity: titleError.severity, summary: titleError.detail, detail: '', sticky: true };
            this.messageService.clear();

            listaMensajes.forEach(mensaje => {
              mensajeFinal.detail = mensajeFinal.detail + mensaje.detail + " ";
            });
            this.messageService.add(mensajeFinal);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  cerrarModalLogin() {
    this.displayModalLogin = false;
  }

  cerrarModalRestaurar() {
    this.displayModalRestaurar = false;
  }

  cerrarSesion() {
    this.usuario = "";
    this.clave = "";
    this.sesionService.objServiceSesion.usuarioSesion = undefined;
    this.sesionService.objServiceSesion.esLogueado = false;
    sessionStorage.setItem("cerrarSesion", "1");
    $('#cerrar-mobile').click();
    this.router.navigate(['/home']);
  }

  loginEnter(event) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  recordarEnter(event) {
    if (event.keyCode === 13) {
      this.restaurarClaveUsuario();
    }
  }

  irLogin() {
    this.displayModalRestaurar = false;
    this.displayModalLogin = true;
  }

  irRecordarClave() {
    this.displayModalRestaurar = true;
    this.displayModalLogin = false;
  }

  restaurarClaveUsuario() {
    try {
      let usuario = this.objectModelInitializer.getDataUsuarioModel();
      usuario.usuario = this.usuario;
      this.restService.postREST(this.const.urlRestaurarClave, usuario)
        .subscribe(resp => {
          let respuesta: UsuarioModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });
            this.sesionService.objServiceSesion.usuarioSesion = respuesta;
            sessionStorage.setItem("usuarioSesion", JSON.stringify(this.sesionService.objServiceSesion.usuarioSesion));
            this.usuario = "";
            this.clave = "";
            this.sesionService.objServiceSesion.esLogueado = true;
            this.cerrarModalLogin();
            $('.card').bootstrapMaterialDesign();
          }
        },
          error => {
            let listaMensajes = this.util.construirMensajeExcepcion(error.error, this.msg.lbl_summary_danger);
            let titleError = listaMensajes[0];
            listaMensajes.splice(0, 1);
            let mensajeFinal = { severity: titleError.severity, summary: titleError.detail, detail: '', sticky: true };
            this.messageService.clear();

            listaMensajes.forEach(mensaje => {
              mensajeFinal.detail = mensajeFinal.detail + mensaje.detail + " ";
            });
            this.messageService.add(mensajeFinal);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  actualizarLogin() {
    debugger;
    let user = sessionStorage.getItem("usuarioSesion");
    if (user !== undefined && user !== null && this.sesionService.objServiceSesion.usuarioSesion !== undefined && this.sesionService.objServiceSesion.usuarioSesion !== null) {
      this.sesionService.objServiceSesion.esLogueado = true;
    }
  }

}