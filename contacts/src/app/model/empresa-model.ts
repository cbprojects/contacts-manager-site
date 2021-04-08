export interface EmpresaModel {
    idEmpresa;
    nombre;
    telefono;
    descripcion;
    correo;
    paginaWeb;
    ciudad;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}