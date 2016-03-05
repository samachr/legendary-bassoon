lb.controller("registration", function($scope, $location, $http, juror){

  $scope.user = {}

  if(juror.getID() == '') {
    $location.path("/");
  }


  $scope.user['email'] = juror.juror_data['email']
  $scope.user['password'] = juror.juror_data['password']
  $scope.user['phone'] = juror.juror_data['phone']


  if(juror.juror_data['receiveCall']) {
    $scope.user['contact_method'] = 'receiveCall';
  } else if(juror.juror_data['receiveEmail']) {
    $scope.user['contact_method'] = 'receiveEmail';
  } else if(juror.juror_data['receiveText']) {
    $scope.user['contact_method'] = 'receiveText';
  }

  $scope.submit = function() {

    juror.juror_data['receiveCall'] = $scope.user['contact_method'] == 'receiveCall';
    juror.juror_data['receiveEmail'] = $scope.user['contact_method'] == 'receiveEmail';
    juror.juror_data['receiveText'] = $scope.user['contact_method'] == 'receiveText';

    if(juror.juror_data['receiveCall']) {
      $scope.user['contact_method'] = 'receiveCall';
    } else if(juror.juror_data['receiveEmail']) {
      $scope.user['contact_method'] = 'receiveEmail';
    } else if(juror.juror_data['receiveText']) {
      $scope.user['contact_method'] = 'receiveText';
    }

    var data = {
      juror_id: juror.juror_id,
      email: $scope.user['email'],
      phone: $scope.user['phone'],
      password: $scope.user['password'],
      receiveCall: juror.juror_data['receiveCall'],
      receiveEmail: juror.juror_data['receiveEmail'],
      receiveText: juror.juror_data['receiveText']
    }

    $http.post("/api/v1/user/update", data).then(function(data, status) {
      $location.path("/dashboard");
    });
  }
})
