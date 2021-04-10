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
import { ReporteFacturaDTOModel } from 'src/app/model/dto/reporte-factura-dto';

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
    //$('#toggleMenuMobile').click();
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

  consultarContactoPorNombre() {
    this.listaContactos = [];
    try {
      let contactoFiltro = this.objectModelInitializer.getDataContactoModel();
      contactoFiltro.nombreContacto = this.nombreFiltro;
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
      this.mailDTO.asunto = "Recubrimientos Epoxicos para Pisos y Paredes, Cancelería Sanitaria y Sistemas HVAC";
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
}