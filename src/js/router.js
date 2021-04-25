let routes = [

  {
    name: 'index',
    path: '/',
    regex: /^\/$/,
    template: (args) => {
      return `<album-full id="${args.id}"></album-full>`;
    }
  },
  {
    name: 'song',
    path: '/song/:id/artist/:artistId',
    regex: /^\/song\/(.*)\/artist\/(.*)$/,
    template: (args) => {
      return `<album-full id="${args.id}"></album-full>`;
    }
  },
  {
    name: 'album',
    path: '/album/:id',
    regex: /^\/album\/(.*)\/?$/,
    template: (args) => {
      return `<album-full id="${args.id}"></album-full>`;
    }
  },

];

class Router {

  constructor(routes) {
    this.routes = routes;
  }

  on(path) {
    const route = routes.find(route => {
      return route.regex.test(path);
    });

    if (!route) {
      return 404;
    }

    const vars = path.matchAll(new RegExp(route.regex, 'g'));
    console.log(...vars);

    return { ...route, vars };

  }

}

const router = new Router(routes);


class MosicRouter extends HTMLElement {
  
  constructor() {
    super();
    this.setBindings();
  }

  setBindings() {
    this.addEventListener('click', e => {
      if ('mosic-link' in e.currentTarget.dataset === false) {
        return;
      }
      const target = e.currentTarget.dataset.target;
      if (!target) {
        return;
      }

                  
    });
  }

}

customElements.define('mosic-router', MosicRouter);
