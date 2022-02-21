// 1. Define route components.
const Home = { template: "<div>Home 123</div>" };
const About = { template: "<div>About me{{$route.params.id}}</div>" };

const back = { template: "<div> backend</div>"}

const routes = [
  { path: "/home", component: Home },
  { path: "/about", component: About },
  { path: "/back", component: back },

];
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});

// 5. Create and mount the root instance.
const app = Vue.createApp({
  data() {
    return {
      message: "Hello Vue!",
    };
  },
});
// Make sure to _use_ the router instance to make the
// whole app router-aware.
app.use(router);

app.mount("#app");

// Now the app has started!
