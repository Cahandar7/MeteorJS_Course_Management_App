import "./studentHeader.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.studentHeader.onCreated(function () {
  this.path = new ReactiveVar();

  this.autorun(() => {
    FlowRouter.watchPathChange();
    this.path.set(FlowRouter.current().path);
  });
});

Template.studentHeader.helpers({
  isActive: function (path) {
    return Template.instance().path.get() === path ? "active" : "";
  },
  userName: function () {
    return Meteor.user()?.profile.firstName;
  },
});

Template.studentHeader.events({
  "click #logout-btn": function () {
    if (Meteor.userId()) {
      Meteor.logout(() => {
        alert("Logged Out");
        FlowRouter.go("/login");
      });
    }
  },
});
