import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { EmpresaModel } from 'src/app/model/empresa-model';

declare var $: any;

@Component({
  selector: 'app-m-empresa',
  templateUrl: './m-empresa.component.html',
  styleUrls: ['./m-empresa.component.scss'],
  providers: [RestService, MessageService]
})

export class MEmpresaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  empresa: EmpresaModel;
  esNuevaEmpresa: boolean;

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
    this.empresa = this.objectModelInitializer.getDataEmpresaModel();
    this.esNuevaEmpresa = true;
    if (this.sesionService.objEmpresaCargado !== undefined && this.sesionService.objEmpresaCargado !== null && this.sesionService.objEmpresaCargado.idEmpresa > 0) {
      this.empresa = this.sesionService.objEmpresaCargado;
      this.esNuevaEmpresa = false;
    }
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[2]).addClass('active');
    if (this.esNuevaEmpresa) {
      $('.card').bootstrapMaterialDesign();
    }
  }

  crearEmpresa() {
    try {
      this.restService.postREST(this.const.urlCrearEmpresa, this.empresa)
        .subscribe(resp => {
          let respuesta: EmpresaModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });

            this.ngOnInit();
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

  modificarEmpresa() {
    try {
      this.restService.putREST(this.const.urlModificarEmpresa, this.empresa)
        .subscribe(resp => {
          let respuesta: EmpresaModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });

            this.volverConsulta();
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
            if (this.empresa.estado === 0) {
              this.empresa.estado = 1;
            }

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  eliminarEmpresa() {
    this.empresa.estado = 0;
    this.modificarEmpresa();
  }

  volverConsulta() {
    this.router.navigate(['/q-empresa']);
  }

}