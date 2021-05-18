class EventBus extends HTMLElement {}
customElements.define('event-bus', EventBus);
const eventBus = document.createElement('event-bus');
document.body.append(eventBus);
import Queue from '/mosic/js/queue.js';
const queue = new Queue;

class BaseComponent extends HTMLElement {

  eventRegistry = {};

  constructor() {
    super();
    this.queue = queue;
    // Render count => debug
    this.renderCounter = 0;

    this.renderStack = [];
    // Event Bus => TODO: refactor, change to pub/sub?
    this.$evt = eventBus;

    this.eventRegistry = {};

    // Data handling, if this.data.something is set, render the component
    // if this.data._something is not needed a full render
    const handlerData = {
      set(obj, prop, value) {

        if (prop.startsWith('_')) {
          if (obj[prop] != value) {
            // console.log(obj._this.eventRegistry);
            // window.requestAnimationFrame(_ => {
            // Promise.resolve().then(_ => {
            window.queueMicrotask(_ => {
              obj._this.emit('prop-changed', { prop: prop.substring(1), val: value });
              obj._this.emit('prop-changed-' + prop.substring(1), { val: value });
            });
            obj[prop] = value;
            obj._this.bindShow(prop);
          }
          return true;
        } else {
          obj[prop] = value;
          obj._this.debounceRender();
          return true;
        }

      },
      get(obj, prop) {
        return obj[prop]; 
      }
    };
    this.data = new Proxy({_this: this}, handlerData);

    // Call beforemount hook
    this.beforeMount();
  }

  // Component is injected to page
  async connectedCallback() {
    this.loadComponents();
    // First render if is not a data driven component
    // Avoid double rendering
    if (!this.queryString) {
      this.render();
    }

    // Call mounted hook
    await this.mounted();
    // Add bindings on next frame, just to be sure that the DOM is loaded
    // as the render is debounced
    window.queueMicrotask(_ => {
      this.addBindings();
    });
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
      this.data[name] = newValue;
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
      const response = await fetch('http://192.168.1.37:5554/graphql', {
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
  async mounted() {
    return;
  }
  addBindings() {
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

    const els = [...this.querySelectorAll('[bind-show]')];
    if (!els.length === 0) {
      return;
    }

    els.forEach(el => {
      el.style.display = this.data[`_${ el.getAttribute('bind-show') }`] ? 'initial' : 'none'; 
    });

  }

  bindContent(container) {

    const els = [...container.querySelectorAll('[bind-content]')];
    if (!els.length === 0) {
      return;
    }

    els.forEach(el => {
        
      for (let i = 0; i < el.attributes.length; i++) {
        if (el.attributes[i].nodeName !== 'bind-content') {
          continue;
        }


        const prop = el.attributes[i].value;
        this.on('prop-changed', { content: prop }, payload => {
          const content = payload.content in this ? this[payload.content] : '';
          if (content) {
            // NOTE: special chars like & => &amp;
            if (content === el.innerHTML) {
              return;
            }

            this.render(content, el);
          }
        });

      }

    });

  }
  
  bindAttrs(container) {
    // If has been a partial render, only check the that parts attrs
    const els = [...container.querySelectorAll('[bind-attr]')];
    if (!els.length === 0) {
      return;
    }

    els.forEach(el => {

      Array.from(el.attributes)
        .filter(attr => attr.nodeName === 'bind-attr')
        .map(attr => attr.value.split(','))
        .flat()
        .map(pair => pair.split(':'))
        .forEach(arr => {
          let [ attr, prop ] = arr;
          prop = prop ? prop.trim() : attr.trim();
          this.on('prop-changed-' + prop, { attr: attr.trim() }, payload => {
            // console.log(el, payload);
            const attrValue = typeof payload.val != 'string' ? JSON.stringify(payload.val) : payload.val;
            el.setAttribute(payload.attr, attrValue);
          });
        });

    });
  }

  // Render only once if data properties are set immediately
  debounceRender(html, el) {

    // if (this.debounce) {
    //   window.cancelAnimationFrame(this.debounce);
    // }

    // this.debounce = window.requestAnimationFrame(_ => {
    //   this.render(html, el);
    // });

    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide
    this.renderStack.push([ html, el ]);

    if (this.renderStack.length === 1) {
      queueMicrotask(() => {
        // const json = JSON.stringify(messageQueue);
        // messageQueue.length = 0;
        const [html, el] = this.renderStack.pop();
        this.renderStack.length = 0;
        this.render(html, el);
      });
    }

  }

  render(html, el) {

    // set defaults
    const htmlString = html || this.html;
    const container = el || this;


    // if (container.innerHTML === htmlString) {
    //   return;
    // }

    // innerHTML, TODO: research if is needed
    const frag = document.createRange().createContextualFragment(htmlString);
    container.replaceChildren(frag);

    this.bindAttrs(container);

    // I know that is a complete render (not partial) if there is not
    // html an not el
    if (!html && !el) {
      // Debug => count number of renderings
      console.log('renderCount: ', this.tagName, ++this.renderCounter);
      this.bindContent(container);
    }
    this.bindContent(container);

  }

  on(event, data, callback) {
    // this.on('prop-changed-' + `_${ val }`, { attrName: name.replace('bind-', '') }, (args) => {

    // console.log(this, event, data, callback);
    if (!this.eventRegistry[event]) {
      this.eventRegistry[event] = [];
    }

    this.eventRegistry[event].push({
      data: data,
      cb: callback
    });
  }

  emit(event, payload) {
    // console.log(this, event, payload);
    if (this.eventRegistry[event]) {
      this.eventRegistry[event].forEach(entry => {
        const { data, cb } = entry;
        cb({...data, ...payload});
      });
    }
  }

}

export default BaseComponent;
