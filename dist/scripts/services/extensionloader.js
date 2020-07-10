'use strict';

function ExtensionLoader(EXTENSIONS, settings) {
  var self = {};

  self.loadScripts = function(){
    // var activeExtensions = settings.get().extensions;
    // var extensionLoadScripts = [];
    // angular.forEach(EXTENSIONS, function(extension, key){
    //   if(activeExtensions.indexOf(extension.moduleName) > -1){
    //     extensionLoadScripts = extensionLoadScripts.concat(extension.scripts);
    //   }
    // })

    // require(extensionLoadScripts, function(){
    //     console.log("Loaded scripts", extensionLoadScripts);
    // })
    console.log("Did this work?");
  }

  return self;
}
ExtensionLoader.$inject = ['EXTENSIONS', 'settings'];
angular.module('SchoolMan').service('ExtensionLoader', ExtensionLoader);