import { FacturaModel } from "../factura-model";

export interface RequestFacturacionDTOModel {
    listaFacturacion: FacturaModel[];
    tipoFactura;
    total;
}