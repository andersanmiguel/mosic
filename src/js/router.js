let routes = [

  {
    name: 'not-found',
    path: '',
    regex: false,
    template: () => {
      return `<not-found></not-found>`;
    }
  },

  {
    name: 'index',
    path: '/',
    regex: /^\/$/,
    template: _ => {
      return `<album-list></album-list>`;
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
    regex: /^\/album\/(.*)$/,
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
    const route = this.routes.find(route => {
      if (!route.regex) {
        return false;
      }
      return route.regex.test(path);
    });

    if (!route) {
      console.error('Route not found:', path);
      return this.routes.find(item => item.name === 'not-found');
    }

    const vars = Array.from(path.matchAll(new RegExp(route.regex, 'g')))[0];

    this.route = { ...route, vars };

    return this;
  }

  getTemplate() {
    if (!this.route.path) {
      return this.route.template();
    }
    const vars = Array.from(this.route.path.matchAll(new RegExp(this.route.regex, 'g')))[0];
    const result = {};
    vars.forEach((val, i) => {
      if (val.indexOf(':') === 0) {
        result[val.slice(1)] = this.route.vars[i];
      }
    });
    return this.route.template(result);
  }

}

const router = new Router(routes);


class MosicRouter extends HTMLElement {
  
  constructor() {
    super();
    this.setBindings();
  }

  goTo(target, replace) {
    if (!target) {
      return;
    }

    const route = router.on(target);
    if (replace) {
      history.replaceState({}, route.name, target);
    } else {
      history.pushState({}, route.name, target);
    }
    this.innerHTML = router.getTemplate();
  }

  setBindings() {

    document.addEventListener('click', e => {
      if ('mosicLink' in e.target.dataset === false) {
        return;
      }
      e.preventDefault();
      const target = e.target.dataset.target;

      this.goTo(target);
    });

    window.addEventListener('popstate', e => {
      e.preventDefault();
      this.goTo(window.location.pathname, true);
    });

    this.goTo(window.location.pathname);

  }

}

export default MosicRouter;


