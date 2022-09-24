import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { FacturaConsultaDTOModel } from 'src/app/model/dto/factura-consulta-dto';
import { FacturaModel } from 'src/app/model/factura-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

declare var $: any;

@Component({
  selector: 'app-q-factura',
  templateUrl: './q-factura.component.html',
  styleUrls: ['./q-factura.component.scss'],
  providers: [RestService, MessageService]
})

export class QFacturaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  listaFacturas: FacturaModel[] = [];
  listaFacturasConsulta: FacturaConsultaDTOModel[] = [];
  numeroFacturaFiltro: any = "";

  // Utilidades
  msg: any;
  const: any;

  constructor(private router: Router, private route: ActivatedRoute, public restService: RestService, private confirmationService: ConfirmationService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, private messageService: MessageService) {
    this.sesion = this.objectModelInitializer.getDataServiceSesion();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
  }

  ngOnInit() {
    this.inicializar();
  }

  ngOnDestroy() {
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[5]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  inicializar() {
    this.sesionService.objFacturaCargado = undefined;
    this.cargarFacturas();
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  cargarFactura(factura: FacturaConsultaDTOModel) {
    this.sesionService.objFacturaCargado = this.objectModelInitializer.getDataFacturaConsultaDTOModel();
    this.sesionService.objFacturaCargado = factura;
    this.router.navigate(['/m-factura']);
  }

  cargarValorEnumerado(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, i);
  }

  consultarFacturaPorNumero() {
    this.listaFacturas = [];
    this.listaFacturasConsulta = [];
    try {
      let facturaFiltro = this.objectModelInitializer.getDataFacturaModel();
      facturaFiltro.numeroFactura = this.numeroFacturaFiltro;
      this.restService.postREST(this.const.urlConsultarFacturasPorFiltros, facturaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            let listaNumerosFact: any[] = [];

            listaTemp.forEach((temp: FacturaModel) => {
              if (listaNumerosFact.length === 0) {
                let facturaConsultaDTO: FacturaConsultaDTOModel = this.objectModelInitializer.getDataFacturaConsultaDTOModel();
                facturaConsultaDTO.numeroFactura = temp.numeroFactura;
                facturaConsultaDTO.tipoFactura = this.cargarValorEnumerado(temp.tipoFactura);
                facturaConsultaDTO.total = temp.valorTotal;
                facturaConsultaDTO.listaFacturas.push(temp);
                this.listaFacturasConsulta.push(facturaConsultaDTO);
                listaNumerosFact.push(temp.numeroFactura);
              } else {
                if (listaNumerosFact.includes(temp.numeroFactura)) {
                  this.actualizarValorFactConsultaDeList(temp.numeroFactura, temp.valorTotal, temp);
                } else {
                  let facturaConsultaDTO: FacturaConsultaDTOModel = this.objectModelInitializer.getDataFacturaConsultaDTOModel();
                  facturaConsultaDTO.numeroFactura = temp.numeroFactura;
                  facturaConsultaDTO.tipoFactura = this.cargarValorEnumerado(temp.tipoFactura);
                  facturaConsultaDTO.total = temp.valorTotal;
                  facturaConsultaDTO.listaFacturas.push(temp);
                  this.listaFacturasConsulta.push(facturaConsultaDTO);
                  listaNumerosFact.push(temp.numeroFactura);
                }
              }

              this.listaFacturas.push(temp);
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

  cargarFacturas() {
    this.listaFacturas = [];
    this.listaFacturasConsulta = [];
    try {
      let facturaFiltro = this.objectModelInitializer.getDataFacturaModel();
      facturaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarFacturasPorFiltros, facturaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            let listaNumerosFact: any[] = [];

            listaTemp.forEach((temp: FacturaModel) => {
              if (listaNumerosFact.length === 0) {
                let facturaConsultaDTO: FacturaConsultaDTOModel = this.objectModelInitializer.getDataFacturaConsultaDTOModel();
                facturaConsultaDTO.numeroFactura = temp.numeroFactura;
                facturaConsultaDTO.tipoFactura = this.cargarValorEnumerado(temp.tipoFactura);
                facturaConsultaDTO.total = temp.valorTotal;
                facturaConsultaDTO.listaFacturas.push(temp);
                this.listaFacturasConsulta.push(facturaConsultaDTO);
                listaNumerosFact.push(temp.numeroFactura);
              } else {
                if (listaNumerosFact.includes(temp.numeroFactura)) {
                  this.actualizarValorFactConsultaDeList(temp.numeroFactura, temp.valorTotal, temp);
                } else {
                  let facturaConsultaDTO: FacturaConsultaDTOModel = this.objectModelInitializer.getDataFacturaConsultaDTOModel();
                  facturaConsultaDTO.numeroFactura = temp.numeroFactura;
                  facturaConsultaDTO.tipoFactura = this.cargarValorEnumerado(temp.tipoFactura);
                  facturaConsultaDTO.total = temp.valorTotal;
                  facturaConsultaDTO.listaFacturas.push(temp);
                  this.listaFacturasConsulta.push(facturaConsultaDTO);
                  listaNumerosFact.push(temp.numeroFactura);
                }
              }

              this.listaFacturas.push(temp);
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

  actualizarValorFactConsultaDeList(numeroFactura: string, valor: number, factura: any) {
    this.listaFacturasConsulta.forEach(factConsulta => {
      if (factConsulta.numeroFactura === numeroFactura) {
        factConsulta.total = factConsulta.total + valor;
        factConsulta.listaFacturas.push(factura);
      }
    });
  }
}