import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../.././services/rest.service';
import { MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { TareaModel } from 'src/app/model/tarea-model';
import { TareaDTOModel } from 'src/app/model/dto/tarea-dto';

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
  listaTareas: TareaDTOModel[];

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
    let cerrarSesion = sessionStorage.getItem("cerrarSesion") === "1";
    if (cerrarSesion) {
      this.messageService.clear();
      localStorage.clear();
      sessionStorage.clear();
    }
  }

  ngOnDestroy() {
  }

  inicializar() {
    this.sesionService.objContactoCargado = null;
    this.contarContactos();
    this.cargarTareas();
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
    //$('#toggleMenuMobile').click();
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

  cargarTareas() {
    this.listaTareas = [];
    try {
      let tareaFiltro = this.objectModelInitializer.getDataTareaModel();
      tareaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarTareasPorFiltros, tareaFiltro)
        .subscribe(resp => {
          let listaTemp = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach(temp => {
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
      debugger;
      this.restService.putREST(this.const.urlModificarTarea, tarea)
        .subscribe(resp => {
          let respuesta: TareaModel = JSON.parse(JSON.stringify(resp));
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
            tarea.realizado = false;

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }
}