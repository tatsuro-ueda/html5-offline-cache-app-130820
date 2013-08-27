
/**
 * Module dependencies.
 */

var express = require('express');
var cacheManifest = require('connect-cache-manifest');

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/index.html', routes.index);
app.get('/users', user.list);

// cache-manifest
app.use(cacheManifest({
  manifestPath: '/application.manifest',
  files: [{
    file: __dirname + '/public/pdf.js/web/viewer.css',
    path: '/pdf.js/web/viewer.css'
  }, {
    file: __dirname + '/public/pdf.js/web/compatibility.js',
    path: '/pdf.js/web/compatibility.js'
  }, {
    file: __dirname + '/public/pdf.js/external/webL10n/l10n.js',
    path: '/pdf.js/external/webL10n/l10n.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/util.js',
    path: '/pdf.js/src/shared/util.js'
  }, {
    file: __dirname + '/public/pdf.js/src/display/canvas.js',
    path: '/pdf.js/src/display/canvas.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/colorspace.js',
    path: '/pdf.js/src/shared/colorspace.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/pattern.js',
    path: '/pdf.js/src/shared/pattern.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/annotation.js',
    path: '/pdf.js/src/shared/annotation.js'
  }, {
    file: __dirname + '/public/pdf.js/src/display/metadata.js',
    path: '/pdf.js/src/display/metadata.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/function.js',
    path: '/pdf.js/src/shared/function.js'
  }, {
    file: __dirname + '/public/pdf.js/src/display/font_loader.js',
    path: '/pdf.js/src/display/font_loader.js'
  }, {
    file: __dirname + '/public/pdf.js/src/display/api.js',
    path: '/pdf.js/src/display/api.js'
  }, {
    file: __dirname + '/public/pdf.js/src/display/font_renderer.js',
    path: '/pdf.js/src/display/font_renderer.js'
  }, {
    file: __dirname + '/public/pdf.js/web/ui_utils.js',
    path: '/pdf.js/web/ui_utils.js'
  }, {
    file: __dirname + '/public/pdf.js/web/download_manager.js',
    path: '/pdf.js/web/download_manager.js'
  }, {
    file: __dirname + '/public/pdf.js/web/text_layer_builder.js',
    path: '/pdf.js/web/text_layer_builder.js'
  }, {
    file: __dirname + '/public/pdf.js/web/pdf_find_bar.js',
    path: '/pdf.js/web/pdf_find_bar.js'
  }, {
    file: __dirname + '/public/pdf.js/web/pdf_find_controller.js',
    path: '/pdf.js/web/pdf_find_controller.js'
  }, {
    file: __dirname + '/public/pdf.js/web/pdf_history.js',
    path: '/pdf.js/web/pdf_history.js'
  }, {
    file: __dirname + '/public/pdf.js/web/debugger.js',
    path: '/pdf.js/web/debugger.js'
  }, {
    file: __dirname + '/public/pdf.js/web/viewer.js',
    path: '/pdf.js/web/viewer.js'
  }, {
    file: __dirname + '/public/pdf.js/web/images/texture.png',
    path: '/pdf.js/web/images/texture.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-viewThumbnail.png',
    path: '/pdf.js/web/images/toolbarButton-viewThumbnail.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-viewOutline.png',
    path: '/pdf.js/web/images/toolbarButton-viewOutline.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-sidebarToggle.png',
    path: '/pdf.js/web/images/toolbarButton-sidebarToggle.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-search.png',
    path: '/pdf.js/web/images/toolbarButton-search.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-pageUp.png',
    path: '/pdf.js/web/images/toolbarButton-pageUp.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-pageDown.png',
    path: '/pdf.js/web/images/toolbarButton-pageDown.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-presentationMode.png',
    path: '/pdf.js/web/images/toolbarButton-presentationMode.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-openFile.png',
    path: '/pdf.js/web/images/toolbarButton-openFile.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-print.png',
    path: '/pdf.js/web/images/toolbarButton-print.png'
  }, {
    file: __dirname + '/public/pdf.js/web/locale/locale.properties',
    path: '/pdf.js/web/locale/locale.properties'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-download.png',
    path: '/pdf.js/web/images/toolbarButton-download.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-bookmark.png',
    path: '/pdf.js/web/images/toolbarButton-bookmark.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-zoomOut.png',
    path: '/pdf.js/web/images/toolbarButton-zoomOut.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-zoomIn.png',
    path: '/pdf.js/web/images/toolbarButton-zoomIn.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/toolbarButton-menuArrows.png',
    path: '/pdf.js/web/images/toolbarButton-menuArrows.png'
  }, {
    file: __dirname + '/public/pdf.js/src/worker_loader.js',
    path: '/pdf.js/src/worker_loader.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/util.js',
    path: '/pdf.js/src/shared/util.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/colorspace.js',
    path: '/pdf.js/src/shared/colorspace.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/pattern.js',
    path: '/pdf.js/src/shared/pattern.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/function.js',
    path: '/pdf.js/src/shared/function.js'
  }, {
    file: __dirname + '/public/pdf.js/src/shared/annotation.js',
    path: '/pdf.js/src/shared/annotation.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/network.js',
    path: '/pdf.js/src/core/network.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/chunked_stream.js',
    path: '/pdf.js/src/core/chunked_stream.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/pdf_manager.js',
    path: '/pdf.js/src/core/pdf_manager.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/core.js',
    path: '/pdf.js/src/core/core.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/obj.js',
    path: '/pdf.js/src/core/obj.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/charsets.js',
    path: '/pdf.js/src/core/charsets.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/cidmaps.js',
    path: '/pdf.js/src/core/cidmaps.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/crypto.js',
    path: '/pdf.js/src/core/crypto.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/evaluator.js',
    path: '/pdf.js/src/core/evaluator.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/fonts.js',
    path: '/pdf.js/src/core/fonts.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/glyphlist.js',
    path: '/pdf.js/src/core/glyphlist.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/image.js',
    path: '/pdf.js/src/core/image.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/metrics.js',
    path: '/pdf.js/src/core/metrics.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/parser.js',
    path: '/pdf.js/src/core/parser.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/stream.js',
    path: '/pdf.js/src/core/stream.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/worker.js',
    path: '/pdf.js/src/core/worker.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/jpx.js',
    path: '/pdf.js/src/core/jpx.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/jbig2.js',
    path: '/pdf.js/src/core/jbig2.js'
  }, {
    file: __dirname + '/public/pdf.js/src/core/bidi.js',
    path: '/pdf.js/src/core/bidi.js'
  }, {
    file: __dirname + '/public/pdf.js/external/jpgjs/jpg.js',
    path: '/pdf.js/external/jpgjs/jpg.js'
  }, {
    file: __dirname + '/public/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    path: '/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  }, {
    file: __dirname + '/public/pdf.js/web/images/shadow.png',
    path: '/pdf.js/web/images/shadow.png'
  }, {
    file: __dirname + '/public/pdf.js/web/images/loading-icon.gif',
    path: '/pdf.js/web/images/loading-icon.gif'
  }
  // , {
  //   dir: __dirname + '/public',
  //   prefix: '/'
  // }
  ],
  networks: ['*'],
  fallbacks: []
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
