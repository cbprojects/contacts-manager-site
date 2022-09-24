import { ContactoModel } from "../contacto-model";
import { EmpresaModel } from "../empresa-model";

export interface ReporteFacturaDTOModel {
    numeroFactura: any;
    empresaTB: EmpresaModel;
    contactoTB: ContactoModel;
}