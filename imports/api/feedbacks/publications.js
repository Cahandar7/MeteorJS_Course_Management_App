import { Feedbacks } from "./collections";

Meteor.publish("feedbacks", function (query = {}) {
  return Feedbacks.find(query);
});
