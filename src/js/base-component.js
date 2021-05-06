class EventBus extends HTMLElement {}
customElements.define('event-bus', EventBus);
const eventBus = document.createElement('event-bus');
document.body.append(eventBus);
import Queue from '/js/queue.js';
const queue = new Queue;

class BaseComponent extends HTMLElement {

  constructor() {
    super();
    this.queue = queue;
    // Render count => debug
    this.renderCounter = 0;
    // Event Bus => TODO: refactor, change to pub/sub?
    this.$evt = eventBus;

    // Data handling, if this.data.something is set, render the component
    const handlerData = {
      set(obj, prop, value) {
        obj[prop] = value;
        obj._this.debounceRender();
        return true;
      },
      get(obj, prop) {
        return obj[prop]; 
      }
    };
    this.data = new Proxy({_this: this}, handlerData);

    // Props handling, if this.props.something is set, check directives
    // TODO: rename
    const handlerProps = {
      set(obj, prop, value) {
        if (obj[prop] != value) {
          obj[prop] = value;
          obj._this.bindAttrs();
          obj._this.bindContent();
          obj._this.bindShow();
        }
        return true;
      },
      get(obj, prop) {
        return obj[prop]; 
      }
    };
    this.props = new Proxy({_this: this}, handlerProps);
    
    // Call beforemount hook
    this.beforeMount();
  }

  // Component is injected to page
  connectedCallback() {
    this.loadComponents();
    // First render if is not a data driven component
    // Avoid double rendering, refactor?
    if (!this.queryString) {
      this.render();
    }

    // Call mounted hook
    this.mounted();
  }

  disconnnectedCallback() {
    // Call destroyed hook (clean event listeners an such)
    this.destroyed();
  }

  // Properties to watch, trigger render on attributeChangedCallback
  static get observedAttributes() {
    return this.properties;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // console.log(name, oldValue, newValue);
    if (oldValue !== newValue) {
      // Set data => trigger rendering on handlerData
      this.data[name] = this.newValue;
    }
  }

  // Dynamic loading components
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
        if (!module.default.tagName) {
          throw Error(`Component ${ module.default.name } doesn't have tagName`);
        }
        customElements.define(module.default.tagName, module.default);
      }
    });
  }

  // TODO: make a data repository and control cache and more
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

  // Optional hooks definitions
  beforeMount() {
    return;
  }
  mounted() {
    return;
  }
  destroyed() {
    return;
  }

  // Directives
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
  bindShow() {
    const $el = this.querySelector('[bind-show]');
    if (!$el) {
      return;
    }
    $el.style.display = this.props[$el.getAttribute('bind-show')] ? 'initial' : 'none';
  }
  bindContent() {
    const $el = this.querySelector('[bind-content]');
    if (!$el) {
      return;
    }
    // console.log('attribute content', this.tagName, $el);
    // console.log(this.tagName, this[$el.getAttribute('content')]);
    this.render(this[$el.getAttribute('content')], $el);
  }
  bindAttrs() {
    const $el = this.querySelector('[bind-data]');
    if (!$el?.attributes) {
      return;
    }

    const attrs = [];

    for (let i = 0; i < $el.attributes.length; i++) {
      const name = $el.attributes[i].nodeName;
      const val = $el.attributes[i].value;

      if (!name.startsWith('bind') || name === 'bind-data') {
        continue;
      }
      attrs.push( { name, val } );
    }

    attrs.forEach(attr => {
      const val = this.props[attr.val] || '';
      const attrValue = typeof val != 'string' ? JSON.stringify(val) : val;
      console.log(attrValue);
      $el.setAttribute(attr.name.replace('bind-', ''), attrValue);
    });

  }

  // Render only once if data properties are set immediately
  debounceRender(html, el) {
    if (this.debounce) {
      window.cancelAnimationFrame(this.debounce);
    }

    this.debounce = window.requestAnimationFrame(_ => {
      this.render(html, el);
    });
  }

  render(html, el) {

    // set defaults
    const htmlString = html || this.html;
    const container = el || this;
    // innerHTML, TODO: research if is needed
    const frag = document.createRange().createContextualFragment(htmlString);
    container.replaceChildren(frag);

    this.bindAttrs();
    if (!html && !el) {
      // Debug => count number of renderings
      // console.log('renderCount: ', this.tagName, ++this.renderCounter);
      this.bindContent();
    }

  }

}

export default BaseComponent;
