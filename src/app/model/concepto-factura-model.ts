export interface ConceptoFacturaModel {
    idConcepto: any;
    codigo: any;
    descripcion: any;
    tipoConcepto: any;
    unidad: any;
    valorUnitario: any;

    // Auditoria
    estado: any;
    fechaCreacion: any;
    fechaActualizacion: any;
    usuarioCreacion: any;
    usuarioActualizacion: any;
}