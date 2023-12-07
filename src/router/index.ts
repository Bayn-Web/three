import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";


const basename = (path: string) => path.replace(/^.*[\\\/]/, '').replace(/\.vue$/, '');
const getExamples = async (): Promise<RouteRecordRaw[]> => {
    const files = import.meta.glob('../examples/*.vue');
    const filenames = Object.keys(files).map((key) => {
        console.log(basename(key))
        return {
            name: basename(key),
            path: '/' + basename(key),
            component: () => import(`../examples/${basename(key)}.vue`)
        }
    });
    return filenames;
};


const router = createRouter({
    history: createWebHashHistory(),
    routes: await getExamples()
});

export { router };