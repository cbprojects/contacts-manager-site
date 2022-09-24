import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { TareaModel } from 'src/app/model/tarea-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

declare var $: any;

@Component({
  selector: 'app-q-tarea',
  templateUrl: './q-tarea.component.html',
  styleUrls: ['./q-tarea.component.scss'],
  providers: [RestService, MessageService]
})

export class QTareaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  listaTareas: TareaModel[] = [];
  descripcionFiltro: any = "";
  cols: any[] = [];
  exportColumns: any[] | undefined;

  // Utilidades
  msg: any;
  const: any;
  rows: any;
  enumRows: any[];

  constructor(private router: Router, private route: ActivatedRoute, public restService: RestService, private confirmationService: ConfirmationService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, public sesionService: SesionService, private messageService: MessageService) {
    this.sesion = this.objectModelInitializer.getDataServiceSesion();
    this.msg = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);
    this.const = this.objectModelInitializer.getConst();
    this.enumRows = [5, 10, 25, 50, 100];
  }

  ngOnInit() {
    this.inicializar();
  }

  ngOnDestroy() {
  }

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[4]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  inicializar() {
    let rowsLS = localStorage.getItem("rowsLS");
    if (rowsLS !== undefined && rowsLS !== null) {
      this.rows = parseInt(rowsLS);
    } else {
      this.rows = this.enumRows[0];
    }
    this.sesionService.objTareaCargado = undefined;
    this.cargarTareas();
    $('html').removeClass('nav-open');
    this.cols = [
      { field: 'descripcion', header: this.msg.lbl_table_header_descripcion },
      { field: 'fechaRecordatorio', header: this.msg.lbl_table_header_fecha_recordatorio }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  cargarTarea(tarea: TareaModel) {
    this.sesionService.objTareaCargado = this.objectModelInitializer.getDataTareaModel();
    this.sesionService.objTareaCargado = tarea;
    localStorage.setItem("rowsLS", $('.p-paginator .p-dropdown .p-dropdown-label.p-inputtext')[0].innerHTML.split('<')[0]);
    this.router.navigate(['/m-tarea']);
  }

  cargarTareas() {
    this.listaTareas = [];
    try {
      let tareaFiltro = this.objectModelInitializer.getDataTareaModel();
      tareaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarTareasPorFiltros, tareaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp && listaTemp.length > 0) {
            listaTemp.forEach((temp: TareaModel) => {
              this.listaTareas.push(temp);
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

  formatearFechaTabla(fecha: any) {
    let fechaFormateada = '';

    if (fecha !== undefined && fecha !== null) {
      fechaFormateada = fecha.split('T')[0];
    }

    return fechaFormateada;
  }

  obtenerListaExportar() {
    let listaExportar: TareaModel[] = [];
    if (this.listaTareas !== undefined && this.listaTareas !== null && this.listaTareas.length > 0) {
      this.listaTareas.forEach(tarea => {
        let task = this.objectModelInitializer.getDataTareaModel();
        this.util.copiarElemento(tarea, task);
        task.fechaRecordatorio = this.formatearFechaTabla(tarea.fechaRecordatorio);
        listaExportar.push(task);
      });
    }
    return listaExportar;
  }

  exportPdf() {
    let listaExportar: TareaModel[] = [];
    listaExportar = this.obtenerListaExportar();
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc: any = new jsPDF.default('p', 'pt');
        doc['autoTable'](this.exportColumns, listaExportar,
          {
            styles: { fillColor: [12, 180, 201] },
            headStyles: { halign: 'center', fillColor: [12, 180, 201] },
            bodyStyles: { fillColor: [255, 255, 255] },
            footStyles: { fillColor: [12, 180, 201] },
          }
        );
        doc.save('Contactos_' + new Date().getTime() + '.pdf');
      })
    });
  }

  exportExcel() {
    let listaExportar: TareaModel[] = [];
    listaExportar = this.obtenerListaExportar();
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(listaExportar);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Contactos");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}