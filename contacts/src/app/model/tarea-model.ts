export interface TareaModel {
    idTarea;
    descripcion;
    fechaRecordatorio;
    realizado;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}