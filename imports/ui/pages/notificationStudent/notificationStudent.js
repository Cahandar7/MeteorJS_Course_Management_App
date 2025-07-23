import { Notifications } from "../../../api/notifications/collections";
import "./notificationStudent.html";

Template.notificationStudent.onCreated(function () {
  this.autorun(() => {
    this.subscribe("notifications", {
      studentId: Meteor.userId(),
      toAdmin: false,
    });
  });
});

Template.notificationStudent.helpers({
  getNotifications() {
    console.log(
      Notifications.find(
        {
          studentId: Meteor.userId(),
        },
        { sort: { date: -1 } }
      ).fetch(),
      "loook"
    );
    return Notifications.find(
      {
        studentId: Meteor.userId(),
      },
      { sort: { date: -1 } }
    ).fetch();
  },
});
