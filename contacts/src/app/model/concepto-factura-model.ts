export interface ConceptoFacturaModel {
    idConcepto;
    codigo;
    descripcion;
    tipoConcepto;
    unidad;
    valorUnitario;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}