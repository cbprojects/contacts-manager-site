import { ContactoModel } from "../contacto-model";
import { EmpresaModel } from "../empresa-model";

export interface ReporteFacturaDTOModel {
    numeroFactura;
    empresaTB: EmpresaModel;
    contactoTB: ContactoModel;
}