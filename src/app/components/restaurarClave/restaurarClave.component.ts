import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { UsuarioModel } from 'src/app/model/usuario-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../services/rest.service';

declare var $: any;

@Component({
  selector: 'app-restaurar-clave',
  templateUrl: './restaurarClave.component.html',
  styleUrls: ['./restaurarClave.component.scss'],
  providers: [RestService, MessageService]
})

export class RestaurarClaveComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  usuario: UsuarioModel | undefined;
  confirmarClave: string = "";

  // Utilidades
  msg: any;
  const: any;

  constructor(private router: Router, private route: ActivatedRoute, public restService: RestService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, private messageService: MessageService) {
    this.sesion = this.objectModelInitializer.getDataServiceSesion();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
  }

  ngOnInit() {
    this.inicializar();
  }

  ngOnDestroy() {
  }

  inicializar() {
    let URLactual = window.location.href;
    this.usuario = this.objectModelInitializer.getDataUsuarioModel();
    if (URLactual.split('?').length === 2) {
      let variableUser = URLactual.split("#")[1].split("?")[1].split("=")[0];
      let user = URLactual.split("#")[1].split("?")[1].split("=")[1];
      if (user !== undefined && user !== null && variableUser === this.const.tokenRecordarClave) {
        this.usuario.usuario = user;
        this.router.navigate(['/restaurar-clave']);
      }
    }
  }

  ngAfterViewChecked(): void {
    $('.card').bootstrapMaterialDesign();
  }

  restaurarClave() {
    if (this.usuario && this.usuario.clave && this.usuario.clave === this.confirmarClave) {
      try {
        this.usuario.estado = 1;
        this.restService.putREST(this.const.urlModificarClaveUsuario, this.usuario)
          .subscribe(resp => {
            let respuesta: UsuarioModel = JSON.parse(JSON.stringify(resp));
            if (respuesta !== null) {
              // Mostrar mensaje exitoso y consultar comentarios de nuevo
              this.messageService.clear();
              this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });
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
    } else {
      this.messageService.clear();
      this.messageService.add({ severity: this.const.severity[3], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_msg_claves_no_coinciden, sticky: true });
    }

  }

  loginEnter(event: any) {
    if (event.keyCode === 13) {
      this.restaurarClave();
    }
  }
}