import { ContactoModel } from "./contacto-model";

export interface SeguimientoModel {
    idSeguimiento: any;
    contactoTB: ContactoModel;
    descripcion: any;
    fechaSeguimiento: any;
    nivel: any;

    // Auditoria
    estado: any;
    fechaCreacion: any;
    fechaActualizacion: any;
    usuarioCreacion: any;
    usuarioActualizacion: any;
}