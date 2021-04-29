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
  }

  loadComponents() {
    if (!this.components) {
      return;
    }
    this.components.forEach(this.importElement);
  }

  static get observedAttributes() {
    return this.properties || [];
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
    // console.log(name, oldValue, newValue);
    if (oldValue !== newValue && oldValue !== null) {
      this.render();
    }
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

  render(html, el) {
    const htmlString = html || this.html;
    const container = el || this;
    const frag = document.createRange().createContextualFragment(htmlString);
    container.replaceChildren(frag);
  }

}

export default BaseComponent;
