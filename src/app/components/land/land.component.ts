import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import anime from 'animejs';
declare var $: any;
import { MessageService, TreeNode } from 'primeng/api';
// import ScrollReveal from 'scrollreveal';
import { Enumerados } from 'src/app/config/Enumerados';
import { ObjectModelInitializer } from 'src/app/config/ObjectModelInitializer';
import { TextProperties } from 'src/app/config/TextProperties';
import { Util } from 'src/app/config/Util';
import { ContactoModel } from 'src/app/model/contacto-model';
import { RequestContactoEMailDTOModel } from 'src/app/model/dto/request-contacto-email-dto';
import { ResponseEMailDTOModel } from 'src/app/model/dto/response-email-dto';
import { RestService } from 'src/app/services/rest.service';
import { SesionService } from 'src/app/services/sesionService/sesion.service';

@Component({
  selector: 'app-land',
  templateUrl: './land.component.html',
  styleUrls: ['./land.component.scss']
})
export class LandComponent implements OnInit {
  // Objetos de datos
  tituloIndustria: any;
  descripcionIndustria: any;
  arbolIndustria: TreeNode[] = [];
  nodoIndustriaSelect: TreeNode | undefined;
  contactoModel: ContactoModel = this.objectModelInitializer.getDataContactoModel();
  verMasIndustrias: boolean = false;
  industries: any[] = [];
  listaRefPorcentajesUri: any[] = [];
  displayContactoOK: boolean = false;
  mailDTO: RequestContactoEMailDTOModel = this.objectModelInitializer.getDataRequestContactoEmailDtoModel();
  mailResponseDTO: ResponseEMailDTOModel | undefined;
  tipoArbol: any;

  // Utilidades
  msg: any;
  const: any;

  constructor(private router: Router, private route: ActivatedRoute, public sesionService: SesionService, public restService: RestService, public textProperties: TextProperties, public util: Util, public objectModelInitializer: ObjectModelInitializer, public enumerados: Enumerados, private messageService: MessageService) {
    this.msg = this.textProperties.getProperties(1);
    this.const = this.objectModelInitializer.getConst();
    this.listaRefPorcentajesUri = this.util.cargarMatrizPorcentajeUri();
  }

  ngOnInit(): void {
    this.displayContactoOK = false;
    this.messageService.clear();
    localStorage.clear();
    this.inicializar();
    // ScrollReveal().reveal(".feature, .pricing-table-inner", { duration: 1000, distance: "20px", easing: "cubic-bezier(0.5, -0.01, 0, 1.005)", origin: "bottom", interval: 200 });
    // $('.bodyAnim').addClass("anime-ready"),
    //   anime
    //     .timeline({ targets: ".hero-figure-box-05" })
    //     .add({ duration: 800, easing: "easeInOutExpo", scaleX: [0.05, 0.05], scaleY: [0, 1], perspective: "500px", delay: anime.random(0, 400) })
    //     .add({ duration: 800, easing: "easeInOutExpo", scaleX: 1 })
    //     .add({ duration: 1600, rotateY: "-15deg", rotateX: "8deg", rotateZ: "-1deg" }),
    //   anime
    //     .timeline({ targets: ".hero-figure-box-06, .hero-figure-box-07" })
    //     .add({ duration: 800, easing: "easeInOutExpo", scaleX: [0.05, 0.05], scaleY: [0, 1], perspective: "500px", delay: anime.random(0, 400) })
    //     .add({ duration: 800, easing: "easeInOutExpo", scaleX: 1 })
    //     .add({ duration: 1600, rotateZ: "20deg" }),
    //   anime({
    //     targets: ".hero-figure-box-01, .hero-figure-box-02, .hero-figure-box-03, .hero-figure-box-04, .hero-figure-box-08, .hero-figure-box-09, .hero-figure-box-10",
    //     duration: anime.random(1200, 1600),
    //     delay: anime.random(1200, 1600),
    //     rotate: [
    //       anime.random(-360, 360),
    //       function (e) {
    //         return e.getAttribute("data-rotation");
    //       },
    //     ],
    //     scale: [0.7, 1],
    //     opacity: [0, 1],
    //     easing: "easeInOutExpo",
    //   })
  }

