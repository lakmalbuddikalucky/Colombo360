'use strict'

var colombo360 = angular.module('colombo360', [ 'ngRoute','ngResource','ui.bootstrap','angularModalService','ui.router']);

colombo360.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider){
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/',{templateUrl:'login.html'})
        .when('/profile',{templateUrl:'author-login.html'})
        .when('/map',{templateUrl:'map.html'})
        .when('/feed',{templateUrl:'feed.html'})
        .when('/viewPhotosphere', {templateUrl:'viewPhotosphere.html'})
        .when('/upload', {templateUrl:'upload.html'})
        .otherwise({redirectTo: '/'});
}]);

colombo360.controller('AppController', ['$scope','$window','$http','ModalService','$rootScope',function($scope,$window,$http,ModalService,$rootScope) {

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
}]);