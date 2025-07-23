import { Notifications } from "./collections";

Meteor.publish("notifications", function (query = {}) {
  return Notifications.find(query);
});
