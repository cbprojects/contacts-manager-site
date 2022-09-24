import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ConceptoFacturaModel } from 'src/app/model/concepto-factura-model';
import { FacturacionDTOModel } from 'src/app/model/dto/facturacion-dto';
import { ReporteFacturaDTOModel } from 'src/app/model/dto/reporte-factura-dto';
import { RequestFacturacionDTOModel } from 'src/app/model/dto/request-facturacion-dto';
import { ResponseEMailDTOModel } from 'src/app/model/dto/response-email-dto';
import { FacturaModel } from 'src/app/model/factura-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

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
  factura: FacturaModel = this.objectModelInitializer.getDataFacturaModel();
  esNuevaFactura: boolean = false;
  enumTipoFactura: any[] = [];
  listaFacturacion: FacturacionDTOModel[] = [];
  listaConceptos: any;
  valorTotalFactura: any;
  empresaTB: any;
  contactoTB: any;
  enumEmpresas: any[] = [];
  enumContactos: any[] = [];
  pdfSrc: string = '';

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
      this.factura.tipoFactura = this.sesionService.objFacturaCargado.tipoFactura;
      this.esNuevaFactura = false;
    }
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  cargarEnumerados() {
    let enums = this.enumerados.getEnumerados();
    this.enumTipoFactura = enums.tipoFactura.valores;
    this.cargarEmpresas();
    this.cargarContactos();
  }

  cargarValorEnumerado(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, i);
  }

  cargarLabelEnumerado(label: string) {
    return this.util.getLabelEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, label);
  }

  cargarValorConceptoEnumerado(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoConcepto.valores, i);
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[5]).addClass('active');
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
      this.restService.postREST(this.const.urlModificarFactura, facturacionModificar)
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
            this.listaFacturacion.forEach(factDTO => {
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
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: ConceptoFacturaModel) => {
              let conceptoTemp = this.convertirTipoConceptoEnum(temp);
              let enumConcepto = { value: conceptoTemp, label: conceptoTemp.descripcion };
              this.listaConceptos.push(enumConcepto);
            });

            if (this.sesionService.objFacturaCargado !== undefined && this.sesionService.objFacturaCargado !== null) {
              this.sesionService.objFacturaCargado.listaFacturas.forEach(factura => {
                let factDTO: FacturacionDTOModel = this.objectModelInitializer.getDataDTOFacturaModel();
                factDTO.total = factura.valorTotal;
                factDTO.facturaTB = factura;
                this.listaConceptos.forEach((conceptoEnum: { value: { idConcepto: any; }; }) => {
                  if (conceptoEnum.value.idConcepto === factura.conceptoFacturaTB.idConcepto) {
                    factDTO.conceptoTempTB = conceptoEnum;
                  }
                });
                factDTO.facturaTB.conceptoFacturaTB.tipoConcepto = this.cargarValorConceptoEnumerado(factDTO.facturaTB.conceptoFacturaTB.tipoConcepto);
                this.listaFacturacion.push(factDTO);
                this.valorTotalFactura = this.valorTotalFactura + factura.valorTotal;
              });
            }
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

  calcularPrecioTotal(event: any, facturacionDTO: FacturacionDTOModel) {
    if (event === '') {
      facturacionDTO.facturaTB.cantidad = 0;
    } else {
      facturacionDTO.facturaTB.cantidad = parseInt(event);
    }
    facturacionDTO.facturaTB.valorTotal = facturacionDTO.facturaTB.cantidad * facturacionDTO.facturaTB.conceptoFacturaTB.valorUnitario;
    this.valorTotalFactura = 0;
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

  removerItemFactura(i: number) {
    this.listaFacturacion.splice(i, 1);
    this.valorTotalFactura = 0;
    this.listaFacturacion.forEach(fact => {
      this.valorTotalFactura = this.valorTotalFactura + fact.facturaTB.valorTotal;
    });
  }

  cargarConceptoDeTabla(event: any, facturacionDTO: FacturacionDTOModel) {
    facturacionDTO.facturaTB.conceptoFacturaTB = event.value;
    facturacionDTO.facturaTB.valorTotal = facturacionDTO.facturaTB.cantidad * facturacionDTO.facturaTB.conceptoFacturaTB.valorUnitario;
    this.valorTotalFactura = 0;
    this.listaFacturacion.forEach(fact => {
      this.valorTotalFactura = this.valorTotalFactura + fact.facturaTB.valorTotal;
    });
  }

  enviarRestEmailFactura() {
    try {
      if (this.contactoTB.value !== -1 && this.empresaTB.value !== -1) {
        // Conversiones de datos
        let reporteFacturaDto: ReporteFacturaDTOModel = this.objectModelInitializer.getDataReporteFacturaDTOModel();
        reporteFacturaDto.numeroFactura = this.factura.numeroFactura;
        reporteFacturaDto.contactoTB = this.objectModelInitializer.getDataContactoModel();
        reporteFacturaDto.contactoTB = this.contactoTB.value;
        reporteFacturaDto.empresaTB = this.objectModelInitializer.getDataEmpresaModel();
        reporteFacturaDto.empresaTB = this.empresaTB.value;

        this.restService.postREST(this.const.urlEnviarEmailFactura, reporteFacturaDto)
          .subscribe(resp => {
            let respuesta: ResponseEMailDTOModel = JSON.parse(JSON.stringify(resp));
            if (respuesta !== null) {
              // Mostrar mensaje de envios de correos exitoso o no
              this.messageService.clear();
              this.messageService.add({ severity: respuesta.exitoso ? this.const.severity[1] : this.const.severity[3], summary: respuesta.exitoso ? this.msg.lbl_summary_succes : this.msg.lbl_summary_danger, detail: respuesta.mensaje, sticky: true });
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
      } else {
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: this.msg.lbl_mensaje_empresa_y_contacto_vacio_para_factura, sticky: true });
      }
    } catch (e) {
      console.log(e);
    }
  }

  cargarEmpresas() {
    let enumVacio = { value: -1, label: this.msg.lbl_enum_generico_valor_vacio };
    this.enumEmpresas = [];
    this.enumEmpresas.push(enumVacio);
    try {
      let empresaFiltro = this.objectModelInitializer.getDataEmpresaModel();
      empresaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarEmpresasPorFiltros, empresaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: { nombre: any; }) => {
              let enumEmpresa = { value: temp, label: temp.nombre };
              this.enumEmpresas.push(enumEmpresa);
            });
            this.empresaTB = this.enumEmpresas[0];
            $($('select#selectEmpresa').siblings()[1]).children()[0].innerHTML = this.empresaTB.label;
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

  cargarContactos() {
    let enumVacio = { value: -1, label: this.msg.lbl_enum_generico_valor_vacio };
    this.enumContactos = [];
    this.enumContactos.push(enumVacio);
    try {
      let contactoFiltro = this.objectModelInitializer.getDataContactoModel();
      contactoFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarContactosPorFiltros, contactoFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: { nombreContacto: any; }) => {
              let enumContacto = { value: temp, label: temp.nombreContacto };
              this.enumContactos.push(enumContacto);
            });
            this.contactoTB = this.enumContactos[0];
            $($('select#selectContacto').siblings()[1]).children()[0].innerHTML = this.contactoTB.label;
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

  generarReporteFactura() {
    try {
      if (this.contactoTB.value !== -1 && this.empresaTB.value !== -1) {
        // Conversiones de datos
        let reporteFacturaDto: ReporteFacturaDTOModel = this.objectModelInitializer.getDataReporteFacturaDTOModel();
        reporteFacturaDto.numeroFactura = this.factura.numeroFactura;
        reporteFacturaDto.contactoTB = this.objectModelInitializer.getDataContactoModel();
        reporteFacturaDto.contactoTB = this.contactoTB.value;
        reporteFacturaDto.empresaTB = this.objectModelInitializer.getDataEmpresaModel();
        reporteFacturaDto.empresaTB = this.empresaTB.value;

        this.restService.postFileREST(this.const.urlGenerarReporteFactura, reporteFacturaDto)
          .subscribe(resp => {
            let data: any = resp;
            console.log(resp, "res");
            let reader = new FileReader();
            reader.onload = (e: any) => {
              console.log(e.target.result);
              this.pdfSrc = e.target.result;
            }
            reader.readAsArrayBuffer(data);
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
      } else {
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: this.msg.lbl_mensaje_empresa_y_contacto_vacio_para_factura, sticky: true });
      }
    } catch (e) {
      console.log(e);
    }
  }

  descargarReporteFactura() {
    try {
      if (this.contactoTB.value !== -1 && this.empresaTB.value !== -1) {
        // Conversiones de datos
        let reporteFacturaDto: ReporteFacturaDTOModel = this.objectModelInitializer.getDataReporteFacturaDTOModel();
        reporteFacturaDto.numeroFactura = this.factura.numeroFactura;
        reporteFacturaDto.contactoTB = this.objectModelInitializer.getDataContactoModel();
        reporteFacturaDto.contactoTB = this.contactoTB.value;
        reporteFacturaDto.empresaTB = this.objectModelInitializer.getDataEmpresaModel();
        reporteFacturaDto.empresaTB = this.empresaTB.value;

        this.restService.postFileREST(this.const.urlGenerarReporteFactura, reporteFacturaDto)
          .subscribe(resp => {
            console.log(resp, "res");
            let data = resp;
            const url = window.URL.createObjectURL(data);
            const a = document.createElement('a');
            a.setAttribute('style', 'display:none');
            a.href = url;
            a.download = 'archivo.pdf';
            a.click();
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
      } else {
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: this.msg.lbl_mensaje_empresa_y_contacto_vacio_para_factura, sticky: true });
      }
    } catch (e) {
      console.log(e);
    }
  }

}