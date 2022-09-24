export interface TareaModel {
    idTarea: any;
    descripcion: any;
    fechaRecordatorio: any;
    realizado: any;

    // Auditoria
    estado: any;
    fechaCreacion: any;
    fechaActualizacion: any;
    usuarioCreacion: any;
    usuarioActualizacion: any;
}