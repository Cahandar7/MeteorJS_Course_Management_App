Meteor.publish("getStudents", function () {
  return Meteor.users.find({});
});
