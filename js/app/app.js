/**
 * Created by sajit on 12/11/14.
 */
var app = angular.module('myApp', []);


app.controller('MainCtrl', ['$scope','$q','$http','$window', function($scope,$q,$http,$window) {
    console.log('Init MainCtrl ::');
    $scope.fileReader = fileReader($q);
    $scope.failedUrls = [];
    $scope.totalUrlsCount = 0;


    $scope.getFile = function () {
        console.log('In get file of MainCtrl');
        $scope.fileReader.readAsText($scope.file, $scope)
            .then(function(result) {
                //console.log('Got File Content..');
               try{
                   $scope.data = JSON.parse(result);
                   $scope.fileLoadComplete = true;
               }catch(e){
                   alert('Bad Json.');
               };
               if($scope.data){
                   if($scope.data.whitelist){
                       $scope.handleWhitelist($scope.data.whitelist);
                   }
                   if($scope.data.browserMatrix){
                       $scope.browserDetection(($scope.data.browserMatrix));
                   }
                   if($scope.data.screenResolution){
                       $scope.screenResolution($scope.data.screenResolution);
                   }
               }
            });
    };

    $scope.handleWhitelist = function(whitelist){
      $scope.totalUrlsCount = whitelist.length;
      angular.forEach(whitelist,function(url){
        $http.get(url).success(function(){

        }).error(function(data,status,headers,config){
            //console.log(data,status,headers,config);
            if(status == 0){
                $scope.failedUrls.push(url);
            }

        });
      });
    };

    $scope.browserDetection = function(browserMatrix){
        var ua = detect.parse($window.navigator.userAgent);
        $scope.ua = {
            os : ua.os.name,browser : ua.browser.name
        };
        angular.forEach(browserMatrix,function(elem){

            if(elem.os.name === ua.os.family){
                $scope.supportedOs = true;
                if(elem.os.version){
                    $scope.supportedOs = (elem.os.version <= ua.os.major);
                }

            }
            if(ua.browser.family === elem.browser.name && elem.browser.version <= ua.browser.major){
                $scope.supportedBrowser = true;
            }
        });
    };

    $scope.screenResolution = function(screenResolution){
        $scope.height = $window.screen.height;
        $scope.width = $window.screen.width;
        $scope.validResolution = $scope.height >= screenResolution.height && $scope.width >= screenResolution.width;
    };




}]);

app.directive("ngFileSelect",function() {
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                $scope.file = (e.srcElement || e.target).files[0];
                $scope.getFile();
            });
        }
    };
});

var fileReader = function ($q) {

    var onLoad = function(reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };

    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };

    var onProgress = function(reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress",
                {
                    total: event.total,
                    loaded: event.loaded
                });
        };
    };

    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };

    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    };
    var _readAsText = function(file,scope){
      var deferred = $q.defer();
      var reader = getReader(deferred,scope);
      reader.readAsText(file);
      scope.$digest();
      return deferred.promise;
    };

    return {
        readAsDataUrl: readAsDataURL,
        readAsText : _readAsText
    };
};
