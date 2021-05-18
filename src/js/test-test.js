class TestTest extends BaseComponent {

  static tagName = 'test-test';

  async mounted() {
    this.data._count = 0;
    setInterval(_ => {
      this.data._count++;
    }, 1000);
  }

  get html() {
    return `
      <div style="max-width: 600px; margin: auto">
        <h2>Color Counter</h2>
        <p class="counter" bind-content="count"></p>
      </div>
    `;
  }
  
  get count() {
    return `<p style="background: hsl(${this.data._count * 8}, 80%, 50%); width: 200px; height: 200px;"></p>`;
  }
  

}

export default TestTest;
