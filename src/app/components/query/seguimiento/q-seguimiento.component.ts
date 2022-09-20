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

declare var $: any;

@Component({
  selector: 'app-q-seguimiento',
  templateUrl: './q-seguimiento.component.html',
  styleUrls: ['./q-seguimiento.component.scss'],
  providers: [RestService, MessageService]
})

export class QSeguimientoComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  listaContactos: ContactoDTOModel[];
  nombreFiltro: any = "";
  cols: any[];
  exportColumns: any[];
  listaIdsContactosSeg: any[];

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
    $($('#menu').children()[2]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  inicializar() {
    let rowsLS = localStorage.getItem("rowsLS");
    if (rowsLS !== undefined && rowsLS !== null) {
      this.rows = parseInt(rowsLS);
    } else {
      this.rows = this.enumRows[0];
    }
    this.sesionService.objContactoCargado = null;
    this.consultarIdContactosSeg();
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
    this.router.navigate(['/m-seguimiento']);
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

  consultarIdContactosSeg() {
    this.listaIdsContactosSeg = [];
    try {
      this.restService.getREST(this.const.urlConsultarIdContactosSeg)
        .subscribe(resp => {
          this.listaIdsContactosSeg = JSON.parse(JSON.stringify(resp));
          this.cargarContactos();
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
    this.listaContactos = [];
    try {
      let contactoFiltro = this.objectModelInitializer.getDataContactoModel();
      contactoFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarContactosPorFiltros, contactoFiltro)
        .subscribe(resp => {
          let listaContactosTemp = JSON.parse(JSON.stringify(resp));
          if (listaContactosTemp !== undefined && listaContactosTemp.length > 0) {
            listaContactosTemp.forEach(contacto => {
              let contactoTemp = this.convertirEnums(contacto);
              let contactoDTO = this.objectModelInitializer.getDataDTOContactoModel();
              contactoDTO.contactoTB = contactoTemp;
              if (this.listaIdsContactosSeg.includes(contactoDTO.contactoTB.idContacto)) {
                contactoDTO.seleccionado = true;
              }
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

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().procesoContacto.valores, i);
  }

  cargarValorEnumeradoIndustria(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().industria.valores, i);
  }

}