  inicializar() {
    this.industries = [];
    let contactMailSesion = localStorage.getItem("contactoMailContactM");
    if (contactMailSesion !== undefined && contactMailSesion !== null) {
      this.contactoModel = JSON.parse(contactMailSesion);
      this.llenarContactoSesion();
    } else {
      let URLactual = this.util.transformarSimboloUri(window.location.href, this.listaRefPorcentajesUri);
      if (URLactual.split('?').length === 2) {
        let variableContacto = URLactual.split("#")[1].split("?")[1].split("=")[0];
        let contacto: string = URLactual.split("#")[1].split("?")[1].split("=")[1];
        this.contactoModel = JSON.parse(contacto);
        this.sesionService.objContactoCargado = this.contactoModel;
        localStorage.setItem("contactoMailContactM", JSON.stringify(this.sesionService.objContactoCargado));
        if (this.contactoModel !== undefined && this.contactoModel !== null && this.contactoModel.industria !== undefined && this.contactoModel.industria !== null && variableContacto === this.const.tokenRecordarClave) {
          this.llenarContactoSesion();
          this.router.navigate(['/land']);
        }
      }
    }
  }

  getIndustriaBGIMG(id: number) {
    let bgImgn = "";
    switch (id) {
      case 1:
        bgImgn = "alimenticia";
        break;
      case 2:
        bgImgn = "farmaceutica";
        break;
      case 3:
        bgImgn = "automotriz";
        break;
      case 4:
        bgImgn = "construccion";
        break;
      case 5:
        bgImgn = "general";
        break;
      case 6:
        bgImgn = "metalurgica";
        break;
      case 7:
        bgImgn = "quimica";
        break;
      case 8:
        bgImgn = "textil";
        break;
      case 9:
        bgImgn = "comercial";
        break;
    }

    return bgImgn;
  }

  cargarIndustrias() {
    this.industries = [];
    let industriasEnums = this.enumerados.getEnumerados().industria.valores;
    industriasEnums.forEach(industry => {
      if (industry.value > 0) {
        let bgImgn = this.getIndustriaBGIMG(industry.value);
        let industria = { id: industry.value, imagen: bgImgn + ".jpg", nombre: industry.label, descripcion: 'Entra al enlace para ver los servicios y poder descargar los documentos con especificaciones técnicas de cada industria.' };
        this.industries.push(industria);
      }
    });
  }

  seleccionarIndustria(industria: any) {
    this.contactoModel.industria = industria.id;
    this.tituloIndustria = industria.nombre;
    // dependiendo de la industria se llena el arbol, bg y la descripción
    setTimeout(() => {
      this.devolverClaseBG(industria.id);
    }, 10);
    this.descripcionIndustria = this.obtenerDescripcionIndustria(industria.id);
    this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    this.verMasIndustrias = false;
    this.posicionarArriba();
  }

  llenarContactoSesion() {
    this.tituloIndustria = this.util.getEmunName(this.enumerados.getEnumerados().industria.valores, this.contactoModel.industria);
    // dependiendo de la industria se llena el arbol, bg y la descripción
    setTimeout(() => {
      this.devolverClaseBG(this.contactoModel.industria);
    }, 10);
    this.descripcionIndustria = this.obtenerDescripcionIndustria(this.contactoModel.industria);
    this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
  }

  devolverClaseBG(idIndustria: any) {
    let bgClass = this.getIndustriaBGIMG(idIndustria);
    setTimeout(() => {
      $('.site-header').addClass('bg-industria-' + bgClass);
    }, 10);
  }

