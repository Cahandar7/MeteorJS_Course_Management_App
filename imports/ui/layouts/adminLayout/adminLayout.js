import "./adminLayout.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.adminLayout.onCreated(function () {
  this.pass = new ReactiveVar(false);

  this.autorun(() => {
    if (!Meteor.loggingIn()) {
      if (Meteor.userId() && Meteor.user()?.profile?.role !== "admin") {
        alert("Access denied");
        FlowRouter.go("/login");
        this.pass.set(false);
      } else if (Meteor.user()?.profile?.role === "admin") {
        this.pass.set(true);
      }
    }
  });
});

Template.adminLayout.helpers({
  isPassing: function () {
    return Template.instance().pass.get();
  },
});
