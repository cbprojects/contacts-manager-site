import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { FacturaModel } from 'src/app/model/factura-model';
import { ConceptoFacturaModel } from 'src/app/model/concepto-factura-model';
import { FacturacionDTOModel } from 'src/app/model/dto/facturacion-dto';
import { RequestFacturacionDTOModel } from 'src/app/model/dto/request-facturacion-dto';

declare var $: any;

@Component({
  selector: 'app-m-factura',
  templateUrl: './m-factura.component.html',
  styleUrls: ['./m-factura.component.scss'],
  providers: [RestService, MessageService]
})

export class MFacturaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  factura: FacturaModel;
  esNuevaFactura: boolean;
  enumTipoFactura: any[];
  listaFacturacion: FacturacionDTOModel[];
  listaConceptos: any;
  valorTotalFactura: any;

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
    this.listaFacturacion = [];
    this.cargarEnumerados();
    this.cargarConceptos();
    this.valorTotalFactura = 0;
    this.factura = this.objectModelInitializer.getDataFacturaModel();
    this.factura.idFactura = null;
    this.factura.numeroFactura = null;
    this.factura.tipoFactura = this.cargarValorEnumerado(0);
    this.esNuevaFactura = true;
    if (this.sesionService.objFacturaCargado !== undefined && this.sesionService.objFacturaCargado !== null && this.sesionService.objFacturaCargado.numeroFactura > 0) {
      this.factura.numeroFactura = this.sesionService.objFacturaCargado.numeroFactura;
      this.factura.tipoFactura = this.cargarLabelEnumerado(this.sesionService.objFacturaCargado.tipoFactura);
      this.esNuevaFactura = false;
    }
    $('html').removeClass('nav-open');
    $('#toggleMenuMobile').click();
  }

  cargarEnumerados() {
    let enums = this.enumerados.getEnumerados();
    this.enumTipoFactura = enums.tipoFactura.valores;
  }

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, i);
  }

  cargarLabelEnumerado(label) {
    return this.util.getLabelEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, label);
  }

  cargarValorConceptoEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoConcepto.valores, i);
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[4]).addClass('active');
    $('ng-select').niceSelect();
    $($('select#selectTipoFactura').siblings()[1]).children()[0].innerHTML = this.factura.tipoFactura.label;
    if ($('select#selectConceptoFactura').siblings().length > 0) {
      let i = 0;
      let max = this.listaFacturacion.length;
      while (i < max) {
        $($($('select#selectConceptoFactura')[i]).siblings()[0]).children()[0].innerHTML = this.listaFacturacion[i].conceptoTempTB.label;
        i++;
      }
    }
    if (this.esNuevaFactura) {
      $('.card').bootstrapMaterialDesign();
    }
  }

  crearFactura() {
    try {
      let facturacionCrear: RequestFacturacionDTOModel = this.objectModelInitializer.getDataRequestFacturacionDTOModel();
      facturacionCrear.tipoFactura = this.factura.tipoFactura.value;
      facturacionCrear.total = this.valorTotalFactura;
      this.listaFacturacion.forEach(factDTO => {
        factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = factDTO.facturaTB.conceptoFacturaTB.tipoConcepto.value;
        facturacionCrear.listaFacturacion.push(factDTO.facturaTB);
      });
      this.restService.postREST(this.const.urlCrearFactura, facturacionCrear)
        .subscribe(resp => {
          let respuesta: FacturaModel = JSON.parse(JSON.stringify(resp));
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
            this.listaFacturacion.forEach(factDTO => {
              factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = factDTO.facturaTB.conceptoFacturaTB.tipoConcepto.value;
              factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = this.cargarValorConceptoEnumerado(factDTO.facturaTB.conceptoFacturaTB.tipoConcepto);
            });

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  modificarFactura() {
    try {
      let facturacionModificar: RequestFacturacionDTOModel = this.objectModelInitializer.getDataRequestFacturacionDTOModel();
      facturacionModificar.tipoFactura = this.factura.tipoFactura.value;
      facturacionModificar.total = this.valorTotalFactura;
      this.listaFacturacion.forEach(factDTO => {
        factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = factDTO.facturaTB.conceptoFacturaTB.tipoConcepto.value;
        factDTO.facturaTB.numeroFactura = this.factura.numeroFactura;
        facturacionModificar.listaFacturacion.push(factDTO.facturaTB);
      });
      this.restService.postREST(this.const.urlCrearFactura, facturacionModificar)
        .subscribe(resp => {
          let respuesta: FacturaModel = JSON.parse(JSON.stringify(resp));
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
            this.listaFacturacion.forEach(factDTO => {
              factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = factDTO.facturaTB.conceptoFacturaTB.tipoConcepto.value;
              factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = this.cargarValorConceptoEnumerado(factDTO.facturaTB.conceptoFacturaTB.tipoConcepto);
            });

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  eliminarFactura() {
    try {
      this.factura.tipoFactura = this.factura.tipoFactura.value;
      this.restService.putREST(this.const.urlEliminarFactura, this.factura)
        .subscribe(resp => {
          let respuesta: FacturaModel = JSON.parse(JSON.stringify(resp));
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
            this.factura.tipoFactura = this.cargarValorEnumerado(this.factura.tipoFactura);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  volverConsulta() {
    this.router.navigate(['/q-factura']);
  }

  cargarConceptos() {
    this.listaConceptos = [];
    try {
      let conceptoFiltro = this.objectModelInitializer.getDataConceptoFacturaModel();
      conceptoFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarConceptosFacturasPorFiltros, conceptoFiltro)
        .subscribe(resp => {
          let listaTemp = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach(temp => {
              let conceptoTemp = this.convertirTipoConceptoEnum(temp);
              let enumConcepto = { value: conceptoTemp, label: conceptoTemp.descripcion };
              this.listaConceptos.push(enumConcepto);
            });

            this.sesionService.objFacturaCargado.listaFacturas.forEach(factura => {
              let factDTO: FacturacionDTOModel = this.objectModelInitializer.getDataDTOFacturaModel();
              factDTO.total = factura.valorTotal;
              factDTO.facturaTB = factura;
              this.listaConceptos.forEach(conceptoEnum => {
                if (conceptoEnum.value.idConcepto === factura.conceptoFacturaTB.idConcepto) {
                  factDTO.conceptoTempTB = conceptoEnum;
                }
              });
              this.listaFacturacion.push(factDTO);
              this.valorTotalFactura = this.valorTotalFactura + factura.valorTotal;
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

  convertirTipoConceptoEnum(concepto: ConceptoFacturaModel) {
    concepto.tipoConcepto = this.cargarValorEnumerado(concepto.tipoConcepto);
    return concepto;
  }

  calcularPrecioTotal(event, facturacionDTO: FacturacionDTOModel) {
    if (event === '') {
      facturacionDTO.facturaTB.cantidad = 0;
    } else {
      facturacionDTO.facturaTB.cantidad = parseInt(event);
    }
    facturacionDTO.facturaTB.valorTotal = facturacionDTO.facturaTB.cantidad * facturacionDTO.facturaTB.conceptoFacturaTB.valorUnitario;
    this.listaFacturacion.forEach(fact => {
      this.valorTotalFactura = this.valorTotalFactura + fact.facturaTB.valorTotal;
    });
  }

  anadirItemFactura() {
    let facturacionDTO = this.objectModelInitializer.getDataDTOFacturaModel();
    facturacionDTO.facturaTB.conceptoFacturaTB = this.objectModelInitializer.getDataConceptoFacturaModel();
    facturacionDTO.facturaTB.conceptoFacturaTB.descripcion = this.msg.lbl_enum_tipo_concepto_valor_seleccione;
    facturacionDTO.facturaTB = this.objectModelInitializer.getDataFacturaModel();
    facturacionDTO.facturaTB.cantidad = 1;
    facturacionDTO.facturaTB.valorTotal = 0;
    facturacionDTO.conceptoTempTB = { label: this.msg.lbl_enum_tipo_concepto_valor_seleccione, value: 0 };

    this.listaFacturacion.push(facturacionDTO);
  }

  cargarConceptoDeTabla(event, facturacionDTO: FacturacionDTOModel) {
    facturacionDTO.facturaTB.conceptoFacturaTB = event.value;
    facturacionDTO.facturaTB.valorTotal = facturacionDTO.facturaTB.cantidad * facturacionDTO.facturaTB.conceptoFacturaTB.valorUnitario;
    this.listaFacturacion.forEach(fact => {
      this.valorTotalFactura = this.valorTotalFactura + fact.facturaTB.valorTotal;
    });
  }

}