  obtenerDescripcionIndustria(idIndustria: number) {
    let descripcion = "";
    switch (idIndustria) {
      case 1:
        descripcion = "La Industria Alimenticia es la parte de la industria que se encarga de todos los procesos relacionados con la cadena alimenticia. Se incluyen dentro del concepto las fases de transporte, recepción, almacenamiento, procesamiento, conservación, y servicio de alimentos de consumo humano y animal.";
        break;
      case 2:
        descripcion = "La Industria Farmacéutica es un sector empresarial dedicado a la fabricación, preparación y comercialización de productos químicos medicinales para el tratamiento y también la prevención de las enfermedades.";
        break;
      case 3:
        descripcion = "La Industria Automotriz es un conjunto de compañías y organizaciones relacionadas en las áreas de diseño, desarrollo, manufactura, marketing y ventas de automóviles.​ Es uno de los sectores económicos más importantes en el mundo por ingresos.";
        break;
      case 4:
        descripcion = "La Industria de la Construcción en México ha sido responsables de la planeación, diseño y desarrollo de la infraestructura del país, ya sea con la edificación de puentes, carreteras, puertos, vías férreas, plantas generadoras de energía eléctrica, presas, hospitales, escuelas, viviendas, entre otros, o generando beneficios a 66 ramas de actividad económica a nivel nacional, convirtiendo al sector en uno de los principales motores de nuestra economía gracias a que utiliza insumos provenientes de otras industrias como el acero, cemento, arena, madera, etc.";
        break;
      case 5:
        descripcion = "La Industria en General es la actividad económica que se basa en la producción de bienes a gran escala con la ayuda de máquinas especializadas. El trabajo de industria se refiere generalmente al trabajo en una fábrica y los bienes que se producen mediante la transformación de materias primas en productos manufacturados.";
        break;
      case 6:
        descripcion = "La Industria Metalúrgica es el sector de la industria que se basa en la técnica de la obtención y tratamiento de los metales a partir de minerales metálicos, estudios sobre la producción de aleaciones y el control de calidad de los procesos.";
        break;
      case 7:
        descripcion = "La Industria Química se ocupa de la extracción y procesamiento de materias primas, tanto naturales como sintéticas, y de su transformación en otras sustancias con características diferentes de las que tenían originalmente, para satisfacer las necesidades de las personas, mejorando su calidad de vida.";
        break;
      case 8:
        descripcion = "La Industria Textil es el sector de la industria dedicado a la producción de fibras (fibra natural y sintética), hilados, telas y productos relacionados con la confección de ropa.";
        break;
      case 9:
        descripcion = "La Industria Comercial se encarga de adquirir mercancías de algún tipo para luego venderlas a los consumidores o a otras empresas. La Industria Hotelera engloba a todos aquellos establecimientos dedicados a proveer un servicio de alojamiento y comida a huéspedes permanentes o transeúntes.";
        break;
    }

    return descripcion;
  }

  crearNodo(labelTxt: string, bgImgn: string, idRowNodo: any, mensaje: string) {
    return {
      label: labelTxt,
      type: 'industryNoImg',
      styleClass: 'p-person',
      expanded: true,
      data: { name: mensaje, rowNodo: idRowNodo, avatar: `${bgImgn}.jpg` },
      children: []
    };
  }

