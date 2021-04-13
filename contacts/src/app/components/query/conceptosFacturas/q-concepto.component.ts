import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../services/rest.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { Enumerados } from 'src/app/config/Enumerados';
import { SesionService } from 'src/app/services/sesionService/sesion.service';
import { ConceptoFacturaModel } from 'src/app/model/concepto-factura-model';

declare var $: any;

@Component({
  selector: 'app-q-concepto',
  templateUrl: './q-concepto.component.html',
  styleUrls: ['./q-concepto.component.scss'],
  providers: [RestService, MessageService]
})

export class QConceptoFacturaComponent implements OnInit {
  // Objetos de Sesion
  sesion: any;

  // Objetos de datos
  listaConceptos: ConceptoFacturaModel[];
  descripcionFiltro: any = "";

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
    $($('#menu').children()[3]).addClass('active');
    $('.card').bootstrapMaterialDesign();
  }

  inicializar() {
    this.sesionService.objConceptoFacturaCargado = null;
    this.cargarConceptos();
    $('html').removeClass('nav-open');
    //$('#toggleMenuMobile').click();
  }

  cargarConcepto(concepto: ConceptoFacturaModel) {
    this.sesionService.objConceptoFacturaCargado = this.objectModelInitializer.getDataConceptoFacturaModel();
    this.sesionService.objConceptoFacturaCargado = concepto;
    this.router.navigate(['/m-concepto']);
  }

  consultarConceptoPorDescripcion() {
    this.listaConceptos = [];
    try {
      let conceptoFiltro = this.objectModelInitializer.getDataConceptoFacturaModel();
      conceptoFiltro.descripcion = this.descripcionFiltro;
      this.restService.postREST(this.const.urlConsultarConceptosFacturasPorFiltros, conceptoFiltro)
        .subscribe(resp => {
          let listaTemp = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach(temp => {
              let conceptoTemp = this.convertirConceptoEnum(temp);
              this.listaConceptos.push(conceptoTemp);
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

  cargarConceptos() {
    this.listaConceptos = [];
    try {
      let conceptoFiltro = this.objectModelInitializer.getDataConceptoFacturaModel();
      conceptoFiltro.estado = 1;
      this.restService.postREST(this.const.urlConsultarConceptosFacturasPorFiltros, conceptoFiltro)
        .subscribe(resp => {
          let listaTemp = JSON.parse(JSON.stringify(resp));
          if (listaTemp !== undefined && listaTemp.length > 0) {
            listaTemp.forEach(temp => {
              let conceptoTemp = this.convertirConceptoEnum(temp);
              this.listaConceptos.push(conceptoTemp);
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

  convertirConceptoEnum(concepto: ConceptoFacturaModel) {
    concepto.tipoConcepto = this.cargarValorEnumerado(concepto.tipoConcepto);
    concepto.unidad = this.cargarValorEnumeradoUnidad(concepto.unidad);
    return concepto;
  }

  cargarValorEnumerado(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().tipoConcepto.valores, i);
  }

  cargarValorEnumeradoUnidad(i) {
    return this.util.getValorEnumerado(this.enumerados.getEnumerados().unidad.valores, i);
  }
}