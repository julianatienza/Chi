import {chi} from './chi.js';

export class Util {

  static removeClass (elem, className) {
    elem.className = elem.className.split(' ').filter(function (v) {
      return v !== className;
    }).join(' ');
  }

  static addClass (elem, className) {
    if (!Util.hasClass(elem, className)) {
      elem.className += ' ' + className;
    }
  }

  static hasClass (elem, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(elem.className);
  }

  static toggleClass (elem, className) {
    if (Util.hasClass(elem, className)) {
      Util.removeClass(elem, className);
    } else {
      Util.addClass(elem, className);
    }
  }

  static getTarget (element) {
    let selector = element.dataset && element.dataset.target ?
      element.dataset.target.trim() :
      '';
    if (!selector) {
      const hrefTarget = element.getAttribute('href');
      selector = hrefTarget ? hrefTarget.trim() : '';
    }
    return selector ? document.querySelector(selector) : null;
  }

  static findAndApply (ancestor, className, callback) {
    if (Util.hasClass(ancestor, className)) {
      callback(ancestor);
    } else if (ancestor.getElementsByClassName) {
      Array.prototype.forEach.call(
        ancestor.getElementsByClassName(className), function (elem) {
          callback(elem);
        }
      );
    }
  }

  static emulateTransitionEnd (transitionDuration, eventHandler) {
    window.setTimeout(eventHandler, transitionDuration);
  }

  static setData (elem, key, value) {
    Util.prepareDataStructure(elem);
    elem[chi.expando][key] = value;
  }

  static getData (elem, key) {
    return elem[chi.expando] && elem[chi.expando][key];
  }

  static removeData (elem, key) {
    delete elem[chi.expando][key];
    if (elem[chi.expando].length === 0) {
      Util.removeDataStructure(elem);
    }
  }

  static prepareDataStructure (elem) {
    if (!elem[chi.expando]) {
      elem[chi.expando] = {};
    }
  }

  static removeDataStructure (elem) {
    delete elem[chi.expando];
  }


  static registerComponent (type, elem, obj) {
    let index = Util._getNewRegistrationIndex();
    Util.setData(elem, type, index);
    if (!chi.registeredComponents[type]) {
      chi.registeredComponents[type] = {};
    }
    chi.registeredComponents[type][index] = obj;
  }

  static unregisterComponent (type, elem) {
    let index = Util.getData(elem, type);
    if (chi.registeredComponents[type]) {
      delete chi.registeredComponents[type][index];
    }
    Util.removeData(elem, type);
  }

  static getRegisteredComponent (type, elem) {
    let index = Util.getData(elem, type);
    if (index || index === 0) {
      return chi.registeredComponents[type] &&
        chi.registeredComponents[type][index];
    } else {
      return false;
    }
  }

  static extend (a, b) {
    if (!b) {
      return a;
    }
    for (let key in b) {
      if (b[key] === undefined) {
        delete a[key];
      } else {
        a[key] = b[key];
      }
    }
    return a;
  }

  static addArraySupportToFactory (factoryMethod) {
    return function(elem) {
      if (
        Array.isArray(elem) ||
        NodeList.prototype.isPrototypeOf(elem) ||
        HTMLCollection.prototype.isPrototypeOf(elem)
      ) {
        const returnV = [];
        Array.prototype.forEach.call(elem, function(e) {
          returnV.push(factoryMethod(e));
        });
        return returnV;
      } else {
        return factoryMethod(elem);
      }
    };
  }

  static isNumeric (n) {
    return ( typeof n === "number" || typeof n === "string" ) &&
      !isNaN( n - parseFloat( n ) );
  }

  static isInteger (n) {
    return typeof n === 'number' &&
      isFinite(n) &&
      Math.floor(n) === n;
  }

  static createEvent (eventType) {
    let event;
    if(typeof Event  === 'function') {
      event = new Event(eventType);
    }else{
      event = document.createEvent('Event');
      event.initEvent(eventType, true, true);
    }
    return event;
  }

  static _getNewRegistrationIndex () {
    return chi.componentIndex++;
  }
}