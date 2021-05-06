import BaseComponent from '/js/base-component.js';
class TestTest extends BaseComponent {

  static tagName = 'test-test';

  mounted() {
    this.props._count = 0;
    setInterval(_ => {
      this.props._count++;
    }, 1000);
  }

  get html() {
    return `
      <h2>Color Counter</h2>
      <p class="counter" bind-content content="count"></p>
    `;
  }
  
  get count() {
    return `<span style="background: hsl(${this.props._count * 21}, 80%, 50%); width: 20px; height: 20px; display: block;"></span>`;
  }
  

}

export default TestTest;
