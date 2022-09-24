import { ContactoModel } from "../contacto-model";
import { EmpresaModel } from "../empresa-model";

export interface RequestContactoXEmpresaEMailDTOModel {
    desde: any;
    empresa: EmpresaModel;
    destinatarios: ContactoModel[];
    asunto: any;
    template: any;
}