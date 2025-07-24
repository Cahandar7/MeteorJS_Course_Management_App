import { Feedbacks } from "../../../api/feedbacks/collections";
import "./feedbacks.html";

Template.feedbacks.onCreated(function () {
  this.autorun(() => {
    this.subscribe("feedbacks");
  });
  this.autorun(() => {
    this.subscribe("getStudents");
  });
});

Template.feedbacks.helpers({
  getFeedbacks() {
    return Feedbacks.find({}, { sort: { date: -1 } }).fetch();
  },
  getStudentName(id) {
    const user = Meteor.users.findOne(id);
    return user?.profile?.firstName || "Unknown Student";
  },
  starsArray(rating) {
    return Array(rating).fill(0);
  },
});
