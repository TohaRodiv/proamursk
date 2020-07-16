const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    colors = require('colors'),

    // Development plugins
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    fileinclude = require('gulp-file-include'),
    emailbuilder = require('gulp-email-builder'),


    // Production plugins
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    gzip = require('gulp-gzip'),
    babel = require('gulp-babel'),


    // NPM paths
    jquery = 'node_modules/jquery/dist/jquery.min.js',
    jqueryMaskPlugin = 'node_modules/jquery-mask-plugin/dist/jquery.mask.js',
    slickCarousel = 'node_modules/slick-carousel/slick/slick.min.js',
    IntersectionObserver = 'node_modules/intersection-observer/intersection-observer.js',

    // JS paths
    srcJS = [
        IntersectionObserver,
        jquery,
        jqueryMaskPlugin,
        slickCarousel,
        'src/js/**/*.js',
    ],


    // settings plumber
    settingsPlumber = {
        errorHandler: function(error) {
            console.log('\n\tError'.red+' in plugin `'+error.plugin+'`\n\t'+error.message+' details: '+error);
            this.emit('end');
        },
    },


    // email builder configuration
    emailbuilderConfig = {
        emailTest: {
            to: ['vvidyaeva@gmail.com', 'valyavidyaeva@mail.ru','valyavidyaeva@yandex.ru', 'jes.hab.magik@gmail.com',],
            from: 'no-reply@perfectura.ru',
            subject: 'Алтан Шина Test Email',
            nodemailer: {
                transporter: {
                    host: "smtp.yandex.ru",
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'no-reply@perfectura.ru',
                        pass: 'Bq1ty3h7',
                    },
                },
                defaults: {},
            },
        },
    };


// ---------------------
//   DEVELOPMENT TASKS
// ---------------------

const dev = gulp.parallel(devSass, devJS, devImages, devLocalImages, devFonts, devHtml, devShortStaticStyles, frontendShortHtml);


function watch() {
    gulp.watch(['src/sass/**/*.sass',], devSass);
    gulp.watch(['src/sass/_short-styles/*.sass',], devShortStaticStyles);
    gulp.watch(['src/js/**/*.js',], devJS);
    gulp.watch(['src/images/**/*.*',], gulp.parallel(devImages, devLocalImages));
    gulp.watch(['src/fonts/**/*.*',], devFonts);
    gulp.watch(['src/html/**/*.html',], devHtml);
    gulp.watch(['src/html/404.html', 'src/html/500.html',], gulp.parallel(frontendShortHtml));
}


function devSass() {
    return gulp.src('src/sass/main.sass')
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min', }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/css/'))
        .pipe(gulp.dest('./../static/site/css/'));
}


function devJS() {
    return gulp.src(srcJS)
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env',],
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('static/js/'))
        .pipe(gulp.dest('./../static/site/js/'))
        .pipe(rename({ suffix: '.min' , }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/js/'))
        .pipe(gulp.dest('./../static/site/js/'));
}


function devLocalImages() {
    return gulp.src('src/images/local/**/**/*.*')
        .pipe(plumber(settingsPlumber))
        .pipe(gulp.dest('static/images/local/'));
}

function devImages() {
    return gulp.src(['src/images/**/**/*.*', '!src/images/local/**/*.*',])
        .pipe(plumber(settingsPlumber))
        .pipe(gulp.dest('static/images/'))
        .pipe(gulp.dest('./../static/site/images/'));
}


function devFonts() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(plumber(settingsPlumber))
        .pipe(gulp.dest('static/fonts/'))
        .pipe(gulp.dest('./../static/site/fonts/'));
}


function devHtml() {
    return gulp.src('src/html/*.html')
        .pipe(plumber(settingsPlumber))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/html/',
        }))
        .pipe(gulp.dest('static/'));
}


exports.dev = dev;
exports.watch = watch;
exports.devSass = devSass;
exports.devJS = devJS;
exports.devLocalImages = devLocalImages;
exports.devImages = devImages;
exports.devFonts = devFonts;
exports.devHtml = devHtml;


// --------------------
//   PRODUCTION TASKS
// --------------------

const prod = gulp.parallel(prodSass, prodJS, prodImages, prodImagesSVG, prodFonts, prodShortStaticStyles);


function prodSass() {
    return gulp.src('src/sass/main.sass')
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(concat('main.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./../static/site/css/'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min', }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./../static/site/css/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/css/'));
}


function prodJS() {
    return gulp.src(srcJS)
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env',],
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./../static/site/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min', }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./../static/site/js/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/js/'));
}


function prodImages() {
    return gulp.src(['src/images/**/*.*', '!src/images/local/**/*.*', '!src/images/email/local/**/*.*',])
        .pipe(plumber(settingsPlumber))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false, },],
            use: [pngquant(),],
            interlaced: true,
        }))
        .pipe(gulp.dest('./../static/site/images/'));
}


