import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ContactoModel } from 'src/app/model/contacto-model';
import { FacturaConsultaDTOModel } from 'src/app/model/dto/factura-consulta-dto';
import { ReporteFacturaDTOModel } from 'src/app/model/dto/reporte-factura-dto';
import { ResponseEMailDTOModel } from 'src/app/model/dto/response-email-dto';
import { TareaDTOModel } from 'src/app/model/dto/tarea-dto';
import { EmpresaModel } from 'src/app/model/empresa-model';
import { FacturaModel } from 'src/app/model/factura-model';
import { TareaModel } from 'src/app/model/tarea-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../.././services/rest.service';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RestService, MessageService]
})

export class HomeComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  contactosActivos: any;
  empresasActivas: any;
  listaTareas: TareaDTOModel[] = [];
  listaEmpresas: EmpresaModel[] = [];
  contactoEnSesionTB: ContactoModel | undefined = this.objectModelInitializer.getDataContactoModel();
  displayModalFactura: boolean = false;
  empresaSeleccionadaTB: EmpresaModel = this.objectModelInitializer.getDataEmpresaModel();
  listaFacturas: FacturaConsultaDTOModel[] = [];
  numeroFactura: any = 0;

  // Utilidades
  msg: any;
  const: any;

  // Charts
  basicOptions: any;
  dataChart1: any;
  dataChart2: any;
  dataChart3: any;
  dataChart4: any;

  constructor(private router: Router, private route: ActivatedRoute, public restService: RestService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, private messageService: MessageService) {
    this.sesion = this.objectModelInitializer.getDataServiceSesion();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
  }

  ngOnInit() {
    this.inicializar();
    let cerrarSesion = localStorage.getItem("cerrarSesion") === "1";
    if (cerrarSesion) {
      this.messageService.clear();
      localStorage.clear();
    }
  }

  ngOnDestroy() {
  }

  inicializar() {
    // Inicializar objetos cargados de módulos
    this.sesionService.objContactoCargado = undefined;
    this.sesionService.objEmpresaCargado = undefined;
    this.sesionService.objConceptoFacturaCargado = undefined;
    this.sesionService.objFacturaCargado = undefined;
    this.sesionService.objTareaCargado = undefined;

    // Inicializar ContactoHome
    this.contactoEnSesionTB = this.sesionService.contactoEnSesionTB;

    // Funciones
    this.contarContactos();
    this.contarEmpresas();
    this.cargarTareas();
    this.cargarEmpresas();
    this.cargarFacturas();

    // Charts
    this.dataChart1 = {
      labels: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      datasets: [
        {
          label: 'Primera Gráfica',
          data: [8, 12, 4, 13, 17, 14, 33],
          fill: true,
          borderColor: '#FFF',
          backgroundColor: '#ffffff5c'
        }
      ]
    };
    this.dataChart2 = {
      labels: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      datasets: [
        {
          label: 'Segunda Gráfica',
          backgroundColor: '#ffffff5c',
          data: [430, 380, 220, 690, 410, 390, 320, 380, 420, 450, 690, 740]
        }
      ]
    };
    this.dataChart3 = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      datasets: [
        {
          label: 'Tercera Gráfica',
          data: [150, 690, 330, 200, 190, 160, 151, 149],
          fill: false,
          borderDash: [5, 5],
          borderColor: '#FFF'
        }
      ]
    };
    this.dataChart4 = {
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021'],
      datasets: [
        {
          label: 'Cuarta Gráfica',
          backgroundColor: '#ffffff8c',
          data: [21, 14, 39, 45, 42, 19, 59]
        }
      ]
    };
    this.applyLightTheme();
    $('html').removeClass('nav-open');
  }

  applyLightTheme() {
    this.basicOptions = {
      legend: {
        labels: {
          fontColor: '#fff'
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: '#fff'
          }
        }],
        yAxes: [{
          ticks: {
            fontColor: '#fff'
          }
        }]
      }
    };
  }


  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[0]).addClass('active');
  }

  contarContactos() {
    this.contactosActivos = 0;
    try {
      this.restService.getREST(this.const.urlContarContactos)
        .subscribe(resp => {
          this.contactosActivos = JSON.parse(JSON.stringify(resp));
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  contarEmpresas() {
    this.empresasActivas = 0;
    try {
      this.restService.getREST(this.const.urlContarEmpresas)
        .subscribe(resp => {
          this.empresasActivas = JSON.parse(JSON.stringify(resp));
        },
          error => {
            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  cargarTareas() {
    this.listaTareas = [];
    try {
      let tareaFiltro = this.objectModelInitializer.getDataTareaModel();
      tareaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarTareasPorFiltros, tareaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: { idTarea: number; descripcion: string; fechaRecordatorio: string; realizado: boolean; estado: number; fechaCreacion: string; fechaActualizacion: string; usuarioCreacion: string; usuarioActualizacion: string; }) => {
              let tareaDTO = this.objectModelInitializer.getDataDTOTareaModel();
              tareaDTO.tareaTB = temp;
              this.listaTareas.push(tareaDTO);
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

  actualizarTareaRealizada(tarea: TareaModel) {
    try {
      tarea.fechaRecordatorio = new Date();
      this.restService.putREST(this.const.urlModificarTarea, tarea)
        .subscribe(resp => {
          let respuesta: TareaModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo
            this.messageService.clear();
            this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_succes, detail: this.msg.lbl_info_proceso_completo, sticky: true });
            this.cargarTareas();
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
            tarea.realizado = false;

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  cargarEmpresas() {
    this.listaEmpresas = [];
    try {
      let empresaFiltro = this.objectModelInitializer.getDataEmpresaModel();
      empresaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarEmpresasPorFiltros, empresaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: EmpresaModel) => {
              this.listaEmpresas.push(temp);
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

  enviarRestEmailFactura(empresaTB: EmpresaModel) {
    try {
      if (this.contactoEnSesionTB !== undefined && this.contactoEnSesionTB != null && empresaTB !== null && empresaTB !== undefined) {
        // Conversiones de datos
        let reporteFacturaDto: ReporteFacturaDTOModel = this.objectModelInitializer.getDataReporteFacturaDTOModel();
        reporteFacturaDto.numeroFactura = this.numeroFactura;
        reporteFacturaDto.contactoTB = this.objectModelInitializer.getDataContactoModel();
        reporteFacturaDto.contactoTB = this.contactoEnSesionTB;
        reporteFacturaDto.empresaTB = this.objectModelInitializer.getDataEmpresaModel();
        reporteFacturaDto.empresaTB = empresaTB;

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

  aplicarMDB() {
    setTimeout(() => {
      $('#facturacion').bootstrapMaterialDesign();
    }, 10);
  }

  mostrarDialogFactura(empresaTB: EmpresaModel) {
    this.displayModalFactura = true;
    this.empresaSeleccionadaTB = empresaTB;
  }

  cerrarDialogFactura() {
    this.numeroFactura = 0;
    this.displayModalFactura = false;
  }

  solicitarInformacionEmpresa(empresaTB: EmpresaModel) {
    try {
      if (this.contactoEnSesionTB !== undefined && this.contactoEnSesionTB != null && empresaTB !== null && empresaTB !== undefined) {
        // Conversiones de datos
        let reporteFacturaDto: ReporteFacturaDTOModel = this.objectModelInitializer.getDataReporteFacturaDTOModel();
        reporteFacturaDto.numeroFactura = this.numeroFactura;
        reporteFacturaDto.contactoTB = this.objectModelInitializer.getDataContactoModel();
        reporteFacturaDto.contactoTB = this.contactoEnSesionTB;
        reporteFacturaDto.empresaTB = this.objectModelInitializer.getDataEmpresaModel();
        reporteFacturaDto.empresaTB = empresaTB;

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

  cargarFacturas() {
    this.listaFacturas = [];
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
                this.listaFacturas.push(facturaConsultaDTO);
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
                  this.listaFacturas.push(facturaConsultaDTO);
                  listaNumerosFact.push(temp.numeroFactura);
                }
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

  actualizarValorFactConsultaDeList(numeroFactura: string, valor: number, factura: any) {
    this.listaFacturas.forEach(factConsulta => {
      if (factConsulta.numeroFactura === numeroFactura) {
        factConsulta.total = factConsulta.total + valor;
        factConsulta.listaFacturas.push(factura);
      }
    });
  }

  cargarValorEnumerado(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoFactura.valores, i);
  }

  seleccionarFactura(factura: FacturaConsultaDTOModel) {
    this.numeroFactura = factura.numeroFactura;
    $('#facts tr').removeClass('row-selected');
    $('#fact-' + factura.numeroFactura).toggleClass('row-selected');
  }

  getSombra(color: string) {
    return "background: " + color + "; box-shadow: 0 4px 20px 0px rgb(0 0 0 / 14%), 0 7px 10px -5px " + color + ";"
  }
}