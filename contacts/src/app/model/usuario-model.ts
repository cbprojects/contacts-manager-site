export interface UsuarioModel {
    idUsuario;
    usuario;
    clave;
    correoUsuario;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}