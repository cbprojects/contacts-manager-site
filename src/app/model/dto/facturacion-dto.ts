import { FacturaModel } from "../factura-model";

export interface FacturacionDTOModel {
    total: any;
    facturaTB: FacturaModel;
    conceptoTempTB: any;
}