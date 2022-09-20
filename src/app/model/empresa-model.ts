export interface EmpresaModel {
    idEmpresa;
    nombre;
    telefono;
    descripcion;
    correo;
    paginaWeb;
    ciudad;
    industria;
    color;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}