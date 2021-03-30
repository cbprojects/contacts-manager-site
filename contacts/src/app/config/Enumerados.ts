import { Injectable } from '@angular/core';
import { TextProperties } from './TextProperties';
import { SesionService } from '../services/sesionService/sesion.service';


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
      //valorIva: {cod: 25},
    }
  };
}