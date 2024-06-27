let preprocessor = 'sass';
const { src, dest, parallel, series, watch } = require('gulp');
 
// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем модули gulp-sass и gulp-less
const sass = require('gulp-sass')(require('sass'));
const less = require('gulp-less');
 
function browsersync() {
    browserSync.init({ 
        server: { baseDir: 'source' },
        notify: false,
        online: true 
    })
}

function scripts() {
    return src(['source/script/javascript.js'])
    .pipe(browserSync.stream())
}

function styles() {
    return src('source/' + preprocessor + '/*.' + preprocessor + '')
    .pipe(eval(preprocessor)())
    .pipe(dest('source/css/'))
    .pipe(browserSync.stream())
}

function startwatch() {
    // Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
    watch(['source/**/*.js', '!source/**/*.min.js'], scripts);

    // Мониторим файлы препроцессора на изменения
    watch('source/**/' + preprocessor + '/**/*', styles);

    // Мониторим файлы HTML на изменения
    watch('source/**/*.html').on('change', browserSync.reload);
}


// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
exports.browsersync = browsersync;

// Экспортируем функцию scripts() в таск scripts
exports.scripts = scripts;

// Экспортируем функцию styles() в таск styles
exports.styles = styles;

// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(styles, scripts, browsersync, startwatch);

