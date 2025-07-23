import { Notifications } from "../../../api/notifications/collections";
import "./notificationAdmin.html";

Template.notificationAdmin.onCreated(function () {
  this.autorun(() => {
    this.subscribe("notifications", { toAdmin: true });
  });
});

Template.notificationAdmin.helpers({
  getNotifications() {
    return Notifications.find({}, { sort: { date: -1 } }).fetch();
  },
});
