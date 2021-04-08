export interface ConceptoFacturaModel {
    idConcepto;
    descripcion;
    tipoConcepto;
    valorUnitario;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}