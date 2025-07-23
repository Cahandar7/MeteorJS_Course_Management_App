import "./completedCoursesHistory.html";
import { CompletedCoursesHistory } from "../../../api/courses/collections";

Template.completedCoursesHistory.onCreated(function () {
  this.autorun(() => {
    this.subscribe("completedCoursesHistory", { studentId: Meteor.userId() });
  });
});

Template.completedCoursesHistory.helpers({
  ShowHistory: function () {
    return CompletedCoursesHistory.find({ studentId: Meteor.userId() }).fetch();
  },
});
