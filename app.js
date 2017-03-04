'use strict'

var colombo360 = angular.module('colombo360', [ 'ngRoute','ngResource','ui.bootstrap','angularModalService','ui.router','ngFileUpload','ngMap','ngAutocomplete']);

colombo360.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/',{
            templateUrl:'login.html',
        })
        .when('/profile',{
            templateUrl:'author-login.html'
        })
        .when('/map',{
            templateUrl:'map.html'
        })
        .when('/feed',{
            templateUrl:'feed.html',
            reloadOnSearch:true
        })
        .when('/viewPhotosphere', {
            templateUrl:'viewPhotosphere.html'
        })
        .when('/upload', {
            templateUrl:'upload.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

colombo360.controller('AppController', ['$scope','$window','$http','ModalService','$rootScope','NgMap','$compile',function($scope,$window,$http,ModalService,$rootScope,NgMap,$compile) {
    $scope.$on('$viewContentLoaded', function () {
        $window.scrollTo(0, 0);
    });
    //Initialization of variables
    var popUpWindow; //this is the window used for pop-ups
    //Get information when registering a user
    $scope.registrationDetails = {
        firstName:'',
        lastName:'',
        country:'',
        email:'',
        password:'',
        repeatPassword:'',
        year:'',
        month:'',
        date:'',
        checkbox:false,
        checkbox2:false
    }

    //To store the items in the news feed
    $scope.newsfeedItems = {};
    $scope.username = '';
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.profilepicture = '';
    $scope.loginButtonText = "Log in";
    $scope.newsFeedLoaded = false;
    $scope.photosphereClicked = false;
    $scope.currentPhotosphere = "./img/photosphere/1485622115.jpg";
    $scope.shouldReload = false;

    $scope.visibility = {
        mainContent : true,
        profile : false,
        map : false,
        upload: false,
        viewPhotosphere: false
    }

    $scope.showMainContent = function() {
        location.href = "/Colombo_360/Colombo360/index.html#/feed";
    }

    $scope.showProfile = function(){
        location.href = "/Colombo_360/Colombo360/index.html#/profile";
    }

    $scope.showMap = function(){
        location.href = "/Colombo_360/Colombo360/index.html#/map";
    }

    $scope.showUploadPage = function(){
        location.href = "/Colombo_360/Colombo360/index.html#/upload";
    }

    $scope.openPhotosphere = function(item){
        $scope.photosphereClicked = true;
        $scope.currentPhotosphere = "./img/photosphere/"+item.photo_id;
        console.log("Current photosphere", $scope.currentPhotosphere);
        location.href = "/Colombo_360/Colombo360/index.html#/viewPhotosphere";
    }
    //To get the items in the news feed
    $scope.getNewsfeedItems = function(){
        $http.post("backend/api.php", {query:"getNewsfeedItems"}).then(function(response){
            $scope.newsfeedItems = response.data;
            $scope.newsFeedLoaded = true;
        })
    }

    //Autoloading functions
    $scope.getNewsfeedItems();

    //For registering new users
    $scope.registerUser = function(registrationDetails){
        console.log('Registration details sent', registrationDetails);
        $http.post("backend/api.php", {query: "checkUserExist", data: registrationDetails}).then(function (response){
            console.log('Count of users', response.data);
        })
    }

    //To open window to upload new photospheres
    $scope.openPhotosphereUploadPage = function(){
        popUpWindow = $window.open('upload-photosphere.php', 'Upload Photosphere' + new Date().getTime(), 'maximize scrollbars=yes, resizable=yes, width= 1368, height=700, left=0, top=0');
    }

    //this function is to login a user to the system
    $scope.loginUser = function (loginDetails) {
        if(!$scope.username){
            $scope.check = "";
            $http.post("backend/api.php", {query: "checklogin", data: loginDetails}).then(function (response) {
                $scope.check = response.data[0];
                if ($scope.check != undefined)
                {
                    $scope.username = $scope.check['email'];
                    $scope.firstname = $scope.check['firstname'];
                    $scope.lastname = $scope.check['lastname'];
                    $scope.profilepicture = $scope.check['profilepicture'];
                    $scope.wrongPassword = false;
                    $scope.loginButtonText = "Logout"
                }
                else
                {
                    $scope.wrongPassword = true;
                }
            })
        }
        else{
            $scope.username = '';
            $scope.firstname = '';
            $scope.lastname = '';
            $scope.profilepicture = '';
            $scope.wrongPassword = false;
            $scope.loginButtonText = "Logout"
        }
    }

    $scope.goToItenary = function() {
        window.location.href = "./itenary.html"
    }

    $scope.reloadThePage = function(){
        if($scope.shouldReload == true){
            $window.location.reload();
            $scope.shouldReload = false;
        }
    }

    $scope.changeOnReloadStatus = function(){
        $scope.shouldReload = true;
    }

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDV-I9H_bH1gTCnM9eENGPoa9FINciThF4";
    $scope.map_controller = this;
    $scope.onViewPhotoSphere = function () {
        console.log(this);
    };
    NgMap.getMap().then(function(map) {
        $scope.map_controller.map = map;
        $scope.map_controller.markers = [];
        $http.post("backend/api.php", {query: "getMapPoints"}).then(function (response) {
            for(var i = 0; i < response.data.length; i++){
                var item = response.data[i];

                var marker_item = {};
                var coordinate = new google.maps.LatLng(item["photo_lat"],item["photo_lng"]);


                marker_item["marker"] = new google.maps.Marker({position: coordinate, map: $scope.map_controller.map});
                marker_item["item"] = item;
                marker_item["marker"].item = item;

                marker_item["marker"].addListener("click",function(){
                    var marker = this;
                    $scope.map_controller.map.setCenter(marker.getPosition());
                    $http.post("backend/api.php", {query: "getPhotosphereDetails", data:{id:marker.item.id}}).then(function (response) {
                        var item = response["data"][0];
                        $scope.clicked_photosphere = item;
                        var contentString = '<form id="map-form">'
                            +'<div id="content">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<h3>'+item["name"]+'</h3>'+
                            '<div id="bodyContent">'+
                            '<img width="150" src="img/display_img/' + item["photo_id"] + '"/> <br>'+
                            '<p>'+item["description"]+'</p>'+"<br>"+
                            '<button type="submit" id="submit_button" ng-click="openPhotosphere(clicked_photosphere);">View Photosphere</button>'+
                            '</div>'+
                            '</div>'+
                            '</form>';
                        var compiled = $compile(contentString)($scope);
                        var infowindow = new google.maps.InfoWindow({
                            content: compiled[0]
                        });

                        google.maps.event.addListener(infowindow, 'domready', function() {
                            document.id("map-form").addEvent("submit", function(e) {
                                openPhotosphere(clicked_photosphere);
                            });
                        });

                        infowindow.open($scope.map_controller.map, marker);
                    });

                    $scope.$apply();
                });
                $scope.map_controller.markers.push(marker_item);

            }
        });
    });

}]);

colombo360.controller('LoginController', ['$scope','$window','$http','ModalService','$rootScope','$location',function($scope,$window,$http,ModalService,$rootScope, $location) {
    //To store the login information from the form
    $scope.loginInfo = {
        username:'',
        password:''
    }

    $rootScope.username = '';
    $rootScope.firstName = '';
    $rootScope.lastName = '';
    $rootScope.profilepicture = '';

    //this function is to login a user to the system
    $scope.loginUser = function (loginDetails) {
        $scope.check = "";
        $http.post("backend/api.php", {query: "checklogin", data: loginDetails}).then(function (response) {
            $scope.check = response.data[0];

            if ($scope.check != undefined)
            {
                $rootScope.username = $scope.check['email'];
                $rootScope.firstname = $scope.check['firstname'];
                $rootScope.lastname = $scope.check['lastname'];
                $rootScope.profilepicture = $scope.check['profilepicture'];
            }
            else
            {
                alert("Wrong Login/Password");
                $scope.check = "wrong login/password";
            }

        })
    }

    $scope.Enter = function(){
        setTimeout(function(){
            location.href = "/Colombo_360/Colombo360/index.html#/feed";
        },500);
    }

    $scope.RegisterModelOpen =  function(){
        ModalService.showModal({
            templateUrl: 'RegisterModel',
            controller: "LoginController"
        }).then(function (modal) {
            modal.element.modal();
        });
    }

    $scope.registerNewUser = function(name,username,password,confirmPassword){

    }
}]);

colombo360.controller("MapController",["$scope","NgMap",'$http',function ($scope,NgMap, $http) {
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDV-I9H_bH1gTCnM9eENGPoa9FINciThF4";
    $scope.map_controller = this;
    $scope.onViewPhotoSphere = function () {
        console.log(this);
    };
    NgMap.getMap().then(function(map) {
        $scope.map_controller.map = map;
        $scope.map_controller.markers = [];
        $http.post("backend/api.php", {query: "getMapPoints"}).then(function (response) {
            for(var i = 0; i < response.data.length; i++){
                var item = response.data[i];

                var marker_item = {};
                var coordinate = new google.maps.LatLng(item["photo_lat"],item["photo_lng"]);
                marker_item["marker"] = new google.maps.Marker({position: coordinate, map: $scope.map_controller.map});
                marker_item["item"] = item;
                marker_item["marker"].item = item;
                marker_item["marker"].addListener("click",function(){
                    var marker = this;
                    $scope.map_controller.map.setCenter(marker.getPosition());
                    $http.post("backend/api.php", {query: "getPhotosphereDetails", data:{id:marker.item.id}}).then(function (response) {
                        var item = response["data"][0];
                        $scope.clicked_photosphere = item;
                        var contentString = '<div id="content" ng-controller="AppController">'+
                            '<div id="siteNotice">'+
                            '</div>'+
                            '<h3>'+item["name"]+'</h3>'+
                            '<div id="bodyContent">'+
                            '<img width="150" src="img/display_img/' + item["photo_id"] + '"/> <br>'+
                            '<p>'+item["description"]+'</p>'+"<br>"+
                            '<button ng-click="openPhotosphere(clicked_photosphere);">View Photosphere</button>'+

                            '</div>'+
                            '</div>';
                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });
                        infowindow.open($scope.map_controller.map, marker);
                    });
                });
                $scope.map_controller.markers.push(marker_item);
            }
        });
    });
}]);


