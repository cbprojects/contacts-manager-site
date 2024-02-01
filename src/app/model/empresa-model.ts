export interface EmpresaModel {
    idEmpresa: any;
    nombre: any;
    telefono: any;
    descripcion: any;
    correo: any;
    paginaWeb: any;
    ciudad: any;
    industria: any;
    color: any;
    mailTemplate: any;
    mailAsunto: any;
    mailPassword: any;

    // Auditoria
    estado: any;
    fechaCreacion: any;
    fechaActualizacion: any;
    usuarioCreacion: any;
    usuarioActualizacion: any;
}