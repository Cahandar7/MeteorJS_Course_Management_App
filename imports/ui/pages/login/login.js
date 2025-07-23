import "./login.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.login.events({
  "submit #login-form": function (event, template) {
    event.preventDefault();

    let email = $("#email").val();
    let password = $("#password").val();

    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.log(err);
        alert("Invalid cridentials");
      }
    });

    if (Meteor.user()?.profile?.role === "admin") {
      FlowRouter.go("/admin/courses");
    }
    if (Meteor.user()?.profile?.role === "student") {
      FlowRouter.go("/");
    }
  },
});
