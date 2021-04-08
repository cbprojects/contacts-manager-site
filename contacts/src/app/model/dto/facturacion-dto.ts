import { FacturaModel } from "../factura-model";

export interface FacturacionDTOModel {
    total;
    facturaTB: FacturaModel;
    conceptoTempTB: any;
}