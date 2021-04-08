import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { ConceptoFacturaModel } from 'src/app/model/concepto-factura-model';

declare var $: any;

@Component({
  selector: 'app-m-concepto',
  templateUrl: './m-concepto.component.html',
  styleUrls: ['./m-concepto.component.scss'],
  providers: [RestService, MessageService]
})

export class MConceptoFacturaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  concepto: ConceptoFacturaModel;
  esNuevoConcepto: boolean;
  enumTipoConcepto: any[];

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
    this.concepto = this.objectModelInitializer.getDataConceptoFacturaModel();
    this.concepto.tipoConcepto = this.cargarValorEnumerado(0);
    this.concepto.valorUnitario = null;
    this.esNuevoConcepto = true;
    if (this.sesionService.objConceptoFacturaCargado !== undefined && this.sesionService.objConceptoFacturaCargado !== null && this.sesionService.objConceptoFacturaCargado.idConcepto > 0) {
      this.concepto = this.sesionService.objConceptoFacturaCargado;
      this.esNuevoConcepto = false;
    }
    $('html').removeClass('nav-open');
    $('#toggleMenuMobile').click();
  }

  cargarEnumerados() {
    let enums = this.enumerados.getEnumerados();
    this.enumTipoConcepto = enums.tipoConcepto.valores;
  }

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoConcepto.valores, i);
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[3]).addClass('active');
    $('ng-select').niceSelect();
    $($('select#selectTipoConcepto').siblings()[1]).children()[0].innerHTML = this.concepto.tipoConcepto.label;
    if (this.esNuevoConcepto) {
      $('.card').bootstrapMaterialDesign();
    }
  }

  crearConcepto() {
    try {
      this.concepto.tipoConcepto = this.concepto.tipoConcepto.value;
      this.restService.postREST(this.const.urlCrearConceptoFactura, this.concepto)
        .subscribe(resp => {
          let respuesta: ConceptoFacturaModel = JSON.parse(JSON.stringify(resp));
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
            this.concepto.tipoConcepto = this.cargarValorEnumerado(this.concepto.tipoConcepto);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  modificarConcepto() {
    try {
      this.concepto.tipoConcepto = this.concepto.tipoConcepto.value;
      this.restService.putREST(this.const.urlModificarConceptoFactura, this.concepto)
        .subscribe(resp => {
          let respuesta: ConceptoFacturaModel = JSON.parse(JSON.stringify(resp));
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
            this.concepto.tipoConcepto = this.cargarValorEnumerado(this.concepto.tipoConcepto);
            if (this.concepto.estado === 0) {
              this.concepto.estado = 1;
            }

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  eliminarConcepto() {
    this.concepto.estado = 0;
    this.modificarConcepto();
  }

  volverConsulta() {
    this.router.navigate(['/q-concepto']);
  }

}