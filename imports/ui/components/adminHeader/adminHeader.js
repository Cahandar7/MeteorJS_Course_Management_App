import "./adminHeader.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.adminHeader.onCreated(function () {
  this.path = new ReactiveVar();

  this.autorun(() => {
    FlowRouter.watchPathChange();
    this.path.set(FlowRouter.current().path);
  });
});

Template.adminHeader.helpers({
  isActive: function (path) {
    return Template.instance().path.get() === path ? "active" : "";
  },
});

Template.adminHeader.events({
  "click #logout-btn": function () {
    // if (Meteor.userId()) {
    Meteor.logout(() => {
      alert("Logged Out");
      FlowRouter.go("/login");
    });
    // }
  },
});
