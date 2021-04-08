export interface TareaModel {
    idTarea;
    descripcion;
    fechaRecordatorio;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}