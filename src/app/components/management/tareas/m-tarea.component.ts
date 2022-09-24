import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { TareaModel } from 'src/app/model/tarea-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

declare var $: any;

@Component({
  selector: 'app-m-tarea',
  templateUrl: './m-tarea.component.html',
  styleUrls: ['./m-tarea.component.scss'],
  providers: [RestService, MessageService]
})

export class MTareaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  tarea: TareaModel | undefined;
  esNuevaTarea: boolean = false;
  habilitarFecha: boolean = false;
  locale: any;

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
    this.tarea = this.objectModelInitializer.getDataTareaModel();
    this.esNuevaTarea = true;
    if (this.sesionService.objTareaCargado !== undefined && this.sesionService.objTareaCargado !== null && this.sesionService.objTareaCargado.idTarea > 0) {
      this.tarea = this.sesionService.objTareaCargado;
      this.esNuevaTarea = false;
      this.tarea.fechaRecordatorio = new Date(this.tarea.fechaRecordatorio);
    }
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[4]).addClass('active');
    if (this.esNuevaTarea) {
      $('.card').bootstrapMaterialDesign();
    }
  }

  crearTarea() {
    try {
      this.restService.postREST(this.const.urlCrearTarea, this.tarea)
        .subscribe(resp => {
          let respuesta: TareaModel = JSON.parse(JSON.stringify(resp));
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

  modificarTarea() {
    try {
      this.restService.putREST(this.const.urlModificarTarea, this.tarea)
        .subscribe(resp => {
          let respuesta: TareaModel = JSON.parse(JSON.stringify(resp));
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
            if (this.tarea && this.tarea.estado === 0) {
              this.tarea.estado = 1;
            }

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  eliminarTarea() {
    if (this.tarea) {
      this.tarea.estado = 0;
      this.tarea.fechaRecordatorio = new Date();
      this.modificarTarea();
    }
  }

  volverConsulta() {
    this.router.navigate(['/q-tarea']);
  }

  habilitarFechaRecordatorio() {
    if (this.tarea) {
      this.tarea.fechaRecordatorio = undefined;
      $('#fechaRecordatorio > span > input')[0].click();
    }
  }

}