import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

let filenames:any[] = [];
const basename = (path: string) => path.replace(/^.*[\\\/]/, '').replace(/\.vue$/, '');
const getExamples = (): RouteRecordRaw[] => {
    const files = import.meta.glob('../examples/*.vue');
    filenames = Object.keys(files).map((key) => {
        return {
            name: basename(key),
            path: '/' + basename(key),
            component: () => import(`../examples/${basename(key)}.vue`)
        }
    });
    return [{
        path: '/',
        component: () => import('../App.vue'),
        children: filenames
    }];
};
console.log(getExamples());

const router = createRouter({
    history: createWebHashHistory(),
    routes: getExamples()
});

export { router, filenames };