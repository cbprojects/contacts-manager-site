export interface ContactoModel {
    idContacto;
    nombreEmpresa;
    telefonoEmpresa;
    descripcionEmpresa;
    nombreContacto;
    correoContacto;
    cargoContacto;
    telefonoContacto;
    ciudadContacto;
    procesoContacto;
    industria;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}