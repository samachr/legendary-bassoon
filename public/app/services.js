lb.service('juror', function(){
  var _id = '';
  this.setID = function(id) {
    _id = id;
  }
  this.getID = function(id) {
    return _id;
  }
  this.juror_data = {}
});
