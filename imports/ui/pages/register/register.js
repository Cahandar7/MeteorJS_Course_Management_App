import "./register.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.register.events({
  "submit #register-form": function (event, template) {
    event.preventDefault();

    let email = $("#registerEmail").val();
    let password = $("#registerPassword").val();
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let gender = $("#gender").val();
    let age = $("#age").val();
    let role = $("#role").val();

    let newStudent = {
      email,
      password,
      profile: { firstName, lastName, gender, age, role, enrolledCourses: [] },
    };

    Meteor.call("createStudent", newStudent, (err, success) => {
      if (err) {
        console.log(err);
        return;
      }
      if (success) {
        alert("Student created successfully");
        FlowRouter.go("/admin/students");
      }
    });
  },
});
