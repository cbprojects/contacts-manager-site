import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ContactoModel } from 'src/app/model/contacto-model';
import { ContactoDTOModel } from 'src/app/model/dto/contacto-dto';
import { RequestContactoXEmpresaEMailDTOModel } from 'src/app/model/dto/request-contacto-x-empresa-email-dto';
import { ResponseEMailDTOModel } from 'src/app/model/dto/response-email-dto';
import { EmpresaModel } from 'src/app/model/empresa-model';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { RestService } from '../../../services/rest.service';

declare let $: any;

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

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
  listaContactos: ContactoDTOModel[] = [];
  nombreFiltro: any = "";
  seleccionarTodos: boolean = false;
  mailDTO: RequestContactoXEmpresaEMailDTOModel | undefined;
  mailResponseDTO: ResponseEMailDTOModel | undefined;
  cols: any[] = [];
  exportColumns: any[] = [];
  listaEmpresas: EmpresaModel[] = [];
  empresa: EmpresaModel | undefined;
  contactosSeleccionados: any;
  uploadedFiles: any[] = [];

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

  ngAfterViewChecked(): void {
    $('#menu').children().removeClass('active');
    $($('#menu').children()[1]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  onUpload(event: UploadEvent) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  // importar() {
  //   if (this.uploadedFiles && this.uploadedFiles.length > 0) {
  //     let file = this.uploadedFiles[0];
  //     try {
  //       this.restService.postFileSendREST(this.const.urlArchivosSubirInfo, file)
  //         .subscribe(resp => {
  //           let okMessage = { severity: this.const.severity[1], summary: this.msg.lbl_summary_success, detail: 'Archivo importado correctamente.', sticky: true };
  //           this.messageService.add(okMessage);
  //           this.cargarContactos();
  //         },
  //           error => {
  //             let listaMensajes = this.util.construirMensajeExcepcion(error.error, this.msg.lbl_summary_danger);
  //             let titleError = listaMensajes[0];
  //             listaMensajes.splice(0, 1);
  //             let mensajeFinal = { severity: titleError.severity, summary: titleError.detail, detail: '', sticky: true };
  //             this.messageService.clear();

  //             listaMensajes.forEach(mensaje => {
  //               mensajeFinal.detail = mensajeFinal.detail + mensaje.detail + " ";
  //             });
  //             this.messageService.add(mensajeFinal);

  //             console.log(error, "error");
  //           })
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
  // }

  inicializar() {
    let rowsLS = localStorage.getItem("rowsLS");
    if (rowsLS !== undefined && rowsLS !== null) {
      this.rows = parseInt(rowsLS);
    } else {
      this.rows = this.enumRows[0];
    }
    this.sesionService.objContactoCargado = undefined;
    this.empresa = this.objectModelInitializer.getDataEmpresaModel();
    this.cargarEmpresas();
    this.cargarContactos();
    this.mailDTO = this.objectModelInitializer.getDataRequestContactoXEmpresaEmailDtoModel();
    this.mailDTO.destinatarios = [];
    $('html').removeClass('nav-open');
    this.cols = [
      { field: 'nombreEmpresa', header: this.msg.lbl_table_header_nombre_empresa },
      { field: 'ciudadContacto', header: this.msg.lbl_table_header_ciudad },
      { field: 'nombreContacto', header: this.msg.lbl_table_header_nombre_contacto },
      { field: 'correoContacto', header: this.msg.lbl_table_header_correo },
      { field: 'telefonoContacto', header: this.msg.lbl_table_header_telefono },
      { field: 'industria', header: this.msg.lbl_table_header_industria },
      { field: 'procesoContacto', header: this.msg.lbl_table_header_proceso }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  cargarContacto(contacto: ContactoModel) {
    this.sesionService.objContactoCargado = this.objectModelInitializer.getDataContactoModel();
    this.sesionService.objContactoCargado = contacto;
    localStorage.setItem("rowsLS", $('.p-paginator .p-dropdown .p-dropdown-label.p-inputtext')[0].innerHTML.split('<')[0]);
    this.router.navigate(['/m-contacto']);
  }

  cargarColorBadge(i: number) {
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
            listaContactosTemp.forEach((contacto: ContactoModel) => {
              let contactoTemp = this.convertirEnums(contacto);
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

  convertirEnums(contacto: ContactoModel) {
    contacto.procesoContacto = this.cargarValorEnumerado(contacto.procesoContacto);
    contacto.industria = this.cargarValorEnumeradoIndustria(contacto.industria);
    return contacto;
  }

  cargarValorEnumerado(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().procesoContacto.valores, i);
  }

  cargarValorEnumeradoIndustria(i: number) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().industria.valores, i);
  }

  enviarEmail(event: any, contacto: ContactoModel) {
    this.confirmationService.confirm({
      target: event.target,
      message: this.msg.lbl_esta_seguro_proceder + " Se enviará un correo de la Empresa: " + (this.empresa ? this.empresa.nombre : ''),
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

  enviarEmailTodos(event: any) {
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
      if (this.empresa) {
        // Conversiones de datos
        this.mailDTO = this.objectModelInitializer.getDataRequestContactoXEmpresaEmailDtoModel();
        this.mailDTO.desde = this.empresa.correo;
        this.mailDTO.destinatarios = listaContactos;
        this.mailDTO.empresa = this.empresa;
        if (this.mailDTO.destinatarios !== undefined && this.mailDTO.destinatarios !== null) {
          this.mailDTO.destinatarios.forEach(contacto => {
            contacto.procesoContacto = contacto.procesoContacto.value;
            contacto.industria = contacto.industria.value;
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
      }
    } catch (e) {
      console.log(e);
    }
  }

  obtenerListaExportar() {
    let listaExportar: any[] = [];
    if (this.listaContactos !== undefined && this.listaContactos !== null && this.listaContactos.length > 0) {
      this.listaContactos.forEach(contacto => {
        let contact = this.objectModelInitializer.getDataContactoModel();
        this.util.copiarElemento(contacto.contactoTB, contact);
        const proceso = contacto.contactoTB.procesoContacto && contacto.contactoTB.procesoContacto.label ? contacto.contactoTB.procesoContacto.label : '';
        const industria = contacto.contactoTB.industria && contacto.contactoTB.industria.label ? contacto.contactoTB.industria.label : '';
        const ciudad = contact.ciudadContacto ? contact.ciudadContacto : 'Sin Ciudad';
        listaExportar.push({
          ciudadContacto: ciudad,
          nombreEmpresa: contact.nombreEmpresa ? contact.nombreEmpresa : '',
          nombreContacto: contact.nombreContacto ? contact.nombreContacto : '',
          correoContacto: contact.correoContacto ? contact.correoContacto : '',
          telefonoContacto: contact.telefonoContacto ? contact.telefonoContacto : '',
          industria: industria,
          procesoContacto: proceso
        });
      });
    }
    return listaExportar;
  }

  private normalizarTexto(valor: string) {
    return valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\\/*?:[\]]/g, '')
      .trim();
  }

  private ordenarListaExportar(listaExportar: any[]) {
    return listaExportar.sort((a, b) => {
      const ciudadA = (a.ciudadContacto || '').toString().toLowerCase();
      const ciudadB = (b.ciudadContacto || '').toString().toLowerCase();
      if (ciudadA !== ciudadB) {
        return ciudadA.localeCompare(ciudadB);
      }
      const nombreA = (a.nombreContacto || '').toString().toLowerCase();
      const nombreB = (b.nombreContacto || '').toString().toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  }

  private agruparPorCiudad(listaExportar: any[]) {
    const grupos = new Map<string, any[]>();
    listaExportar.forEach(contacto => {
      const ciudad = contacto.ciudadContacto ? contacto.ciudadContacto : 'Sin Ciudad';
      if (!grupos.has(ciudad)) {
        grupos.set(ciudad, []);
      }
      grupos.get(ciudad)?.push(contacto);
    });
    return grupos;
  }

  private obtenerNombreHojaUnico(nombreBase: string, usados: Set<string>) {
    let base = nombreBase || 'SinCiudad';
    if (base.length > 31) {
      base = base.slice(0, 31);
    }

    let candidato = base;
    let contador = 1;
    while (usados.has(candidato.toLowerCase())) {
      const sufijo = `_${contador}`;
      const limite = 31 - sufijo.length;
      candidato = `${base.slice(0, limite)}${sufijo}`;
      contador++;
    }

    usados.add(candidato.toLowerCase());
    return candidato;
  }

  private construirFilasCsv(campos: string[], fila: any) {
    return campos.map(campo => {
      const valor = fila[campo] !== undefined && fila[campo] !== null ? String(fila[campo]) : '';
      return `"${valor.replace(/"/g, '""')}"`;
    }).join(',');
  }

  exportCsv() {
    const listaExportar = this.ordenarListaExportar(this.obtenerListaExportar());
    const gruposPorCiudad = this.agruparPorCiudad(listaExportar);
    const campos = ['nombreEmpresa', 'nombreContacto', 'correoContacto', 'telefonoContacto', 'industria', 'procesoContacto'];
    const encabezado = ['Empresa', 'Contacto', 'Correo', 'Telefono', 'Industria', 'Proceso'];
    const lineas: string[] = [];

    gruposPorCiudad.forEach((contactos, ciudad) => {
      lineas.push(`"Ciudad: ${ciudad}"`);
      lineas.push(encabezado.map(col => `"${col}"`).join(','));
      contactos.forEach(contacto => {
        lineas.push(this.construirFilasCsv(campos, contacto));
      });
      lineas.push('');
    });

    const contenido = '\ufeff' + lineas.join('\r\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'Contactos_' + new Date().getTime() + '.csv');
  }

  exportPdf() {
    const listaExportar = this.ordenarListaExportar(this.obtenerListaExportar());
    const gruposPorCiudad = this.agruparPorCiudad(listaExportar);
    const columnasTabla = [
      { title: this.msg.lbl_table_header_nombre_empresa, dataKey: 'nombreEmpresa' },
      { title: this.msg.lbl_table_header_nombre_contacto, dataKey: 'nombreContacto' },
      { title: this.msg.lbl_table_header_correo, dataKey: 'correoContacto' },
      { title: this.msg.lbl_table_header_telefono, dataKey: 'telefonoContacto' },
      { title: this.msg.lbl_table_header_industria, dataKey: 'industria' },
      { title: this.msg.lbl_table_header_proceso, dataKey: 'procesoContacto' }
    ];

    import("jspdf").then(jsPDF => {
      import("jspdf-autotable").then(x => {
        const doc: any = new jsPDF.default('p', 'pt');
        let inicioY = 30;
        let primerBloque = true;

        gruposPorCiudad.forEach((contactos, ciudad) => {
          if (!primerBloque) {
            inicioY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : inicioY) + 28;
          }
          primerBloque = false;

          if (inicioY > 760) {
            doc.addPage();
            inicioY = 30;
          }

          doc.setFontSize(12);
          doc.text(`Ciudad: ${ciudad}`, 40, inicioY);
          doc['autoTable'](columnasTabla, contactos, {
            startY: inicioY + 8,
            styles: { fillColor: [255, 255, 255], textColor: [33, 37, 41] },
            headStyles: { halign: 'center', fillColor: [12, 180, 201] },
            bodyStyles: { fillColor: [255, 255, 255] }
          });
        });

        doc.save('Contactos_' + new Date().getTime() + '.pdf');
      })
    });
  }

  exportExcel() {
    const listaExportar = this.ordenarListaExportar(this.obtenerListaExportar());
    const gruposPorCiudad = this.agruparPorCiudad(listaExportar);
    import("xlsx").then(xlsx => {
      const workbook = xlsx.utils.book_new();
      const hojasUsadas = new Set<string>();

      gruposPorCiudad.forEach((contactos, ciudad) => {
        const filas = contactos.map(contacto => ({
          Empresa: contacto.nombreEmpresa,
          Contacto: contacto.nombreContacto,
          Correo: contacto.correoContacto,
          Telefono: contacto.telefonoContacto,
          Industria: contacto.industria,
          Proceso: contacto.procesoContacto
        }));
        const worksheet = xlsx.utils.json_to_sheet(filas);
        const nombreBase = this.normalizarTexto(ciudad);
        const nombreHoja = this.obtenerNombreHojaUnico(nombreBase, hojasUsadas);
        xlsx.utils.book_append_sheet(workbook, worksheet, nombreHoja);
      });

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

  cargarEmpresas() {
    try {
      this.listaEmpresas = [];
      let empresaFiltro = this.objectModelInitializer.getDataEmpresaModel();
      empresaFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarEmpresasPorFiltros, empresaFiltro)
        .subscribe(resp => {
          let listaTemp: any = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach((temp: EmpresaModel) => {
              this.listaEmpresas.push(temp);
            });
            console.log(this.listaEmpresas);
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

  bgEmpresa() {
    let result = '';
    if (this.empresa && this.empresa.idEmpresa > 0) {
      result = this.empresa.color + ' !important;';
    }

    return result;
  }
}
