import { FacturaModel } from "../factura-model";

export interface RequestFacturacionDTOModel {
    listaFacturacion: FacturaModel[];
    tipoFactura: any;
    total: any;
}