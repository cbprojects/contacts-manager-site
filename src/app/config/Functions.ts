import { Injectable } from '@angular/core';
declare var $: any;
//import {funciones} from '../../../src/assets/js/masterJS';
export var numeroDecimales = 2;

@Injectable()
export class Functions {
  bubblyBtn() {
    var animateButton = function (e: any) {
      e.preventDefault;
      //reset animation
      e.target.classList.remove('animate');

      e.target.classList.add('animate');
      setTimeout(function () {
        e.target.classList.remove('animate');
      }, 700);
    };

    var bubblyButtons = document.getElementsByClassName("bubbly-button");

    for (var i = 0; i < bubblyButtons.length; i++) {
      bubblyButtons[i].addEventListener('click', animateButton, false);
    }
  }
}


export function onlyNumbers(e: any) {
  var key = e.keyCode || e.which;
  var keyboard = String.fromCharCode(key).toLowerCase();
  var letters = " 0123456789";
  var specials = [8, 37, 39, 46];

  var special_key = false
  for (var i in specials) {
    if (key === specials[i]) {
      special_key = true;
      break;
    }
  }

  if (letters.indexOf(keyboard) === -1 && !special_key) {
    return false;
  }
  return true;
}

export function onlyNumbersPlus(e: any) {
  var key = e.keyCode || e.which;
  var keyboard = String.fromCharCode(key).toLowerCase();
  var letters = " 0123456789-.,";
  var specials = [8, 37, 39, 46];

  var special_key = false
  for (var i in specials) {
    if (key === specials[i]) {
      special_key = true;
      break;
    }
  }

  if (letters.indexOf(keyboard) === -1 && !special_key) {
    return false;
  }
  return true;
}

// -- Funciones para carousel flickity --
export function cargarCarousels() {
  try {
    var carouselFli = $('.carouselFL');
    if (typeof carouselFli !== 'undefined' && carouselFli !== 'null' && carouselFli !== null && carouselFli.length > 0) {
      $('.carouselFL').flickity({
        cellAlign: 'left',
        freeScroll: false,
        contain: true,
        prevNextButtons: true,
        pageDots: false,
        wrapAround: true,
        autoPlay: 2000
      });
      $('.carouselFL').flickity('resize');
    }
  } catch (error) {
    console.log(error);
  }
}