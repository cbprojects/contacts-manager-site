import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, PrimeIcons } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ContactoModel } from 'src/app/model/contacto-model';
import { SeguimientoModel } from 'src/app/model/seguimiento-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

declare var $: any;

@Component({
  selector: 'app-m-seguimiento',
  templateUrl: './m-seguimiento.component.html',
  styleUrls: ['./m-seguimiento.component.scss'],
  providers: [RestService, MessageService]
})

export class MSeguimientoComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  contacto: ContactoModel = this.objectModelInitializer.getDataContactoModel();
  seguimiento: SeguimientoModel[] = [];
  seguimientoModificado: SeguimientoModel = this.objectModelInitializer.getDataSeguimientoModel();
  seguimientoCreado: SeguimientoModel = this.objectModelInitializer.getDataSeguimientoModel();
  enumProceso: any[] = [];
  enumIndustria: any[] = [];
  eventsSeguimiento: any[] = [];
  mostrarPanelCrear: boolean = false;
  mostrarPanelModificar: boolean = false;

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
    this.seguimiento = [];
    this.eventsSeguimiento = [];
    this.cargarEnumerados();
    this.contacto = this.objectModelInitializer.getDataContactoModel();
    this.contacto.procesoContacto = this.cargarValorEnumeradoProcesoContacto(0);
    this.contacto.industria = this.cargarValorEnumeradoIndustria(0);
    if (this.sesionService.objContactoCargado !== undefined && this.sesionService.objContactoCargado !== null && this.sesionService.objContactoCargado.idContacto > 0) {
      this.contacto = this.sesionService.objContactoCargado;
    }
    $('html').removeClass('nav-open');
    this.seguimientoContacto();
  }

  cargarEnumerados() {
    let enums = this.enumerados.getEnumerados();
    this.enumProceso = enums.procesoContacto.valores;
    this.enumIndustria = enums.industria.valores;
  }

  cargarValorEnumeradoProcesoContacto(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().procesoContacto.valores, i);
  }

  cargarValorEnumeradoIndustria(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().industria.valores, i);
  }

  cargarValorEnumeradoNivelSeguimiento(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().nivelSeguimiento.valores, i);
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[2]).addClass('active');
    $('ng-select').niceSelect();
    //$($('select#selectProceso').siblings()[1]).children()[0].innerHTML = this.contacto.procesoContacto.label;
  }

  seguimientoContacto() {
    try {
      this.seguimiento = [];
      this.contacto.procesoContacto = this.contacto.procesoContacto.value;
      this.contacto.industria = this.contacto.industria.value;
      if (this.contacto !== undefined && this.contacto !== null && this.contacto.idContacto > 0) {
        this.restService.postREST(this.const.urlSeguimientoContacto, this.contacto)
          .subscribe(resp => {
            this.seguimiento = JSON.parse(JSON.stringify(resp));

            setTimeout(() => {
              this.eventsSeguimiento = [];
              if (this.seguimiento.length > 0) {
                this.seguimiento.forEach(segui => {
                  let seguimientoCard = { status: this.cargarValorEnumeradoNivelSeguimiento(segui.nivel).label, date: this.formatearFechaTabla(segui.fechaSeguimiento), description: segui.descripcion, icon: this.obtenerIconNivel(segui.nivel), color: this.obtenerColorNivel(segui.nivel), data: segui };
                  this.eventsSeguimiento.push(seguimientoCard);
                });
              }
            }, 10);
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
      }
    } catch (e) {
      console.log(e);
    }
  }

  obtenerColorNivel(i: number) {
    let color = "#000";
    switch (i) {
      case 1:
        color = "#00bcd4";
        break;
      case 2:
        color = "#ff9800";
        break;
      case 3:
        color = "#4caf50";
        break;
      case 4:
        color = "#f44336";
        break;
    }
    return color;
  }

  obtenerIconNivel(i: number) {
    let icon = PrimeIcons.UNDO;
    switch (i) {
      case 1:
        icon = PrimeIcons.PLUS_CIRCLE;
        break;
      case 2:
        icon = PrimeIcons.EXCLAMATION_CIRCLE;
        break;
      case 3:
        icon = PrimeIcons.CHECK_CIRCLE;
        break;
      case 4:
        icon = PrimeIcons.TIMES_CIRCLE;
        break;
    }
    return icon;
  }

  irCrear() {
    this.seguimientoCreado = this.objectModelInitializer.getDataSeguimientoModel();
    this.mostrarPanelCrear = true;
    this.mostrarPanelModificar = false;
  }

  irModificar(seguimiento: SeguimientoModel) {
    this.seguimientoModificado = seguimiento;
    this.mostrarPanelCrear = false;
    this.mostrarPanelModificar = true;
  }

  crearSeguimiento() {
    try {
      this.contacto.procesoContacto = this.contacto.procesoContacto.value;
      this.contacto.industria = this.contacto.industria.value;
      this.seguimientoCreado.contactoTB = this.contacto;
      this.seguimientoCreado.fechaSeguimiento = new Date();
      this.seguimientoCreado.nivel = 1;
      this.restService.postREST(this.const.urlCrearSeguimiento, this.seguimientoCreado)
        .subscribe(resp => {
          this.seguimientoCreado = JSON.parse(JSON.stringify(resp));
          if (this.seguimientoCreado !== null) {
            // Mostrar mensaje exitoso y consultar comentarios de nuevo            
            let segui = this.objectModelInitializer.getDataSeguimientoModel();
            this.util.copiarElemento(this.seguimientoCreado, segui);
            this.seguimiento.push(segui);
            this.mostrarPanelCrear = false;

            setTimeout(() => {
              this.eventsSeguimiento = [];
              if (this.seguimiento.length > 0) {
                this.seguimiento.forEach(segui => {
                  let seguimientoCard = { status: this.cargarValorEnumeradoNivelSeguimiento(segui.nivel).label, date: this.formatearFechaTabla(segui.fechaSeguimiento), description: segui.descripcion, icon: this.obtenerIconNivel(segui.nivel), color: this.obtenerColorNivel(segui.nivel), data: segui };
                  this.eventsSeguimiento.push(seguimientoCard);
                });
              }
            }, 10);


            this.contacto.procesoContacto = this.cargarValorEnumeradoProcesoContacto(this.contacto.procesoContacto);
            this.contacto.industria = this.cargarValorEnumeradoIndustria(this.contacto.industria);
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
            this.contacto.procesoContacto = this.cargarValorEnumeradoProcesoContacto(this.contacto.procesoContacto);
            this.contacto.industria = this.cargarValorEnumeradoIndustria(this.contacto.industria);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  modificarSeguimiento() {
    try {
      this.restService.putREST(this.const.urlModificarSeguimiento, this.seguimientoModificado)
        .subscribe(resp => {
          this.seguimientoModificado = JSON.parse(JSON.stringify(resp));
          if (this.seguimientoModificado !== null) {
            this.mostrarPanelModificar = false;

            setTimeout(() => {
              this.eventsSeguimiento = [];
              if (this.seguimiento.length > 0) {
                this.seguimiento.forEach(segui => {
                  if (segui.idSeguimiento === this.seguimientoModificado.idSeguimiento) {
                    this.util.copiarElemento(this.seguimientoModificado, segui);
                  }
                  let seguimientoCard = { status: this.cargarValorEnumeradoNivelSeguimiento(segui.nivel).label, date: this.formatearFechaTabla(segui.fechaSeguimiento), description: segui.descripcion, icon: this.obtenerIconNivel(segui.nivel), color: this.obtenerColorNivel(segui.nivel), data: segui };
                  this.eventsSeguimiento.push(seguimientoCard);
                });
              }
            }, 10);

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
  }

  actualizarNivel(nivel: any, seguimiento: SeguimientoModel) {
    try {
      this.contacto.procesoContacto = this.contacto.procesoContacto.value;
      this.contacto.industria = this.contacto.industria.value;
      this.seguimientoModificado = seguimiento;
      this.seguimientoModificado.contactoTB = this.contacto;
      this.seguimientoModificado.nivel = nivel;
      this.restService.putREST(this.const.urlModificarSeguimiento, this.seguimientoModificado)
        .subscribe(resp => {
          this.seguimientoModificado = JSON.parse(JSON.stringify(resp));
          if (this.seguimientoModificado !== null) {
            setTimeout(() => {
              this.eventsSeguimiento = [];
              if (this.seguimiento.length > 0) {
                this.seguimiento.forEach(segui => {
                  let seguimientoCard = { status: this.cargarValorEnumeradoNivelSeguimiento(segui.nivel).label, date: this.formatearFechaTabla(segui.fechaSeguimiento), description: segui.descripcion, icon: this.obtenerIconNivel(segui.nivel), color: this.obtenerColorNivel(segui.nivel), data: segui };
                  this.eventsSeguimiento.push(seguimientoCard);
                });
              }
            }, 10);

            this.contacto.procesoContacto = this.cargarValorEnumeradoProcesoContacto(this.contacto.procesoContacto);
            this.contacto.industria = this.cargarValorEnumeradoIndustria(this.contacto.industria);
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
            this.contacto.procesoContacto = this.cargarValorEnumeradoProcesoContacto(this.contacto.procesoContacto);
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

  volverConsulta() {
    this.router.navigate(['/q-seguimiento']);
  }

  cancelarSeguimiento() {
    this.mostrarPanelCrear = false;
    this.mostrarPanelModificar = false;
  }

  aplicarMDBLogin() {
    setTimeout(() => {
      $('#crearSeguimiento').bootstrapMaterialDesign();
      $('#modificarSeguimiento').bootstrapMaterialDesign();
    }, 10);
  }

  formatearFechaTabla(fecha: any) {
    let fechaFormateada = '';

    if (fecha !== undefined && fecha !== null) {
      fechaFormateada = fecha.split('T')[0];
    }

    return fechaFormateada;
  }

}