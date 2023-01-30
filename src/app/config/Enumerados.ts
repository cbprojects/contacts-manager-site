import { Injectable } from '@angular/core';
import { SesionService } from '../services/sesionService/sesion.service';
import { TextProperties } from './TextProperties';


@Injectable()
export class Enumerados {

  constructor(public textProperties: TextProperties, public sesionService: SesionService) {
  }

  getEnumerados() {
    let properties = this.textProperties.getProperties(this.sesionService.objServiceSesion.idioma);

    return {
      sino: {
        cod: 1, valores: [
          { value: 1, label: properties.lbl_enum_si },
          { value: 0, label: properties.lbl_enum_no }
        ]
      },
      sexo: {
        cod: 2, valores: [
          { value: 1, label: properties.lbl_enum_sexo_valor_masculino },
          { value: 2, label: properties.lbl_enum_sexo_valor_femenino },
          { value: 3, label: properties.lbl_enum_sexo_valor_ambos }
        ]
      },
      tipoUsuario: {
        cod: 3, valores: [
          { value: 0, label: properties.lbl_enum_generico_valor_vacio },
          { value: 1, label: properties.lbl_enum_tipo_usuario_valor_cliente },
          { value: 2, label: properties.lbl_enum_tipo_usuario_valor_empleado },
          { value: 3, label: properties.lbl_enum_tipo_usuario_valor_administrador }
        ]
      },
      tipoDocumento: {
        cod: 4, valores: [
          { value: 0, label: properties.lbl_enum_generico_valor_vacio },
          { value: 1, label: properties.lbl_enum_tipo_documento_valor_cc },
          { value: 2, label: properties.lbl_enum_tipo_documento_valor_ti },
          { value: 3, label: properties.lbl_enum_tipo_documento_valor_ce }
        ]
      },
      tipoUbicacion: {
        cod: 5, valores: [
          { value: -1, label: properties.lbl_enum_generico_valor_vacio },
          { value: 0, label: properties.lbl_enum_tipo_ubicacion_valor_pais },
          { value: 1, label: properties.lbl_enum_tipo_ubicacion_valor_departamento },
          { value: 2, label: properties.lbl_enum_tipo_ubicacion_valor_ciudad }
        ]
      },
      procesoContacto: {
        cod: 6, valores: [
          { value: 0, label: properties.lbl_enum_proceso_contacto_valor_seleccione },
          { value: 1, label: properties.lbl_enum_proceso_contacto_valor_prospecto },
          { value: 2, label: properties.lbl_enum_proceso_contacto_valor_contacto },
          { value: 3, label: properties.lbl_enum_proceso_contacto_valor_cliente },
          { value: 4, label: properties.lbl_enum_proceso_contacto_valor_cliente_perdido },
          { value: 5, label: properties.lbl_enum_proceso_contacto_valor_potencial_perdida },
          { value: 6, label: properties.lbl_enum_proceso_contacto_valor_cambio_info }
        ]
      },
      tipoFactura: {
        cod: 7, valores: [
          { value: 0, label: properties.lbl_enum_tipo_factura_valor_seleccione },
          { value: 1, label: properties.lbl_enum_tipo_factura_cotizacion },
          { value: 2, label: properties.lbl_enum_tipo_factura_factura }
        ]
      },
      tipoConcepto: {
        cod: 8, valores: [
          { value: 0, label: properties.lbl_enum_tipo_concepto_valor_seleccione },
          { value: 1, label: properties.lbl_enum_tipo_concepto_mano_obra },
          { value: 2, label: properties.lbl_enum_tipo_concepto_material }
        ]
      },
      unidad: {
        cod: 9, valores: [
          { value: 0, label: properties.lbl_enum_tipo_unidad_valor_seleccione },
          { value: 1, label: properties.lbl_enum_tipo_unidad_valor_metro },
          { value: 2, label: properties.lbl_enum_tipo_unidad_valor_metro_cuadrado },
          { value: 1, label: properties.lbl_enum_tipo_unidad_valor_litro },
          { value: 2, label: properties.lbl_enum_tipo_unidad_valor_hora }
        ]
      },
      nivelSeguimiento: {
        cod: 10, valores: [
          { value: 0, label: properties.lbl_enum_nivel_seguimiento_valor_seleccione },
          { value: 1, label: properties.lbl_enum_nivel_seguimiento_creado },
          { value: 2, label: properties.lbl_enum_nivel_seguimiento_recordatorio },
          { value: 3, label: properties.lbl_enum_nivel_seguimiento_realizado },
          { value: 4, label: properties.lbl_enum_nivel_seguimiento_pendiente }
        ]
      },
      industria: {
        cod: 11, valores: [
          { value: 0, label: properties.lbl_enum_industria_valor_seleccione },
          { value: 1, label: properties.lbl_enum_industria_alimenticia },
          { value: 2, label: properties.lbl_enum_industria_farmaceutica },
          { value: 3, label: properties.lbl_enum_industria_automotriz },
          { value: 4, label: properties.lbl_enum_industria_construccion },
          { value: 5, label: properties.lbl_enum_industria_general },
          { value: 6, label: properties.lbl_enum_industria_metalurgica },
          { value: 7, label: properties.lbl_enum_industria_quimica },
          { value: 8, label: properties.lbl_enum_industria_textil },
          { value: 9, label: properties.lbl_enum_industria_comercial_hotel },
          { value: 10, label: properties.lbl_enum_industria_plastico },
          { value: 11, label: properties.lbl_enum_industria_petroquimica },
          { value: 12, label: properties.lbl_enum_industria_electrica },
          { value: 13, label: properties.lbl_enum_industria_gas },
          { value: 14, label: properties.lbl_enum_industria_maderas },
          { value: 15, label: properties.lbl_enum_industria_cosmetica },
          { value: 16, label: properties.lbl_enum_industria_centro_oncologico },
          { value: 17, label: properties.lbl_enum_industria_hospital },
          { value: 18, label: properties.lbl_enum_industria_minera }
        ]
      },
      //valorIva: {cod: 25},
    }
  };
}