function prodImagesSVG() {
    return gulp.src('src/images/**/*.svg')
        .pipe(plumber(settingsPlumber))
        .pipe(gulp.dest('./../static/site/images/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/images/'));
}


function prodFonts() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(plumber(settingsPlumber))
        .pipe(gulp.dest('./../static/site/fonts/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/fonts/'));
}

exports.prod = prod;
exports.prodSass = prodSass;
exports.prodJS = prodJS;
exports.prodImages = prodImages;
exports.prodImagesSVG = prodImagesSVG;
exports.prodFonts = prodFonts;


// ---------------
//   EMAIL TASKS
// ---------------

const email = gulp.series(emailStyles, emailHtml);
const emailTest = gulp.series(emailStyles, emailHtml, emailTestSend);

function emailWatch() {
    gulp.watch(['src/sass/email/email.sass', 'src/html/email/email.html',], gulp.series(emailStyles, emailHtml));
}


function emailStyles() {
    return gulp.src(['src/sass/email/email.sass',])
        .pipe(plumber(settingsPlumber))
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(autoprefixer({
            browsers: ['last 4 versions',],
            grid: 'autoplace',
            flexbox: true,
        }))
        .pipe(concat('email.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('static/css/email/'));
}


function emailHtml() {
    return gulp.src(['src/html/email/email.html',])
        .pipe(plumber(settingsPlumber))
        .pipe(emailbuilder({}).build())
        .pipe(gulp.dest('static/email/'));
}


function emailTestSend() {
    return gulp.src(['static/email/email.html',])
        .pipe(plumber(settingsPlumber))
        .pipe(emailbuilder(emailbuilderConfig).sendEmailTest());
}

exports.email = email;
exports.emailTest = emailTest;
exports.emailWatch = emailWatch;
exports.emailStyles = emailStyles;
exports.emailHtml = emailHtml;
exports.emailTestSend = emailTestSend;


// ----------------------
//   SHORT STATIC TASKS
// ----------------------

function devShortStaticStyles() {
    return gulp.src(['src/sass/short-styles.sass',])
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(concat('short-styles.css'))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' , }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/css/'))
        .pipe(gulp.dest('./../static/site/css/'));
}


function prodShortStaticStyles() {
    return gulp.src(['src/sass/short-styles.sass',])
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(concat('short-styles.css'))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./../static/site/css/'))
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min', }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./../static/site/css/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/css/'));
}


function frontendShortHtml() {
    return gulp.src(['src/html/404.html', 'src/html/500.html',])

        .pipe(plumber(settingsPlumber))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/html/',
        }))
        .pipe(gulp.dest('static/'));
}


function templatesShortHtml() {
    return gulp.src(['src/html/404.html', 'src/html/500.html',])

        .pipe(plumber(settingsPlumber))
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'src/html/',
        }))
        .pipe(gulp.dest('./../templates/'));
}

exports.devShortStaticStyles = devShortStaticStyles;
exports.prodShortStaticStyles = prodShortStaticStyles;
exports.frontendShortHtml = frontendShortHtml;
exports.templatesShortHtml = templatesShortHtml;



// ----------------------
//   SPECIAL PROJECTS STATIC TASKS
// ----------------------

const specials = gulp.parallel(spStyles, spJS);


function spStyles() {
    return gulp.src([
        'src/sass/sp-birthday-styles.sass',
        'src/sass/sp-children-styles.sass',
        'src/sass/sp-dance-styles.sass',
        'src/sass/sp-summer-money-styles.sass',
        'src/sass/sp-winter-fun-styles.sass',
    ])
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(sass({
            indentedSyntax: true,
        }))
        .pipe(autoprefixer())
        .pipe(rename({ suffix: '.min' , }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('static/css/special-projects'))
        .pipe(gulp.dest('./../static/site/css'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/css'));
}


const spJSFiles = [
    jquery,
    slickCarousel,
    'src/js/IntersectionObserver.js',
    'src/js/ResizeObserver.js',
    'src/js/special-projects.js',
    'src/js/functions.js',
    'src/js/map.js',
    'src/js/pop-ups.js',
    'src/js/select.js',
    'src/js/fileLoader.js',
    'src/js/sliders.js',
    'src/js/ajax.js',
    'src/js/dropdown-section.js',
];

function spJS() {
    return gulp.src(spJSFiles)
        .pipe(plumber(settingsPlumber))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env',],
        }))
        .pipe(concat('sp-main.js'))
        .pipe(gulp.dest('./../static/site/js/'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min', }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./../static/site/js/'))
        .pipe(gzip())
        .pipe(gulp.dest('./../static/site/js/'));
}

exports.spStyles = spStyles;
exports.spJS = spJS;
exports.specials = specials;
