export interface ContactoModel {
    idContacto;
    nombreEmpresa;
    telefonoEmpresa;
    descripcionEmpresa;
    nombreContacto;
    correoContacto;
    cargoContacto;
    telefonoContacto;
    procesoContacto;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}