'use strict';

function modelTransformer($model) {
   
 	var transformObject = function(jsonResult, constructor) {
        var model = new constructor();
        $model.extend(model, jsonResult);
        // console.log("transformation", model, jsonResult);
        if(typeof model.onLoad === 'function'){
            model.onLoad();
        }
        return model;
    };
 
    var transformResult = function(jsonResult, constructor) {
        if (angular.isArray(jsonResult)) {
            var models = [];
            angular.forEach(jsonResult, function(object) {
                models.push(transformObject(object, constructor));
            });
            return models;
        } else {
            return transformObject(jsonResult, constructor);
        }
    };
 
 	var self = {};
 	self.transform = transformResult;

    return self;

}
modelTransformer.$inject = ['$model'];
angular.module('SchoolMan').service('modelTransformer', modelTransformer);