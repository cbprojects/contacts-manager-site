import { ContactoModel } from "../contacto-model";
import { EmpresaModel } from "../empresa-model";

export interface RequestContactoXEmpresaEMailDTOModel {
    desde;
    empresa: EmpresaModel;
    destinatarios: ContactoModel[];
    asunto;
    template;
}