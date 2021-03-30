import { ContactoModel } from "../contacto-model";

export interface RequestContactoEMailDTOModel {
    desde;
    destinatarios: ContactoModel[];
    asunto;
}