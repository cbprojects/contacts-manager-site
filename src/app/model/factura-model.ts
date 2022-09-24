import { ConceptoFacturaModel } from "./concepto-factura-model";

export interface FacturaModel {
    idFactura: any;
    numeroFactura: any;
    conceptoFacturaTB: ConceptoFacturaModel;
    tipoFactura: any;
    cantidad: any;
    valorTotal: any;

    // Auditoria
    estado: any;
    fechaCreacion: any;
    fechaActualizacion: any;
    usuarioCreacion: any;
    usuarioActualizacion: any;
}