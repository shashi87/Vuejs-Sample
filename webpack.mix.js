let mix = require('laravel-mix');
let tailwindcss = require('laravel-mix-tailwind');
let exec = require('child_process').exec;
let path = require('path');

mix.sass('resources/sass/app.scss', 'public/css')
    .sass('resources/sass/checkout.scss', 'public/css')
    .js('resources/js/app.js', 'public/js')
    .js('resources/js/checkout.js', 'public/js')
    .copy('node_modules/sweetalert/dist/sweetalert.min.js', 'public/js/sweetalert.min.js')
    .sourceMaps()
    .webpackConfig({
        resolve: {
            modules: [path.resolve(__dirname, 'vendor/laravel/spark-aurelius/resources/assets/js'), 'node_modules'],
            alias: {
                styles: path.resolve(__dirname, 'resources/sass'),
                '@': path.resolve(__dirname, 'resources/js'),
                '~': path.resolve(__dirname, 'node_modules'),
            },
        },
    })
    .tailwind();

if (mix.inProduction()) {
    mix.version();
}
