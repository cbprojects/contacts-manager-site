import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { TareaDTOModel } from 'src/app/model/dto/tarea-dto';
import { UsuarioModel } from 'src/app/model/usuario-model';
import { RestService } from 'src/app/services/rest.service';
import { SesionService } from 'src/app/services/sesionService/sesion.service';

declare var $: any;
declare var reload: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [RestService, MessageService]
})
export class SidebarComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Utilidades
  msg: any;
  const: any;

  displayModalLogin: boolean = false;
  displayModalRestaurar: boolean = false;
  usuario: any = "";
  usuarioRecordar: any = "";
  clave: any = "";
  listaTareas: TareaDTOModel[] = [];

  constructor(private router: Router, private route: ActivatedRoute, public restService: RestService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, private messageService: MessageService) {
    this.sesion = this.objectModelInitializer.getDataServiceSesion();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
  }

  ngOnInit() {
    this.reload();
    this.cargarTareas();
    let user = localStorage.getItem("usuarioSesionContactM");
    if (user !== undefined && user !== null) {
      this.sesionService.objServiceSesion.usuarioSesion = JSON.parse(user);
      this.sesionService.objServiceSesion.esLogueado = true;
    }
  }

  posicionarArriba() {
    $('body,html').animate({
      scrollTop: 0
    }, 600);
  }

  reload() {
    reload();
    console.clear();
  }

  showDialogLogin() {
    this.toggleDropdown('dropdownProfileMobile');
    $('#close-layer').click();
    this.displayModalLogin = true;
  }

  aplicarMDBLogin() {
    setTimeout(() => {
      $('#loginMobile').bootstrapMaterialDesign();
      $('#restaurarClaveMobile').bootstrapMaterialDesign();
    }, 10);
  }

  toggleDropdown(id: string) {
    if (id === 'dropdownProfileMobile' && $('#dropdownNotysMobile').hasClass('show')) {
      $('#dropdownNotysMobile').removeClass('show');
    }
    if (id === 'dropdownNotysMobile' && $('#dropdownProfileMobile').hasClass('show')) {
      $('#dropdownProfileMobile').removeClass('show');
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
            localStorage.setItem("usuarioSesionContactM", JSON.stringify(this.sesionService.objServiceSesion.usuarioSesion));
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
    localStorage.setItem("cerrarSesion", "1");
    $('#cerrar-desktop').click();
    this.router.navigate(['/home']);
  }

  loginEnter(event: any) {
    if (event.keyCode === 13) {
      this.login();
    }
  }

  recordarEnter(event: any) {
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
      usuario.usuario = this.usuarioRecordar;
      this.restService.postREST(this.const.urlRestaurarClave, usuario)
        .subscribe(resp => {
          let respuesta: UsuarioModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });
            this.sesionService.objServiceSesion.usuarioSesion = respuesta;
            localStorage.setItem("usuarioSesionContactM", JSON.stringify(this.sesionService.objServiceSesion.usuarioSesion));
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
    let user = localStorage.getItem("usuarioSesionContactM");
    if (user !== undefined && user !== null && this.sesionService.objServiceSesion.usuarioSesion !== undefined && this.sesionService.objServiceSesion.usuarioSesion !== null) {
      this.sesionService.objServiceSesion.esLogueado = true;
    }
  }

  cargarTareas() {
    this.listaTareas = [];
    try {
      let tareaFiltro = this.objectModelInitializer.getDataTareaModel();
      tareaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarTareasPorFiltros, tareaFiltro)
        .subscribe(resp => {
          let listaTemp: any[] = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach(temp => {
              if (temp.fechaRecordatorio !== undefined && temp.fechaRecordatorio !== null && !temp.realizado) {
                let tareaDTO = this.objectModelInitializer.getDataDTOTareaModel();
                tareaDTO.tareaTB = temp;
                this.listaTareas.push(tareaDTO);
              }
            });
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
}
