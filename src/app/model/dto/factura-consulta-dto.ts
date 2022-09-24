import { FacturaModel } from "../factura-model";

export interface FacturaConsultaDTOModel {
    numeroFactura: any;
    total: any;
    tipoFactura: any;
    listaFacturas: FacturaModel[];
}