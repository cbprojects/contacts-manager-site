import { ContactoModel } from "./contacto-model";

export interface SeguimientoModel {
    idSeguimiento;
    contactoTB: ContactoModel;
    descripcion;
    fechaSeguimiento;
    nivel;

    // Auditoria
    estado;
    fechaCreacion;
    fechaActualizacion;
    usuarioCreacion;
    usuarioActualizacion;
}