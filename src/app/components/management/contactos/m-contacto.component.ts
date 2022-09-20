import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { ContactoModel } from 'src/app/model/contacto-model';

declare var $: any;

@Component({
  selector: 'app-m-contacto',
  templateUrl: './m-contacto.component.html',
  styleUrls: ['./m-contacto.component.scss'],
  providers: [RestService, MessageService]
})

export class MContactoComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  contacto: ContactoModel;
  esNuevoContacto: boolean;
  enumProceso: any[];
  enumIndustria: any[];

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
    this.cargarEnumerados();
    this.contacto = this.objectModelInitializer.getDataContactoModel();
    this.contacto.procesoContacto = this.cargarValorEnumerado(0);
    this.contacto.industria = this.cargarValorEnumeradoIndustria(0);
    this.esNuevoContacto = true;
    if (this.sesionService.objContactoCargado !== undefined && this.sesionService.objContactoCargado !== null && this.sesionService.objContactoCargado.idContacto > 0) {
      this.contacto = this.sesionService.objContactoCargado;
      this.esNuevoContacto = false;
    }
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  cargarEnumerados() {
    let enums = this.enumerados.getEnumerados();
    this.enumProceso = enums.procesoContacto.valores;
    this.enumIndustria = enums.industria.valores;
  }

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().procesoContacto.valores, i);
  }

  cargarValorEnumeradoIndustria(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().industria.valores, i);
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[1]).addClass('active');
    $('ng-select').niceSelect();
    $($('select#selectProceso').siblings()[1]).children()[0].innerHTML = this.contacto.procesoContacto.label;
    $($('select#selectIndustria').siblings()[1]).children()[0].innerHTML = this.contacto.industria.label;
    if (this.esNuevoContacto) {
      $('.card').bootstrapMaterialDesign();
    }
  }

  crearContacto() {
    try {
      this.contacto.procesoContacto = this.contacto.procesoContacto.value;
      this.contacto.industria = this.contacto.industria.value;
      this.restService.postREST(this.const.urlCrearContacto, this.contacto)
        .subscribe(resp => {
          let respuesta: ContactoModel = JSON.parse(JSON.stringify(resp));
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
            this.contacto.procesoContacto = this.cargarValorEnumerado(this.contacto.procesoContacto);
            this.contacto.industria = this.cargarValorEnumeradoIndustria(this.contacto.industria);
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  modificarContacto() {
    try {
      this.contacto.procesoContacto = this.contacto.procesoContacto.value;
      this.contacto.industria = this.contacto.industria.value;
      this.restService.putREST(this.const.urlModificarContacto, this.contacto)
        .subscribe(resp => {
          let respuesta: ContactoModel = JSON.parse(JSON.stringify(resp));
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
            this.contacto.procesoContacto = this.cargarValorEnumerado(this.contacto.procesoContacto);
            this.contacto.industria = this.cargarValorEnumeradoIndustria(this.contacto.industria);
            if (this.contacto.estado === 0) {
              this.contacto.estado = 1;
            }

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  eliminarContacto() {
    this.contacto.estado = 0;
    this.modificarContacto();
  }

  volverConsulta() {
    this.router.navigate(['/q-contacto']);
  }

}