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
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';


// Imports Utilidades
import { TextProperties } from './config/TextProperties';
import { Functions } from './config/Functions';
import { Util } from './config/Util';
import { GoogleMapsModule } from '@angular/google-maps'
import { AgmCoreModule } from '@agm/core';

// Imports Esenciales
import { AppRoutingModule } from './config/Routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NiceSelectModule } from "ng-nice-select";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

// Imports Componentes
import { AppComponent } from './app.component';
import { Guardian } from './config/Guardian';
import { HomeComponent } from './components/home/home.component';
import { RestaurarClaveComponent } from './components/restaurarClave/restaurarClave.component';
import { QContactoComponent } from './components/query/contactos/q-contacto.component';
import { MContactoComponent } from './components/management/contactos/m-contacto.component';
import { QSeguimientoComponent } from './components/query/seguimiento/q-seguimiento.component';
import { MSeguimientoComponent } from './components/management/seguimiento/m-seguimiento.component';
import { QTareaComponent } from './components/query/tareas/q-tarea.component';
import { MTareaComponent } from './components/management/tareas/m-tarea.component';
import { QEmpresaComponent } from './components/query/empresas/q-empresa.component';
import { MEmpresaComponent } from './components/management/empresas/m-empresa.component';
import { QFacturaComponent } from './components/query/facturas/q-factura.component';
import { MFacturaComponent } from './components/management/facturas/m-factura.component';
import { QConceptoFacturaComponent } from './components/query/conceptosFacturas/q-concepto.component';
import { MConceptoFacturaComponent } from './components/management/conceptosFacturas/m-concepto.component';

// Imports Componentes Internos
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Enumerados } from './config/Enumerados';
import { ObjectModelInitializer } from './config/ObjectModelInitializer';
import { MessageService } from 'primeng/api';
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
    MSeguimientoComponent
  ],
  imports: [
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyBaNBQN5zBRz7h5lUKB4GGZQHhakKrajSA' }),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    GoogleMapsModule,
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
    DialogModule
  ],
  providers: [TextProperties, Enumerados, ObjectModelInitializer, Guardian, Util, Functions, MessageService, ConfirmationService, SesionService, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }