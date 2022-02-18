/* eslint-disable */
const VueHtmlToPaper = function (dom, cb) {
  if (!(this instanceof VueHtmlToPaper)) return new VueHtmlToPaper(dom, cb);
  if (!cb) cb = function () { return true; };
  if ((typeof dom) === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.isDOM(dom)
    this.dom = this.isDOM(dom) ? dom : dom.$el;
  }

  const styles = this.getStyle();
  const content = this.getHtml();
  const defaultName = '_blank',
    defaultSpecs = ['fullscreen=yes','titlebar=yes', 'scrollbars=yes'],
    defaultReplace = true;
  const url = '';
  const win = window.open(url, defaultName, defaultSpecs, defaultReplace);

  win.document.write(`
    <html>
      <head>
        <title>${document.title}</title>
        ${styles}
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

  setTimeout(() => {
    win.document.close();
    win.focus();
    win.print();
    win.close();
    cb();
  }, 1000);

  return true;
}

VueHtmlToPaper.prototype = {
  calenderFlag: false,
  getStyle: function () {
    var str = "",
      styles = document.querySelectorAll('style, link');
    if (document.getElementById('calender-task-flag')) {
      this.calenderFlag = true;
    }
    if (this.calenderFlag) {
      const c_height = window.innerHeight;
      const c_width = window.innerWidth;
      const boxes = document.getElementsByClassName('resize-box');
      for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const width = this.getAttr(box, 'width');
        const height = this.getAttr(box, 'height');
        const top = this.getAttr(box, 'top');
        const left = this.getAttr(box, 'left');
        //const widthScale = 1;
        const widthScale = 0.8;

        //parent.style.width = this.pxStrToNumber(width) / widthScale / c_width * 100 + '%';
        box.style.width = this.pxStrToNumber(width) / widthScale / c_width * 100 + '%';
        //parent.style.height = this.pxStrToNumber(height) / c_height * 100 + '%';
        box.style.height = this.pxStrToNumber(height) / c_height * 100 + 'vh';

        box.style.left = this.pxStrToNumber(left) / widthScale / c_width * 100+ '%';
        box.style.top = this.pxStrToNumber(top) / c_height * 100 + 'vh';
        box.style.border = '0.5px solid #909399';
        box.style.color = 'white';
        this.prefixStyle('transform');
        document.getElementById('printMe');
        //container.style[transform] = 'scale(0.5) translate(-50%, -50%)';
        // container.style.height = '100vh';
        // container.style.overflow = 'hidden';
      }
    }
    for (var i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }

    str += "<style>" + '.no-print' + "{display:none;}</style>";
    str += "<style> body { margin: 0; padding: 0 } </style>";

    return str;
  },
  getHtml: function () {
    var inputs = document.querySelectorAll('input');
    var textareas = document.querySelectorAll('textarea');
    var selects = document.querySelectorAll('select');

    for (var k = 0; k < inputs.length; k++) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', "checked")
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute('value', inputs[k].value)
      } else {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (var k2 = 0; k2 < textareas.length; k2++) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value
      }
    }

    for (var k3 = 0; k3 < selects.length; k3++) {
      if (selects[k3].type == 'select-one') {
        var child = selects[k3].children;
        for (var i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', "selected")
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }
    return this.dom.outerHTML;
  },
  isDOM: (typeof HTMLElement === 'object') ?
    function (obj) {
      return obj instanceof HTMLElement;
    } :
    function (obj) {
      return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
    },
  getAttr: function(element, attr) {
    return window.getComputedStyle ? window.getComputedStyle(element, )[attr] : element.currentStyle[attr];
  },
  pxStrToNumber: function(pxStr) {
    return Number(pxStr.slice(0, pxStr.length - 2));
  },

  vender: (function() {
    let elementStyle = document.createElement('div').style;
    let transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform',
    };

    for(let key of Object.keys(transformNames)) {
      if (elementStyle[transformNames[key]] !== undefined) return key;
    }

    return false;
  })(),
  prefixStyle: function(style) {
    if (this.vender === false) return false;
    if (this.vender === 'standard') return style;
    return this.vender + style.charAt(0).toUpperCase() + style.substr(1);
  }
}


export default VueHtmlToPaper;
