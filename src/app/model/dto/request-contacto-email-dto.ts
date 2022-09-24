import { ContactoModel } from "../contacto-model";

export interface RequestContactoEMailDTOModel {
    desde: any;
    destinatarios: ContactoModel[];
    asunto: any;
}