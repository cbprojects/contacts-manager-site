import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { ContactoModel } from 'src/app/model/contacto-model';
import { ContactoDTOModel } from 'src/app/model/dto/contacto-dto';
import { ResponseEMailDTOModel } from 'src/app/model/dto/response-email-dto';
import { RequestContactoEMailDTOModel } from 'src/app/model/dto/request-contacto-email-dto';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';

declare var $: any;

@Component({
  selector: 'app-q-contacto',
  templateUrl: './q-contacto.component.html',
  styleUrls: ['./q-contacto.component.scss'],
  providers: [RestService, MessageService]
})

export class QContactoComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  listaContactos: ContactoDTOModel[];
  nombreFiltro: any = "";
  seleccionarTodos: boolean = false;
  mailDTO: RequestContactoEMailDTOModel;
  mailResponseDTO: ResponseEMailDTOModel;
  cols: any[];
  exportColumns: any[];

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
    $($('#menu').children()[1]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  inicializar() {
    this.sesionService.objContactoCargado = null;
    this.cargarContactos();
    this.mailDTO = this.objectModelInitializer.getDataRequestContactoEmailDtoModel();
    this.mailDTO.destinatarios = [];
    $('html').removeClass('nav-open');
    this.cols = [
      { field: 'nombreEmpresa', header: this.msg.lbl_table_header_nombre_empresa },
      { field: 'ciudadContacto', header: this.msg.lbl_table_header_ciudad },
      { field: 'nombreContacto', header: this.msg.lbl_table_header_nombre_contacto },
      { field: 'correoContacto', header: this.msg.lbl_table_header_correo_contacto },
      { field: 'telefonoContacto', header: this.msg.lbl_table_header_telefono },
      { field: 'procesoContacto', header: this.msg.lbl_table_header_proceso }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  cargarContacto(contacto: ContactoModel) {
    this.sesionService.objContactoCargado = this.objectModelInitializer.getDataContactoModel();
    this.sesionService.objContactoCargado = contacto;
    this.router.navigate(['/m-contacto']);
  }

  cargarColorBadge(i) {
    let color = "dark";
    switch (i) {
      case 1:
        color = "secondary";
        break;
      case 2:
        color = "primary";
        break;
      case 3:
        color = "success";
        break;
      case 4:
        color = "danger";
        break;
      case 5:
        color = "warning";
        break;
      case 6:
        color = "info";
        break;
    }
    return color;
  }

  cargarContactos() {
    this.listaContactos = [];
    try {
      let contactoFiltro = this.objectModelInitializer.getDataContactoModel();
      contactoFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarContactosPorFiltros, contactoFiltro)
        .subscribe(resp => {
          let listaContactosTemp = JSON.parse(JSON.stringify(resp));
          if (listaContactosTemp !== undefined && listaContactosTemp.length > 0) {
            listaContactosTemp.forEach(contacto => {
              let contactoTemp = this.convertirProcesoContactoEnum(contacto);
              let contactoDTO = this.objectModelInitializer.getDataDTOContactoModel();
              contactoDTO.contactoTB = contactoTemp;
              this.listaContactos.push(contactoDTO);
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

  convertirProcesoContactoEnum(contacto: ContactoModel) {
    contacto.procesoContacto = this.cargarValorEnumerado(contacto.procesoContacto);
    return contacto;
  }

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().procesoContacto.valores, i);
  }

  enviarEmail(event: Event, contacto: ContactoModel) {
    this.confirmationService.confirm({
      target: event.target,
      message: this.msg.lbl_esta_seguro_proceder,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.msg.lbl_enum_si,
      rejectLabel: this.msg.lbl_enum_no,
      accept: () => {
        let listaContactosEnviar: ContactoModel[] = [];
        let nuevoContacto = this.objectModelInitializer.getDataContactoModel();
        this.util.copiarElemento(contacto, nuevoContacto);
        listaContactosEnviar.push(nuevoContacto);
        this.enviarRestEmail(listaContactosEnviar);
      },
      reject: () => {
        //reject action
      }
    });
  }

  enviarEmailTodos(event: Event) {
    this.confirmationService.confirm({
      target: event.target,
      message: this.msg.lbl_esta_seguro_proceder,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.msg.lbl_enum_si,
      rejectLabel: this.msg.lbl_enum_no,
      accept: () => {
        if (this.listaContactos !== undefined && this.listaContactos !== null) {
          let listaContactosEnviar: ContactoModel[] = [];
          this.listaContactos.forEach(contactoDTO => {
            if (contactoDTO.seleccionado) {
              let nuevoContacto = this.objectModelInitializer.getDataContactoModel();
              this.util.copiarElemento(contactoDTO.contactoTB, nuevoContacto);
              listaContactosEnviar.push(nuevoContacto);
            }
          });
          this.enviarRestEmail(listaContactosEnviar);
        }
      },
      reject: () => {
        //reject action
      }
    });
  }

  seleccionarTodosContactos() {
    if (this.listaContactos !== undefined && this.listaContactos !== null) {
      this.listaContactos.forEach(contactoDTO => {
        contactoDTO.seleccionado = this.seleccionarTodos;
      });
    }
  }

  validarSeleccionarTodos() {
    if (this.listaContactos !== undefined && this.listaContactos !== null) {
      let activar = true;
      this.listaContactos.forEach(contactoDTO => {
        if (!contactoDTO.seleccionado) {
          activar = false;
        }
      });

      this.seleccionarTodos = activar;
    }
  }

  enviarRestEmail(listaContactos: ContactoModel[]) {
    try {
      // Conversiones de datos
      this.mailDTO = this.objectModelInitializer.getDataRequestContactoEmailDtoModel();
      this.mailDTO.desde = this.const.correoRemitente;
      this.mailDTO.asunto = "CONTACTO";
      this.mailDTO.destinatarios = listaContactos;
      if (this.mailDTO.destinatarios !== undefined && this.mailDTO.destinatarios !== null) {
        this.mailDTO.destinatarios.forEach(contacto => {
          contacto.procesoContacto = contacto.procesoContacto.value;
        });
      }

      this.restService.postREST(this.const.urlEnviarEmailContacto, this.mailDTO)
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
    } catch (e) {
      console.log(e);
    }
  }

  obtenerListaExportar() {
    let listaExportar: ContactoModel[] = [];
    if (this.listaContactos !== undefined && this.listaContactos !== null && this.listaContactos.length > 0) {
      this.listaContactos.forEach(contacto => {
        let contact = this.objectModelInitializer.getDataContactoModel();
        this.util.copiarElemento(contacto.contactoTB, contact);
        contact.procesoContacto = contacto.contactoTB.procesoContacto.label;
        listaExportar.push(contact);
      });
    }
    return listaExportar;
  }

  exportPdf() {
    let listaExportar: ContactoModel[] = [];
    listaExportar = this.obtenerListaExportar();
    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc = new jsPDF.default('p', 'pt');
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
    let listaExportar: ContactoModel[] = [];
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