import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

let filenames: any[] = [];
let routes: any[] = [];
(() => {
    const basename = (path: string) => path.replace(/^.*[\\\/]/, '').replace(/\.vue$/, '');
    const files = import.meta.glob('../examples/*.vue');
    filenames = Object.keys(files).map((key) => {
        return {
            name: basename(key),
            path: basename(key),
            component: () => import(`../examples/${basename(key)}.vue`)
        }
    });
    routes = [{
        path: '/',
        component: () => import('../layout/index.vue'),
        children: filenames
    }]
})()

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export { router, filenames };