  construirArbol(idIndustria: number) {
    let bgImgn = this.getIndustriaBGIMG(idIndustria);
    let arbol = [];
    let nodoPadre = {
      label: this.tituloIndustria,
      type: 'industry',
      styleClass: 'p-person',
      expanded: true,
      data: { name: 'Servicios', rowNodo: 1, avatar: bgImgn + '.jpg' },
      children: [] as any[]
    };
    nodoPadre.children.push(this.crearNodo('Currículum Vitae', bgImgn, 2, '(Click) para descargar archivo'));
    if (bgImgn === 'automotriz' || bgImgn === 'alimenticia') {
      this.tipoArbol = 0; // Ind. Automotriz, Alimenticia
      nodoPadre.children.push(this.crearNodo('Pisos Conductivos ESD', bgImgn, 3, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo(this.tituloIndustria, bgImgn, 4, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Sistemas Epóxicos', bgImgn, 5, '(Click) para ver más'));
      //nodoPadre.children.push(this.crearNodo('Sistemas HVAC', bgImgn, 6, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Acabados para Cisterna', bgImgn, 6, '(Click) para descargar archivo'));
    } else if (bgImgn === 'construccion') {
      this.tipoArbol = 1; // Ind. Construcción
      nodoPadre.children.push(this.crearNodo('Pisos Conductivos ESD', bgImgn, 3, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Obra Civil', bgImgn, 4, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Restauración de Piso muy Dañado', bgImgn, 5, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Acabados Restaurantes y Plazas Comerciales', bgImgn, 6, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Acabados para Cisternas', bgImgn, 7, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Cancelería Sanitaria', bgImgn, 8, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Sistemas HVAC', bgImgn, 9, '(Click) para descargar archivo'));
    } else if (bgImgn === 'comercial') {
      this.tipoArbol = 2; // Ind. Comercial
      nodoPadre.children.push(this.crearNodo('Acabados Restaurantes y Plazas Comerciales', bgImgn, 3, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Colocación de Franjas', bgImgn, 4, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Acabados para Cisterna', bgImgn, 5, '(Click) para descargar archivo'));
    } else if (bgImgn === 'farmaceutica' || bgImgn === 'quimica') {
      this.tipoArbol = 3; // Ind. Farmacéutica, Química
      nodoPadre.children.push(this.crearNodo('Pisos Conductivos ESD', bgImgn, 3, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo(this.tituloIndustria, bgImgn, 4, '(Click) para descargar archivo'));
      nodoPadre.children.push(this.crearNodo('Sistemas Epóxicos', bgImgn, 5, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Sistemas HVAC', bgImgn, 6, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Acabados para Cisterna', bgImgn, 7, '(Click) para descargar archivo'));
    } else {
      this.tipoArbol = 4; // Otras Industrias
      nodoPadre.children.push(this.crearNodo('Pisos Conductivos ESD', bgImgn, 3, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Sistemas Epóxicos', bgImgn, 4, '(Click) para ver más'));
      //nodoPadre.children.push(this.crearNodo('Sistemas HVAC', bgImgn, 5, '(Click) para ver más'));
      nodoPadre.children.push(this.crearNodo('Acabados para Cisterna', bgImgn, 5, '(Click) para descargar archivo'));
    }
    arbol.push(nodoPadre);

    return arbol;
  }

  onNodeSelect(event: any) {
    // let bgImgn = this.getIndustriaBGIMG(this.contactoModel.industria);
    // switch (event.node.data.rowNodo) {
    //   case 2:
    //     this.descargarCV('cv.pdf');
    //     break;
    //   case 3:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-pisos-conductivos.pdf`);
    //     } else if (this.tipoArbol === 2) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[1].children = [];
    //       let item6 = this.crearNodo('Acabados Pisos Metalizados', bgImgn, 6, '(Click) para descargar archivo');
    //       let item7 = this.crearNodo('Hojuelas Decorativas', bgImgn, 7, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[1].children.push(item6);
    //       this.arbolIndustria[0].children[1].children.push(item7);
    //       this.ajustarScrollHArbol();
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[1].children = [];
    //       let item8 = this.crearNodo('Forma y Uso', bgImgn, 8, '(Click) para descargar archivo');
    //       let item9 = this.crearNodo('Colocación en Laboratorio', bgImgn, 9, '(Click) para descargar imágenes');
    //       this.arbolIndustria[0].children[1].children.push(item8);
    //       this.arbolIndustria[0].children[1].children.push(item9);
    //     } else if (this.tipoArbol === 4) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[1].children = [];
    //       let item7 = this.crearNodo('Forma y Uso', bgImgn, 7, '(Click) para descargar archivo');
    //       let item8 = this.crearNodo('Colocación en Laboratorio', bgImgn, 8, '(Click) para descargar imágenes');
    //       this.arbolIndustria[0].children[1].children.push(item7);
    //       this.arbolIndustria[0].children[1].children.push(item8);
    //     }
    //     break;
    //   case 4:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-obra-civil.pdf`);
    //     } else if (this.tipoArbol === 2) {
    //       this.descargarDocumento(`${bgImgn}-franjas.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`${bgImgn}-ind.pdf`);
    //     } else if (this.tipoArbol === 4) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[2].children = [];
    //       let item9 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 9, '(Click) para descargar videos');
    //       let item10 = this.crearNodo('Tipos de Acabado', bgImgn, 10, '(Click) para ver más');
    //       let item11 = this.crearNodo('Restauración de Juntas', bgImgn, 11, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[2].children.push(item9);
    //       this.arbolIndustria[0].children[2].children.push(item10);
    //       this.arbolIndustria[0].children[2].children.push(item11);
    //       this.ajustarScrollHArbol();
    //     }
    //     break;
    //   case 5:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-piso-dañado.pdf`);
    //     } else if (this.tipoArbol === 2) {
    //       this.descargarDocumento(`${bgImgn}-cisternas.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[3].children = [];
    //       let item10 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 10, '(Click) para descargar videos');
    //       let item11 = this.crearNodo('Tipos de Acabado', bgImgn, 11, '(Click) para ver más');
    //       let item12 = this.crearNodo('Restauración de Juntas', bgImgn, 12, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[3].children.push(item10);
    //       this.arbolIndustria[0].children[3].children.push(item11);
    //       this.arbolIndustria[0].children[3].children.push(item12);
    //       this.ajustarScrollHArbol();
    //     } else if (this.tipoArbol === 4) {
    //       /*this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[3].children = [];
    //       let item12 = this.crearNodo('Cancelería', bgImgn, 12, '(Click) para descargar archivo');
    //       let item13 = this.crearNodo('Sistemas HVAC', bgImgn, 13, '(Click) para descargar archivo');
    //       let item14 = this.crearNodo('Piso, Pared y Plafón', bgImgn, 14, '(Click) para descargar video');
    //       let item15 = this.crearNodo('Puertas Sanitarias', bgImgn, 15, '(Click) para descargar video');
    //       let item16 = this.crearNodo('Curva Sanitaria', bgImgn, 16, '(Click) para descargar imágenes');
    //       this.arbolIndustria[0].children[3].children.push(item12);
    //       this.arbolIndustria[0].children[3].children.push(item13);
    //       this.arbolIndustria[0].children[3].children.push(item14);
    //       this.arbolIndustria[0].children[3].children.push(item15);
    //       this.arbolIndustria[0].children[3].children.push(item16);
    //       this.ajustarScrollHArbol();*/
    //       this.descargarDocumento(`otros-cisternas.pdf`);
    //     }
    //     break;
    //   case 6:
    //     if (this.tipoArbol === 0) {
    //       this.descargarDocumento(`otros-cisternas.pdf`);
    //     } else if (this.tipoArbol === 1) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[4].children = [];
    //       let item10 = this.crearNodo('Acabados Pisos Metalizados', bgImgn, 10, '(Click) para descargar archivo');
    //       let item11 = this.crearNodo('Hojuelas Decorativas', bgImgn, 11, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[4].children.push(item10);
    //       this.arbolIndustria[0].children[4].children.push(item11);
    //       this.ajustarScrollHArbol();
    //     } else if (this.tipoArbol === 2) {
    //       this.descargarDocumento(`${bgImgn}-acabados.pdf`);
    //     } else if (this.tipoArbol === 3) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[4].children = [];
    //       let item13 = this.crearNodo('Cancelería', bgImgn, 13, '(Click) para descargar archivo');
    //       let item14 = this.crearNodo('Sistemas HVAC', bgImgn, 14, '(Click) para descargar archivo');
    //       let item15 = this.crearNodo('Piso, Pared y Plafón', bgImgn, 15, '(Click) para descargar video');
    //       let item16 = this.crearNodo('Puertas Sanitarias', bgImgn, 16, '(Click) para descargar video');
    //       let item17 = this.crearNodo('Curva Sanitaria', bgImgn, 17, '(Click) para descargar imágenes');
    //       this.arbolIndustria[0].children[4].children.push(item13);
    //       this.arbolIndustria[0].children[4].children.push(item14);
    //       this.arbolIndustria[0].children[4].children.push(item15);
    //       this.arbolIndustria[0].children[4].children.push(item16);
    //       this.arbolIndustria[0].children[4].children.push(item17);
    //       this.ajustarScrollHArbol();
    //     }
    //     break;
    //   case 7:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-cisternas.pdf`);
    //     } else if (this.tipoArbol === 2) {
    //       this.descargarDocumento(`${bgImgn}-hojuelas.pdf`);
    //     } else if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-cisternas.pdf`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-pisos-conductivos.pdf`);
    //     }
    //     break;
    //   case 8:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-canceleria-sanitaria.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-pisos-conductivos.pdf`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-laboratorios-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-2.jpg`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-3.jpg`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-4.jpg`);
    //       }, 3000);
    //     }
    //     break;
    //   case 9:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-hvac.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-laboratorios-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-2.jpg`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-3.jpg`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-laboratorios-4.jpg`);
    //       }, 3000);
    //     }
    //     else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-desbaste-a.mp4`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-b.mp4`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-c.mp4`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-d.mp4`);
    //       }, 3000);
    //     }
    //     break;
    //   case 10:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-metalizados.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-desbaste-a.mp4`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-b.mp4`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-c.mp4`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-desbaste-d.mp4`);
    //       }, 3000);
    //     } else if (this.tipoArbol === 4) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[2].children = [];
    //       let item9 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 9, '(Click) para descargar videos');
    //       let item10 = this.crearNodo('Tipos de Acabado', bgImgn, 10, '(Click) para ver más');
    //       let item11 = this.crearNodo('Restauración de Juntas', bgImgn, 11, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[2].children.push(item9);
    //       this.arbolIndustria[0].children[2].children.push(item10);
    //       this.arbolIndustria[0].children[2].children.push(item11);
    //       item10.children.push(this.crearNodo('Autonivelante', bgImgn, 17, '(Click) para descargar video'));
    //       item10.children.push(this.crearNodo('Poliuretano', bgImgn, 18, '(Click) para descargar video'));
    //       item10.children.push(this.crearNodo('Carpeta de Mortero con Arena Sílica', bgImgn, 19, '(Click) para descargar imágenes'));
    //       item10.children.push(this.crearNodo('Acabado Resistente al Tráfico Pesado', bgImgn, 20, '(Click) para ver más'));
    //       item10.children.push(this.crearNodo('Antiderrapante', bgImgn, 21, '(Click) para descargar imágenes'));
    //       item10.children.push(this.crearNodo('Piso Abrillantado o Pulido', bgImgn, 22, '(Click) para descargar archivo'));
    //       item10.children.push(this.crearNodo('Acabados Epóxicos Industriales', bgImgn, 23, '(Click) para descargar archivo'));
    //       this.ajustarScrollHArbol();
    //     }
    //     break;
    //   case 11:
    //     if (this.tipoArbol === 1) {
    //       this.descargarDocumento(`${bgImgn}-hojuelas.pdf`);
    //     } else if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[3].children = [];
    //       let item10 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 10, '(Click) para descargar videos');
    //       let item11 = this.crearNodo('Tipos de Acabado', bgImgn, 11, '(Click) para ver más');
    //       let item12 = this.crearNodo('Restauración de Juntas', bgImgn, 12, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[3].children.push(item10);
    //       this.arbolIndustria[0].children[3].children.push(item11);
    //       this.arbolIndustria[0].children[3].children.push(item12);
    //       item11.children.push(this.crearNodo('Autonivelante', bgImgn, 18, '(Click) para descargar video'));
    //       item11.children.push(this.crearNodo('Poliuretano', bgImgn, 19, '(Click) para descargar video'));
    //       item11.children.push(this.crearNodo('Carpeta de Mortero con Arena Sílica', bgImgn, 20, '(Click) para descargar imágenes'));
    //       item11.children.push(this.crearNodo('Acabado Resistente al Tráfico Pesado', bgImgn, 21, '(Click) para ver más'));
    //       item11.children.push(this.crearNodo('Antiderrapante', bgImgn, 22, '(Click) para descargar imágenes'));
    //       item11.children.push(this.crearNodo('Piso Abrillantado o Pulido', bgImgn, 23, '(Click) para descargar archivo'));
    //       item11.children.push(this.crearNodo('Acabados Epóxicos Industriales', bgImgn, 24, '(Click) para descargar archivo'));
    //       this.ajustarScrollHArbol();
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-juntas.pdf`);
    //     }
    //     break;
    //   case 12:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-juntas.pdf`);
    //     }
    //     break;
    //   case 13:
    //     if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-canceleria.pdf`);
    //     }
    //     break;
    //   case 14:
    //     if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-hvac.pdf`);
    //     }
    //     break;
    //   case 15:
    //     if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-piso-pared-plafon.mp4`);
    //     }
    //     break;
    //   case 16:
    //     if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-puertas-sanitarias.mp4`);
    //     }
    //     break;
    //   case 17:
    //     if (this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-curvas-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-curvas-2.jpg`);
    //       }, 1000);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-autonivelante.mp4`);
    //     }
    //     break;
    //   case 18:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-autonivelante.mp4`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-poliuretano.mp4`);
    //     }
    //     break;
    //   case 19:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-poliuretano.mp4`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-as-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-2.jpg`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-3.jpg`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-4.jpg`);
    //       }, 3000);
    //     }
    //     break;
    //   case 20:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-as-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-2.jpg`);
    //       }, 1000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-3.jpg`);
    //       }, 2000);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-as-4.jpg`);
    //       }, 3000);
    //     } else if (this.tipoArbol === 4) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[2].children = [];
    //       let item9 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 9, '(Click) para descargar videos');
    //       let item10 = this.crearNodo('Tipos de Acabado', bgImgn, 10, '(Click) para ver más');
    //       let item11 = this.crearNodo('Restauración de Juntas', bgImgn, 11, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[2].children.push(item9);
    //       this.arbolIndustria[0].children[2].children.push(item10);
    //       this.arbolIndustria[0].children[2].children.push(item11);
    //       item10.children.push(this.crearNodo('Autonivelante', bgImgn, 17, '(Click) para descargar video'));
    //       item10.children.push(this.crearNodo('Poliuretano', bgImgn, 18, '(Click) para descargar video'));
    //       item10.children.push(this.crearNodo('Carpeta de Mortero con Arena Sílica', bgImgn, 19, '(Click) para descargar imágenes'));
    //       let item20 = this.crearNodo('Acabado Resistente al Tráfico Pesado', bgImgn, 20, '(Click) para ver más');
    //       item20.children.push(this.crearNodo('A Rayaduras', bgImgn, 24, '(Click) para descargar video'));
    //       item20.children.push(this.crearNodo('A Tráfico Pesado', bgImgn, 25, '(Click) para descargar video'));
    //       item10.children.push(item20);
    //       item10.children.push(this.crearNodo('Antiderrapante', bgImgn, 21, '(Click) para descargar imágenes'));
    //       item10.children.push(this.crearNodo('Piso Abrillantado o Pulido', bgImgn, 22, '(Click) para descargar archivo'));
    //       item10.children.push(this.crearNodo('Acabados Epóxicos Industriales', bgImgn, 23, '(Click) para descargar archivo'));
    //       this.ajustarScrollHArbol();
    //     }
    //     break;
    //   case 21:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.arbolIndustria = this.construirArbol(this.contactoModel.industria);
    //       this.arbolIndustria[0].children[3].children = [];
    //       let item10 = this.crearNodo('Desbaste de Piso de Concreto', bgImgn, 10, '(Click) para descargar video');
    //       let item11 = this.crearNodo('Tipos de Acabado', bgImgn, 11, '(Click) para ver más');
    //       let item12 = this.crearNodo('Restauración de Juntas', bgImgn, 12, '(Click) para descargar archivo');
    //       this.arbolIndustria[0].children[3].children.push(item10);
    //       this.arbolIndustria[0].children[3].children.push(item11);
    //       this.arbolIndustria[0].children[3].children.push(item12);
    //       item11.children.push(this.crearNodo('Autonivelante', bgImgn, 18, '(Click) para descargar video'));
    //       item11.children.push(this.crearNodo('Poliuretano', bgImgn, 19, '(Click) para descargar video'));
    //       item11.children.push(this.crearNodo('Carpeta de Mortero con Arena Sílica', bgImgn, 20, '(Click) para descargar imágenes'));
    //       let item21 = this.crearNodo('Acabado Resistente al Tráfico Pesado', bgImgn, 21, '(Click) para ver más');
    //       item21.children.push(this.crearNodo('A Rayaduras', bgImgn, 25, '(Click) para descargar video'));
    //       item21.children.push(this.crearNodo('A Tráfico Pesado', bgImgn, 26, '(Click) para descargar video'));
    //       item11.children.push(item21);
    //       item11.children.push(this.crearNodo('Antiderrapante', bgImgn, 22, '(Click) para descargar imágenes'));
    //       item11.children.push(this.crearNodo('Piso Abrillantado o Pulido', bgImgn, 23, '(Click) para descargar archivo'));
    //       item11.children.push(this.crearNodo('Acabados Epóxicos Industriales', bgImgn, 24, '(Click) para descargar archivo'));
    //       this.ajustarScrollHArbol();
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-antiderrapante-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-antiderrapante-2.jpg`);
    //       }, 1000);
    //     }
    //     break;
    //   case 22:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-antiderrapante-1.jpg`);
    //       setTimeout(() => {
    //         this.descargarDocumento(`otros-antiderrapante-2.jpg`);
    //       }, 1000);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-abrillantado.pdf`);
    //     }
    //     break;
    //   case 23:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-abrillantado.pdf`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-epox-industriales.pdf`);
    //     }
    //     break;
    //   case 24:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-epox-industriales.pdf`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-rayaduras.mp4`);
    //     }
    //     break;
    //   case 25:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-rayaduras.mp4`);
    //     } else if (this.tipoArbol === 4) {
    //       this.descargarDocumento(`otros-resistente.mp4`);
    //     }
    //     break;
    //   case 26:
    //     if (this.tipoArbol === 0 || this.tipoArbol === 3) {
    //       this.descargarDocumento(`otros-resistente.mp4`);
    //     }
    //     break;
    // }
  }

  descargarCV(nombreCV: string) {
    try {
      //const url = window.URL.createObjectURL(data);
      const url = `assets/doc/cvs/${nombreCV}`;
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      a.href = url;
      a.download = nombreCV;
      a.click();
    } catch (e) {
      console.log(e);
    }
  }

  descargarDocumento(nombreDoc: string) {
    try {
      //const url = window.URL.createObjectURL(data);
      const url = `assets/doc/${nombreDoc}`;
      const a = document.createElement('a');
      a.setAttribute('style', 'display:none');
      a.href = url;
      a.download = nombreDoc;
      a.click();
    } catch (e) {
      console.log(e);
    }
  }

  ajustarScrollHArbol() {
    setTimeout(() => {
      var outerContent = $('.outerArbol');
      outerContent.scrollLeft(outerContent.width());
    }, 10);
  }

  mostrarOtrasIndustrias() {
    this.cargarIndustrias();
    this.verMasIndustrias = true;
  }

  enviarEmailContactoOK() {
    try {
      let listaContactos: ContactoModel[] = [];
      listaContactos.push(this.contactoModel);

      // Conversiones de datos
      this.mailDTO = this.objectModelInitializer.getDataRequestContactoEmailDtoModel();
      this.mailDTO.desde = this.const.correoRemitente;
      this.mailDTO.asunto = "PROSPECTO NUEVO";
      this.mailDTO.destinatarios = listaContactos;
      if (this.mailDTO.destinatarios !== undefined && this.mailDTO.destinatarios !== null) {
        this.mailDTO.destinatarios.forEach(contacto => {
          contacto.fechaCreacion = new Date();
          contacto.fechaActualizacion = new Date();
        });
      }

      this.restService.postREST(this.const.urlEnviarEmailContactoCliente, this.mailDTO)
        .subscribe(resp => {
          let respuesta: ResponseEMailDTOModel = JSON.parse(JSON.stringify(resp));
          if (respuesta !== null) {
            // Mostrar mensaje de envios de correos exitoso o no
            this.displayContactoOK = true;
            this.messageService.clear();
            this.messageService.add({ severity: respuesta.exitoso ? this.const.severity[1] : this.const.severity[3], summary: respuesta.exitoso ? this.msg.lbl_summary_succes : this.msg.lbl_summary_danger, detail: respuesta.mensaje, sticky: true });
          }
        },
          error => {
            let listaMensajes = this.util.construirMensajeExcepcion(error.error, this.msg.lbl_summary_danger);
            let titleError = listaMensajes[0];
            listaMensajes.splice(0, 1);
            let mensajeFinal = { severity: titleError.severity, summary: titleError.detail, detail: '', sticky: true };
            this.messageService.clear();

            listaMensajes.forEach(mensaje => {
              mensajeFinal.detail = mensajeFinal.detail + mensaje.detail + " ";
            });
            this.messageService.add(mensajeFinal);

            console.log(error, "error");
          })
    } catch (e) {
      console.log(e);
    }
  }

  posicionarArriba() {
    $('body,html').animate({
      scrollTop: 0
    }, 600);
  }

  irHasta(id: string) {
    $(`#${id}`).animate({
      scrollTop: 0
    }, 600);
  }
}
