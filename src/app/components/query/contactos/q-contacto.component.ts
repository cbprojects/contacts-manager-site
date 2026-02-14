import { Component, OnInit, ViewChild } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';

declare let $: any;

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface RegistroImportacionResumen {
  linea: number;
  tipo: string;
  nombreEmpresa: string;
  nombreContacto: string;
  correoContacto: string;
  detalle: string;
}

@Component({
  selector: 'app-q-contacto',
  templateUrl: './q-contacto.component.html',
  styleUrls: ['./q-contacto.component.scss'],
  providers: [RestService, MessageService]
})
export class QContactoComponent implements OnInit {
  @ViewChild('fileUploadRef') fileUploadRef: any;
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
  contactosPendientesImportar: ContactoModel[] = [];
  nombreArchivoPendiente: string = '';
  resumenImportacionValidos: RegistroImportacionResumen[] = [];
  resumenImportacionInvalidos: RegistroImportacionResumen[] = [];

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
    if (event.files && event.files.length > 1) {
      this.resetearInputFileUpload();
      this.messageService.clear();
      this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: 'Solo se permite cargar un archivo por vez.', sticky: true });
      return;
    }
    this.prepararArchivoContactos(event.files);
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

  private obtenerListaExportarCompleta() {
    let listaExportar: any[] = [];
    if (this.listaContactos !== undefined && this.listaContactos !== null && this.listaContactos.length > 0) {
      this.listaContactos.forEach(contacto => {
        const contactoTB: any = contacto.contactoTB;
        const procesoId = contactoTB.procesoContacto && contactoTB.procesoContacto.value !== undefined
          ? contactoTB.procesoContacto.value
          : contactoTB.procesoContacto;
        const procesoLabel = contactoTB.procesoContacto && contactoTB.procesoContacto.label !== undefined
          ? contactoTB.procesoContacto.label
          : '';
        const industriaId = contactoTB.industria && contactoTB.industria.value !== undefined
          ? contactoTB.industria.value
          : contactoTB.industria;
        const industriaLabel = contactoTB.industria && contactoTB.industria.label !== undefined
          ? contactoTB.industria.label
          : '';

        listaExportar.push({
          idContacto: contactoTB.idContacto,
          estado: contactoTB.estado,
          fechaActualizacion: this.formatearFechaSql(contactoTB.fechaActualizacion),
          fechaCreacion: this.formatearFechaSql(contactoTB.fechaCreacion),
          usuarioActualizacion: contactoTB.usuarioActualizacion,
          usuarioCreacion: contactoTB.usuarioCreacion,
          cargoContacto: contactoTB.cargoContacto,
          ciudadContacto: contactoTB.ciudadContacto,
          correoContacto: contactoTB.correoContacto,
          descripcionEmpresa: contactoTB.descripcionEmpresa,
          industriaId: industriaId,
          industria: industriaLabel,
          nombreContacto: contactoTB.nombreContacto,
          nombreEmpresa: contactoTB.nombreEmpresa,
          procesoContactoId: procesoId,
          procesoContacto: procesoLabel,
          telefonoContacto: contactoTB.telefonoContacto,
          telefonoEmpresa: contactoTB.telefonoEmpresa
        });
      });
    }
    return listaExportar;
  }

  private escaparSql(valor: any, esNumerico: boolean = false) {
    if (valor === undefined || valor === null || valor === '') {
      return 'NULL';
    }
    if (esNumerico) {
      const numero = Number(valor);
      return Number.isNaN(numero) ? 'NULL' : `${numero}`;
    }
    return `'${String(valor).replace(/'/g, "''")}'`;
  }

  private formatearFechaSql(valor: any) {
    if (valor === undefined || valor === null || valor === '') {
      return null;
    }

    if (valor instanceof Date) {
      const anio = valor.getFullYear();
      const mes = `${valor.getMonth() + 1}`.padStart(2, '0');
      const dia = `${valor.getDate()}`.padStart(2, '0');
      const hora = `${valor.getHours()}`.padStart(2, '0');
      const minuto = `${valor.getMinutes()}`.padStart(2, '0');
      const segundo = `${valor.getSeconds()}`.padStart(2, '0');
      const milisegundo = `${valor.getMilliseconds()}`.padStart(3, '0');
      return `${anio}-${mes}-${dia} ${hora}:${minuto}:${segundo}.${milisegundo}`;
    }

    const texto = String(valor).trim();
    if (texto.includes('T')) {
      return texto.replace('T', ' ').replace('Z', '');
    }

    return texto;
  }

  private obtenerListaExportarSql() {
    let listaExportar: any[] = [];
    if (this.listaContactos !== undefined && this.listaContactos !== null && this.listaContactos.length > 0) {
      this.listaContactos.forEach(contacto => {
        const contactoTB: any = contacto.contactoTB;
        const proceso = contactoTB.procesoContacto && contactoTB.procesoContacto.value !== undefined
          ? contactoTB.procesoContacto.value
          : contactoTB.procesoContacto;
        const industria = contactoTB.industria && contactoTB.industria.value !== undefined
          ? contactoTB.industria.value
          : contactoTB.industria;
        listaExportar.push({
          idContacto: contactoTB.idContacto,
          nombreEmpresa: contactoTB.nombreEmpresa,
          telefonoEmpresa: contactoTB.telefonoEmpresa,
          descripcionEmpresa: contactoTB.descripcionEmpresa,
          nombreContacto: contactoTB.nombreContacto,
          correoContacto: contactoTB.correoContacto,
          cargoContacto: contactoTB.cargoContacto,
          telefonoContacto: contactoTB.telefonoContacto,
          ciudadContacto: contactoTB.ciudadContacto,
          procesoContacto: proceso,
          industria: industria,
          estado: contactoTB.estado,
          fechaCreacion: this.formatearFechaSql(contactoTB.fechaCreacion),
          fechaActualizacion: this.formatearFechaSql(contactoTB.fechaActualizacion),
          usuarioCreacion: contactoTB.usuarioCreacion,
          usuarioActualizacion: contactoTB.usuarioActualizacion
        });
      });
    }
    return listaExportar;
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

  exportSql() {
    const listaSql = this.obtenerListaExportarSql();
    if (!listaSql || listaSql.length === 0) {
      return;
    }

    const tabla = 'contactmanager.cm_contacto_tb';
    const columnas = [
      { sql: 'cmc_id_contacto', key: 'idContacto', numerico: true },
      { sql: 'cm_estado', key: 'estado', numerico: true },
      { sql: 'cm_fecha_actualizacion', key: 'fechaActualizacion', numerico: false },
      { sql: 'cm_fecha_creacion', key: 'fechaCreacion', numerico: false },
      { sql: 'cm_usuario_actualizacion', key: 'usuarioActualizacion', numerico: false },
      { sql: 'cm_usuario_creacion', key: 'usuarioCreacion', numerico: false },
      { sql: 'cmc_cargo_contacto', key: 'cargoContacto', numerico: false },
      { sql: 'cme_ciudad_contacto', key: 'ciudadContacto', numerico: false },
      { sql: 'cmc_correo_contacto', key: 'correoContacto', numerico: false },
      { sql: 'cmc_descripcion_empresa', key: 'descripcionEmpresa', numerico: false },
      { sql: 'cmc_industria', key: 'industria', numerico: true },
      { sql: 'cmc_nombre_contacto', key: 'nombreContacto', numerico: false },
      { sql: 'cmc_nombre_empresa', key: 'nombreEmpresa', numerico: false },
      { sql: 'cmc_proceso_contacto', key: 'procesoContacto', numerico: true },
      { sql: 'cmc_telefono_contacto', key: 'telefonoContacto', numerico: false },
      { sql: 'cmc_telefono_empresa', key: 'telefonoEmpresa', numerico: false }
    ];

    const lineas: string[] = [];
    lineas.push(`-- Backup de contactos generado: ${new Date().toISOString()}`);
    lineas.push('');
    listaSql.forEach((fila) => {
      const nombresColumnas = columnas.map(col => col.sql).join(', ');
      const valores = columnas.map((col) => this.escaparSql(fila[col.key], col.numerico)).join(', ');
      lineas.push(`INSERT INTO ${tabla}`);
      lineas.push(`(${nombresColumnas})`);
      lineas.push(`VALUES(${valores});`);
      lineas.push('');
    });
    const contenido = '\ufeff' + lineas.join('\n');
    const blob = new Blob([contenido], { type: 'application/sql;charset=utf-8;' });
    FileSaver.saveAs(blob, 'Contactos_' + new Date().getTime() + '.sql');
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

  exportCsvFull() {
    const lista = this.obtenerListaExportarCompleta();
    const campos = [
      'idContacto',
      'estado',
      'fechaActualizacion',
      'fechaCreacion',
      'usuarioActualizacion',
      'usuarioCreacion',
      'cargoContacto',
      'ciudadContacto',
      'correoContacto',
      'descripcionEmpresa',
      'industriaId',
      'industria',
      'nombreContacto',
      'nombreEmpresa',
      'procesoContactoId',
      'procesoContacto',
      'telefonoContacto',
      'telefonoEmpresa'
    ];
    const encabezado = [
      'idContacto',
      'estado',
      'fechaActualizacion',
      'fechaCreacion',
      'usuarioActualizacion',
      'usuarioCreacion',
      'cargoContacto',
      'ciudadContacto',
      'correoContacto',
      'descripcionEmpresa',
      'industriaId',
      'industria',
      'nombreContacto',
      'nombreEmpresa',
      'procesoContactoId',
      'procesoContacto',
      'telefonoContacto',
      'telefonoEmpresa'
    ];
    const lineas: string[] = [];
    lineas.push(encabezado.map(col => `"${col}"`).join(','));
    lista.forEach(fila => {
      lineas.push(this.construirFilasCsv(campos, fila));
    });
    const contenido = '\ufeff' + lineas.join('\r\n');
    const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'ContactosAuditoria_' + new Date().getTime() + '.csv');
  }

  exportExcelFull() {
    const lista = this.obtenerListaExportarCompleta();
    import("xlsx").then(xlsx => {
      const filas = lista.map(fila => ({
        idContacto: fila.idContacto,
        estado: fila.estado,
        fechaActualizacion: fila.fechaActualizacion,
        fechaCreacion: fila.fechaCreacion,
        usuarioActualizacion: fila.usuarioActualizacion,
        usuarioCreacion: fila.usuarioCreacion,
        cargoContacto: fila.cargoContacto,
        ciudadContacto: fila.ciudadContacto,
        correoContacto: fila.correoContacto,
        descripcionEmpresa: fila.descripcionEmpresa,
        industriaId: fila.industriaId,
        industria: fila.industria,
        nombreContacto: fila.nombreContacto,
        nombreEmpresa: fila.nombreEmpresa,
        procesoContactoId: fila.procesoContactoId,
        procesoContacto: fila.procesoContacto,
        telefonoContacto: fila.telefonoContacto,
        telefonoEmpresa: fila.telefonoEmpresa
      }));
      const worksheet = xlsx.utils.json_to_sheet(filas);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'ContactosAuditoria');
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'ContactosAuditoria');
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

  private async prepararArchivoContactos(files: File[]) {
    try {
      this.uploadedFiles = [];
      this.contactosPendientesImportar = [];
      this.nombreArchivoPendiente = '';
      this.resumenImportacionValidos = [];
      this.resumenImportacionInvalidos = [];
      if (!files || files.length === 0) {
        this.resetearInputFileUpload();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: 'Debes seleccionar un archivo CSV.', sticky: true });
        return;
      }

      const file = files[0];
      this.uploadedFiles.push(file);
      const validacionArchivo = this.validarArchivoImportacion(file);
      if (!validacionArchivo.valido) {
        this.resetearInputFileUpload();
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: validacionArchivo.detalle, sticky: true });
        return;
      }

      const contenido = await this.leerArchivoComoTexto(file);
      const validacionFormato = this.validarFormatoCsvImportacion(contenido);
      if (!validacionFormato.valido) {
        this.resetearInputFileUpload();
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: validacionFormato.detalle, sticky: true });
        return;
      }

      const resultadoConversion = this.convertirCsvAContactosConResumen(contenido);
      const contactos = resultadoConversion.contactos;
      this.resumenImportacionValidos = resultadoConversion.validos;
      this.resumenImportacionInvalidos = resultadoConversion.invalidos;

      if (!contactos || contactos.length === 0) {
        this.resetearInputFileUpload();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: 'No se encontraron contactos validos para importar.', sticky: true });
        return;
      }

      this.contactosPendientesImportar = contactos;
      this.nombreArchivoPendiente = file.name;
      const detalle = `Archivo validado. Validos: ${this.resumenImportacionValidos.length}, Invalidos: ${this.resumenImportacionInvalidos.length}. Presiona "Confirmar Importacion" para guardar en BD.`;
      this.messageService.clear();
      this.messageService.add({ severity: this.const.severity[1], summary: this.msg.lbl_summary_success, detail: detalle, sticky: true });
    } catch (error: any) {
      this.resetearInputFileUpload();
      const detalle = error && error.message ? error.message : 'Error procesando archivo de contactos.';
      this.messageService.clear();
      this.messageService.add({ severity: this.const.severity[3], summary: this.msg.lbl_summary_danger, detail: detalle, sticky: true });
    }
  }

  async confirmarImportacionContactos() {
    try {
      if (!this.contactosPendientesImportar || this.contactosPendientesImportar.length === 0) {
        this.messageService.clear();
        this.messageService.add({ severity: this.const.severity[2], summary: this.msg.lbl_summary_warning, detail: 'No hay registros pendientes por importar.', sticky: true });
        return;
      }

      const resultado = await this.guardarContactosMasivo(this.contactosPendientesImportar);
      const detalle = `Importacion finalizada. Exitosos: ${resultado.exitosos}, Fallidos: ${resultado.fallidos}.`;
      this.messageService.clear();
      this.messageService.add({ severity: resultado.fallidos > 0 ? this.const.severity[2] : this.const.severity[1], summary: resultado.fallidos > 0 ? this.msg.lbl_summary_warning : this.msg.lbl_summary_success, detail: detalle, sticky: true });
      this.contactosPendientesImportar = [];
      this.nombreArchivoPendiente = '';
      this.uploadedFiles = [];
      this.resumenImportacionValidos = [];
      this.resumenImportacionInvalidos = [];
      this.resetearInputFileUpload();
      this.cargarContactos();
    } catch (error) {
      let listaMensajes = this.util.construirMensajeExcepcion((error as any).error, this.msg.lbl_summary_danger);
      let titleError = listaMensajes[0];
      listaMensajes.splice(0, 1);
      let mensajeFinal = { severity: titleError.severity, summary: titleError.detail, detail: '', sticky: true };
      this.messageService.clear();

      listaMensajes.forEach(mensaje => {
        mensajeFinal.detail = mensajeFinal.detail + mensaje.detail + " ";
      });
      this.messageService.add(mensajeFinal);
    }
  }

  cancelarImportacionContactos() {
    this.contactosPendientesImportar = [];
    this.nombreArchivoPendiente = '';
    this.uploadedFiles = [];
    this.resumenImportacionValidos = [];
    this.resumenImportacionInvalidos = [];
    this.resetearInputFileUpload();
    this.messageService.clear();
    this.messageService.add({ severity: this.const.severity[0], summary: this.msg.lbl_summary_info, detail: 'Importacion pendiente cancelada.', sticky: true });
  }

  private resetearInputFileUpload() {
    if (this.fileUploadRef && this.fileUploadRef.clear) {
      this.fileUploadRef.clear();
    }
  }

  private validarArchivoImportacion(file: File) {
    const nombre = (file.name || '').trim();
    const extensionValida = nombre.toLowerCase().endsWith('.csv');
    if (!extensionValida) {
      return { valido: false, detalle: 'Solo se permiten archivos .csv exportados por el sistema.' };
    }

    const nombreValido = /^ContactosAuditoria_\d+\.csv$/i.test(nombre);
    if (!nombreValido) {
      return { valido: false, detalle: 'Solo se permite archivo de auditoria con nombre: ContactosAuditoria_<timestamp>.csv.' };
    }

    if (!file.size || file.size <= 0) {
      return { valido: false, detalle: 'El archivo esta vacio.' };
    }

    if (file.size > 10 * 1024 * 1024) {
      return { valido: false, detalle: 'El archivo supera el tamano maximo permitido (10MB).' };
    }

    return { valido: true, detalle: '' };
  }

  private validarFormatoCsvImportacion(csv: string) {
    const texto = (csv || '').replace(/^\uFEFF/, '').trim();
    if (!texto) {
      return { valido: false, detalle: 'El CSV no contiene datos.' };
    }

    const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
    if (lineas.length < 2) {
      return { valido: false, detalle: 'El CSV no tiene la estructura esperada.' };
    }

    const primera = this.parseCsvLine(lineas[0]).map(x => x.trim().toLowerCase());
    const auditoriaHeaders = [
      'idcontacto',
      'estado',
      'fechaactualizacion',
      'fechacreacion',
      'usuarioactualizacion',
      'usuariocreacion',
      'cargocontacto',
      'ciudadcontacto',
      'correocontacto',
      'descripcionempresa',
      'industriaid',
      'industria',
      'nombrecontacto',
      'nombreempresa',
      'procesocontactoid',
      'procesocontacto',
      'telefonocontacto',
      'telefonoempresa'
    ];

    const esAuditoria = auditoriaHeaders.every(h => primera.includes(h));
    if (esAuditoria) {
      return { valido: true, detalle: '' };
    }

    return { valido: false, detalle: 'Solo se permite el formato CSV de auditoria exportado por el sistema.' };
  }

  private async guardarContactosMasivo(contactos: ContactoModel[]) {
    try {
      const respuestaMasiva: any = await firstValueFrom(this.restService.postREST(this.const.urlImportarContactosMasivo, contactos));
      if (respuestaMasiva && typeof respuestaMasiva === 'object') {
        const exitosos = respuestaMasiva.exitosos !== undefined ? respuestaMasiva.exitosos : contactos.length;
        const fallidos = respuestaMasiva.fallidos !== undefined ? respuestaMasiva.fallidos : 0;
        return { exitosos, fallidos };
      }
      return { exitosos: contactos.length, fallidos: 0 };
    } catch (error: any) {
      if (error && (error.status === 404 || error.status === 405 || error.status === 501)) {
        return this.guardarContactosUnoAUno(contactos);
      }
      throw error;
    }
  }

  private async guardarContactosUnoAUno(contactos: ContactoModel[]) {
    let exitosos = 0;
    let fallidos = 0;

    for (const contacto of contactos) {
      try {
        await firstValueFrom(this.restService.postREST(this.const.urlCrearContacto, contacto));
        exitosos++;
      } catch (error) {
        fallidos++;
      }
    }

    return { exitosos, fallidos };
  }

  private leerArchivoComoTexto(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('No se pudo leer el archivo seleccionado.'));
      reader.readAsText(file, 'utf-8');
    });
  }

  private convertirCsvAContactosConResumen(csv: string) {
    const texto = (csv || '').replace(/^\uFEFF/, '').trim();
    if (!texto) {
      return { contactos: [], validos: [], invalidos: [] };
    }

    const lineas = texto.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
    if (lineas.length === 0) {
      return { contactos: [], validos: [], invalidos: [] };
    }

    const primeraLinea = this.parseCsvLine(lineas[0]).map(x => x.trim().toLowerCase());
    const esAuditoria = primeraLinea.includes('idcontacto') || primeraLinea.includes('fechaactualizacion') || primeraLinea.includes('procesocontactoid');
    if (!esAuditoria) {
      return { contactos: [], validos: [], invalidos: [] };
    }
    return this.convertirCsvAuditoriaAContactos(lineas);
  }

  private convertirCsvAuditoriaAContactos(lineas: string[]) {
    const headers = this.parseCsvLine(lineas[0]).map(h => h.trim().toLowerCase());
    const contactos: ContactoModel[] = [];
    const validos: RegistroImportacionResumen[] = [];
    const invalidos: RegistroImportacionResumen[] = [];

    for (let i = 1; i < lineas.length; i++) {
      const valores = this.parseCsvLine(lineas[i]);
      if (valores.length === 0) {
        continue;
      }
      if (valores.length < headers.length) {
        invalidos.push({
          linea: i + 1,
          tipo: 'Auditoria',
          nombreEmpresa: '',
          nombreContacto: '',
          correoContacto: '',
          detalle: `Cantidad de columnas invalida. Esperadas: ${headers.length}, encontradas: ${valores.length}.`
        });
        continue;
      }

      const contacto: any = this.objectModelInitializer.getDataContactoModel();
      const get = (nombre: string) => {
        const idx = headers.indexOf(nombre);
        return idx >= 0 ? (valores[idx] || '').trim() : '';
      };

      contacto.idContacto = this.parseEnteroNullable(get('idcontacto'));
      contacto.estado = this.parseEnteroNullable(get('estado')) ?? 1;
      contacto.fechaActualizacion = get('fechaactualizacion') || '';
      contacto.fechaCreacion = get('fechacreacion') || '';
      contacto.usuarioActualizacion = get('usuarioactualizacion') || 'SYSTEM';
      contacto.usuarioCreacion = get('usuariocreacion') || 'SYSTEM';
      contacto.cargoContacto = get('cargocontacto');
      contacto.ciudadContacto = get('ciudadcontacto');
      contacto.correoContacto = get('correocontacto');
      contacto.descripcionEmpresa = get('descripcionempresa');
      const industriaId = this.parseEnteroNullable(get('industriaid'));
      const industriaLabel = get('industria');
      contacto.industria = industriaId ?? this.mapearIndustriaPorLabel(industriaLabel);
      contacto.nombreContacto = get('nombrecontacto');
      contacto.nombreEmpresa = get('nombreempresa');
      const procesoId = this.parseEnteroNullable(get('procesocontactoid'));
      const procesoLabel = get('procesocontacto');
      contacto.procesoContacto = procesoId ?? this.mapearProcesoPorLabel(procesoLabel);
      contacto.telefonoContacto = get('telefonocontacto');
      contacto.telefonoEmpresa = get('telefonoempresa');

      const faltantes: string[] = [];
      if (!this.tieneValor(contacto.estado)) faltantes.push('estado');
      if (!this.tieneValor(contacto.usuarioActualizacion)) faltantes.push('usuarioActualizacion');
      if (!this.tieneValor(contacto.usuarioCreacion)) faltantes.push('usuarioCreacion');
      if (!this.tieneValor(contacto.cargoContacto)) faltantes.push('cargoContacto');
      if (!this.tieneValor(contacto.ciudadContacto)) faltantes.push('ciudadContacto');
      if (!this.tieneValor(contacto.correoContacto)) faltantes.push('correoContacto');
      if (!this.tieneValor(contacto.descripcionEmpresa)) faltantes.push('descripcionEmpresa');
      if (!this.tieneValor(contacto.nombreContacto)) faltantes.push('nombreContacto');
      if (!this.tieneValor(contacto.nombreEmpresa)) faltantes.push('nombreEmpresa');
      if (!this.tieneValor(contacto.telefonoContacto)) faltantes.push('telefonoContacto');
      if (!this.tieneValor(contacto.telefonoEmpresa)) faltantes.push('telefonoEmpresa');
      if (!this.tieneValor(industriaId) && !this.tieneValor(industriaLabel)) faltantes.push('industriaId/industria');
      if (!this.tieneValor(procesoId) && !this.tieneValor(procesoLabel)) faltantes.push('procesoContactoId/procesoContacto');

      if (faltantes.length > 0) {
        invalidos.push({
          linea: i + 1,
          tipo: 'Auditoria',
          nombreEmpresa: contacto.nombreEmpresa || '',
          nombreContacto: contacto.nombreContacto || '',
          correoContacto: contacto.correoContacto || '',
          detalle: `Faltan campos obligatorios: ${faltantes.join(', ')}.`
        });
        continue;
      }

      if ((industriaLabel && contacto.industria === 0 && industriaId === null) || (procesoLabel && contacto.procesoContacto === 0 && procesoId === null)) {
        invalidos.push({
          linea: i + 1,
          tipo: 'Auditoria',
          nombreEmpresa: contacto.nombreEmpresa || '',
          nombreContacto: contacto.nombreContacto || '',
          correoContacto: contacto.correoContacto || '',
          detalle: 'Industria o Proceso no reconocido en la fila.'
        });
      } else {
        contactos.push(contacto);
        validos.push({
          linea: i + 1,
          tipo: 'Auditoria',
          nombreEmpresa: contacto.nombreEmpresa || '',
          nombreContacto: contacto.nombreContacto || '',
          correoContacto: contacto.correoContacto || '',
          detalle: 'OK'
        });
      }
    }

    return { contactos, validos, invalidos };
  }

  private convertirCsvMasivoAContactos(lineas: string[]) {
    const contactos: ContactoModel[] = [];
    const validos: RegistroImportacionResumen[] = [];
    const invalidos: RegistroImportacionResumen[] = [];
    let ciudadBloque = '';
    let indice = 0;

    while (indice < lineas.length) {
      const numeroLinea = indice + 1;
      const actual = this.parseCsvLine(lineas[indice]);
      if (actual.length === 0) {
        indice++;
        continue;
      }

      const celda0 = (actual[0] || '').trim();
      if (celda0.toLowerCase().startsWith('ciudad:')) {
        ciudadBloque = celda0.substring(celda0.indexOf(':') + 1).trim();
        indice++;
        continue;
      }

      const esHeader = actual.map(x => x.trim().toLowerCase()).join('|').includes('empresa|contacto|correo|telefono|industria|proceso');
      if (esHeader) {
        indice++;
        continue;
      }

      if (actual.length === 6) {
        const contacto: any = this.objectModelInitializer.getDataContactoModel();
        contacto.idContacto = 0;
        contacto.nombreEmpresa = (actual[0] || '').trim();
        contacto.nombreContacto = (actual[1] || '').trim();
        contacto.correoContacto = (actual[2] || '').trim();
        contacto.telefonoContacto = (actual[3] || '').trim();
        const industriaLabel = (actual[4] || '').trim();
        const procesoLabel = (actual[5] || '').trim();
        contacto.industria = this.mapearIndustriaPorLabel(industriaLabel);
        contacto.procesoContacto = this.mapearProcesoPorLabel(procesoLabel);
        contacto.ciudadContacto = ciudadBloque || '';
        contacto.estado = 1;
        contacto.fechaCreacion = '';
        contacto.fechaActualizacion = '';
        contacto.usuarioCreacion = 'SYSTEM';
        contacto.usuarioActualizacion = 'SYSTEM';

        const faltantes: string[] = [];
        if (!this.tieneValor(contacto.nombreEmpresa)) faltantes.push('Empresa');
        if (!this.tieneValor(contacto.nombreContacto)) faltantes.push('Contacto');
        if (!this.tieneValor(contacto.correoContacto)) faltantes.push('Correo');
        if (!this.tieneValor(contacto.telefonoContacto)) faltantes.push('Telefono');
        if (!this.tieneValor(industriaLabel)) faltantes.push('Industria');
        if (!this.tieneValor(procesoLabel)) faltantes.push('Proceso');
        if (!this.tieneValor(ciudadBloque)) faltantes.push('Ciudad');

        if (faltantes.length > 0) {
          invalidos.push({
            linea: numeroLinea,
            tipo: 'Masivo',
            nombreEmpresa: contacto.nombreEmpresa || '',
            nombreContacto: contacto.nombreContacto || '',
            correoContacto: contacto.correoContacto || '',
            detalle: `Faltan campos obligatorios: ${faltantes.join(', ')}.`
          });
          indice++;
          continue;
        }

        if ((industriaLabel && contacto.industria === 0) || (procesoLabel && contacto.procesoContacto === 0)) {
          invalidos.push({
            linea: numeroLinea,
            tipo: 'Masivo',
            nombreEmpresa: contacto.nombreEmpresa || '',
            nombreContacto: contacto.nombreContacto || '',
            correoContacto: contacto.correoContacto || '',
            detalle: 'Industria o Proceso no reconocido en la fila.'
          });
        } else {
          contactos.push(contacto);
          validos.push({
            linea: numeroLinea,
            tipo: 'Masivo',
            nombreEmpresa: contacto.nombreEmpresa || '',
            nombreContacto: contacto.nombreContacto || '',
            correoContacto: contacto.correoContacto || '',
            detalle: `OK - Ciudad: ${ciudadBloque}`
          });
        }
      } else {
        invalidos.push({
          linea: numeroLinea,
          tipo: 'Masivo',
          nombreEmpresa: '',
          nombreContacto: '',
          correoContacto: '',
          detalle: `Cantidad de columnas invalida. Esperadas: 6, encontradas: ${actual.length}.`
        });
      }

      indice++;
    }

    return { contactos, validos, invalidos };
  }

  private parseCsvLine(linea: string): string[] {
    const resultado: string[] = [];
    let actual = '';
    let enComillas = false;

    for (let i = 0; i < linea.length; i++) {
      const c = linea[i];
      if (c === '"') {
        if (enComillas && i + 1 < linea.length && linea[i + 1] === '"') {
          actual += '"';
          i++;
        } else {
          enComillas = !enComillas;
        }
      } else if (c === ',' && !enComillas) {
        resultado.push(actual);
        actual = '';
      } else {
        actual += c;
      }
    }

    resultado.push(actual);
    return resultado.map(v => v.trim());
  }

  private normalizarComparacion(valor: string) {
    return (valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();
  }

  private mapearProcesoPorLabel(label: string) {
    const normalizado = this.normalizarComparacion(label);
    const lista = this.enumerados.getEnumerados().procesoContacto.valores || [];
    const item = lista.find((x: any) => this.normalizarComparacion(x.label) === normalizado);
    return item ? item.value : 0;
  }

  private mapearIndustriaPorLabel(label: string) {
    const normalizado = this.normalizarComparacion(label);
    const lista = this.enumerados.getEnumerados().industria.valores || [];
    const item = lista.find((x: any) => this.normalizarComparacion(x.label) === normalizado);
    return item ? item.value : 0;
  }

  private parseEnteroNullable(valor: string) {
    if (valor === undefined || valor === null || valor === '') {
      return null;
    }
    const numero = Number(valor);
    return Number.isNaN(numero) ? null : numero;
  }

  private tieneValor(valor: any) {
    if (valor === undefined || valor === null) {
      return false;
    }
    if (typeof valor === 'string') {
      return valor.trim() !== '';
    }
    return true;
  }
}
