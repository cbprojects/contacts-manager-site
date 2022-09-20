import { ConceptoFacturaModel } from "./concepto-factura-model";

export interface FacturaModel {
    idFactura;
    numeroFactura;
    conceptoFacturaTB: ConceptoFacturaModel;
    tipoFactura;
    cantidad;
    valorTotal;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}