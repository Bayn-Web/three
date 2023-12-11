let filenames: any[] = [];
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
})()

export { filenames };