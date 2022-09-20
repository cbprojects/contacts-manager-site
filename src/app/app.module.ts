// Imports PrimeNG
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
//import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
//import { GMapModule } from 'primeng/gmap';
//import { GalleriaModule } from 'primeng/galleria';
import { ButtonModule } from 'primeng/button';
//import { SliderModule } from 'primeng/slider';
//import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CheckboxModule } from 'primeng/checkbox';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TableModule } from 'primeng/table';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';


// Imports Utilidades
import { Functions } from './config/Functions';
import { TextProperties } from './config/TextProperties';
import { Util } from './config/Util';

// Imports Esenciales
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NiceSelectModule } from "ng-nice-select";
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { AppRoutingModule } from './config/Routing';

// Imports Componentes
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MConceptoFacturaComponent } from './components/management/conceptosFacturas/m-concepto.component';
import { MContactoComponent } from './components/management/contactos/m-contacto.component';
import { MEmpresaComponent } from './components/management/empresas/m-empresa.component';
import { MFacturaComponent } from './components/management/facturas/m-factura.component';
import { MSeguimientoComponent } from './components/management/seguimiento/m-seguimiento.component';
import { MTareaComponent } from './components/management/tareas/m-tarea.component';
import { QConceptoFacturaComponent } from './components/query/conceptosFacturas/q-concepto.component';
import { QContactoComponent } from './components/query/contactos/q-contacto.component';
import { QEmpresaComponent } from './components/query/empresas/q-empresa.component';
import { QFacturaComponent } from './components/query/facturas/q-factura.component';
import { QSeguimientoComponent } from './components/query/seguimiento/q-seguimiento.component';
import { QTareaComponent } from './components/query/tareas/q-tarea.component';
import { RestaurarClaveComponent } from './components/restaurarClave/restaurarClave.component';
import { Guardian } from './config/Guardian';

// Imports Componentes Internos
import { MessageService } from 'primeng/api';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LandComponent } from './components/land/land.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { Enumerados } from './config/Enumerados';
import { ObjectModelInitializer } from './config/ObjectModelInitializer';
import { SesionService } from './services/sesionService/sesion.service';

// Constantes
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  "bgsColor": "#fff",
  "bgsOpacity": 0.5,
  "bgsPosition": "bottom-right",
  "bgsSize": 60,
  "bgsType": "three-strings",
  "blur": 5,
  "fgsColor": "#fff",
  "fgsPosition": "center-center",
  "fgsSize": 180,
  "fgsType": "three-strings",
  "gap": 24,
  "logoPosition": "center-center",
  "logoSize": 40,
  "masterLoaderId": "master",
  "overlayBorderRadius": "0",
  "overlayColor": "rgba(40, 40, 40, 0.8)",
  "pbColor": "#761e0e",
  "pbDirection": "ltr",
  "pbThickness": 3,
  "hasProgressBar": true,
  "text": "",
  "textColor": "#FFFFFF",
  "textPosition": "center-center"
};


// Componentes
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    RestaurarClaveComponent,
    QContactoComponent,
    MContactoComponent,
    QTareaComponent,
    MTareaComponent,
    QEmpresaComponent,
    MEmpresaComponent,
    QFacturaComponent,
    MFacturaComponent,
    QConceptoFacturaComponent,
    MConceptoFacturaComponent,
    QSeguimientoComponent,
    MSeguimientoComponent,
    LandComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgSelectModule,
    NiceSelectModule,
    RouterModule,

    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    MessagesModule,
    MessageModule,
    ToastModule,
    NgxJsonViewerModule,
    //GMapModule,
    //ScrollPanelModule,
    //GalleriaModule,
    CardModule,
    TimelineModule,
    TooltipModule,
    ConfirmPopupModule,
    CheckboxModule,
    ButtonModule,
    ChartModule,
    CalendarModule,
    TableModule,
    //SliderModule,
    //FieldsetModule,
    DialogModule,
    OrganizationChartModule,
    ColorPickerModule
  ],
  providers: [TextProperties, Enumerados, ObjectModelInitializer, Guardian, Util, Functions, MessageService, ConfirmationService, SesionService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }