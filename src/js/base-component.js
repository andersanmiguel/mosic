class EventBus extends HTMLElement {}
customElements.define('event-bus', EventBus);

const eventBus = document.createElement('event-bus');
document.body.append(eventBus);

class BaseComponent extends HTMLElement {

  noRender = false;

  constructor() {
    super();
    this.$evt = eventBus;
    this.beforeMount();
    /*
    const handlerData = {

      _this: this,

      set(obj, prop, value) {
        obj[prop] = value;
        // this._this.render();
        return true;
      },

      get(obj, prop) {
        return obj[prop]; 
      }

    };

    this.data = new Proxy({}, handlerData);
    */
  }

  static get observedAttributes() {
    return this.properties;
  }

  connectedCallback() {
    this.loadComponents();
    // avoid double render on data driven components
    if (!this.noRender) {
      this.render();
    }

    this.mounted();
  }

  disconnnectedCallback() {
    this.destroyed();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  loadComponents() {
    if (!this.components) {
      return;
    }
    this.components.forEach(this.importElement);
  }

  async importElement(path) {
    return import(path).then((module) => {
      const exists = customElements.get(module.default.tagName);
      if (!exists) {
        customElements.define(module.default.tagName, module.default);
      }
    });
  }

  async apiRequest(queryString) {

    const query = queryString || this.queryString;

    try {
      const response = await fetch('http://192.168.1.37:8888/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query)
      });

      if (typeof response !== 'undefined') {
        return response.json();
      }
    } catch(e) {
      return null;
    }
  }

  beforeMount() {
    return;
  }

  mounted() {
    return;
  }

  destroyed() {
    return;
  }

  bindAttrs() {
    const $el = this.querySelector('[bind]');
    if (!$el?.attributes) {
      return;
    }

    const attrs = [];

    for (let i = 0; i < $el.attributes.length; i++) {
      const name = $el.attributes[i].nodeName;
      const val = $el.attributes[i].value;

      if (!name.startsWith('bind') || name === 'bind') {
        continue;
      }
      attrs.push( { name, val } );
    }

    attrs.forEach(attr => {
      const val = this.d[attr.val] || attr.val;
      const attrValue = typeof val != 'string' ? JSON.stringify(val) : val;
      $el.setAttribute(attr.name.replace('bind-', ''), attrValue);
    });

  }

  render(html, el) {
    const htmlString = html || this.html;
    const container = el || this;
    const frag = document.createRange().createContextualFragment(htmlString);
    container.replaceChildren(frag);

    this.bindAttrs();

    /*
    var xpath = '//*[@*[starts-with(name(), "bind-")]]';
    var result = document.evaluate(xpath, this, null, XPathResult.ANY_TYPE, null);
    var node = {};
    this.nodes = new Set();
    while(node = result.iterateNext()) {
      this.nodes.add(node);
    }

    for (let item of this.nodes) {
      // console.log('item', this, item);
    }
    */
  }

}

export default BaseComponent;