colombo360.controller('UploadController', ['$scope', 'Upload', '$timeout','NgMap',  function ($scope, Upload, $timeout,NgMap) {

    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDV-I9H_bH1gTCnM9eENGPoa9FINciThF4";

    $scope.vm = this;

    $scope.marker = null;

    NgMap.getMap().then(function(map) {
        $scope.vm.map = map;
        console.log(map.getCenter());
        console.log('markers', map.markers);
        console.log('shapes', map.shapes);
    });


    $scope.avoid_feedback = false;

    $scope.place_result = '';
    $scope.options = {
        types: '(cities)'
    };
    $scope.details = '';

    $scope.$watch('details', function(newVal, oldVal){

        if($scope.avoid_feedback == true)
        {
            console.log("Feedback avoided");
        }
        else{
            console.log("Normal Procedure");
            if($scope.marker != null)
            {
                $scope.marker.setMap(null);
                $scope.marker = null;
            }
            if(newVal.geometry == undefined)
            {
                //No Selection
            }
            else
            {
                var loc = new google.maps.LatLng(newVal.geometry.location.lat(),newVal.geometry.location.lng());
                $scope.marker = new google.maps.Marker({position: loc, map: $scope.vm.map});
                $scope.vm.map.panTo(loc);


            }

        }

        console.log("Search was changed to:"+newVal.geometry);

    });

    $scope.vm.placeMarker = function(e) {
        if($scope.marker != null)
        {
            $scope.marker.setMap(null);
            $scope.marker = null;
        }

        $scope.marker = new google.maps.Marker({position: e.latLng, map: $scope.vm.map});
        $scope.vm.map.panTo(e.latLng);

        $scope.avoid_feedback = true;
        console.log("avoid_feedback set");

        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({'location': e.latLng}, function(results, status) {
            if (status === 'OK') {
                if(results.length > 0)
                {
                    $scope.details = results[0];
                    $scope.place_result = results[0].formatted_address;
                    setTimeout(function () {
                        console.log("details changed");
                        $scope.place_result = results[0].formatted_address;
                        document.getElementById("location_address").value = results[0].formatted_address;


                    },100);

                }

            }
        });
        setTimeout(function () {
            $scope.avoid_feedback = false;
            console.log("Avoid feedback released");
        },500);

    };


    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url: 'backend/upload.php',
            data: {lat:$scope.marker.getPosition().lat(),lng:$scope.marker.getPosition().lng(), location:$scope.place_result, username: $scope.username,title:$scope.photo_title, description:$scope.photo_description, fileToUpload: file, submit:true}
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    }
}]);