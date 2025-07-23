import { Courses } from "../courses/collections";
import { Notifications } from "./collections";

Meteor.methods({
  addNotification: function (toAdmin, studentId, coursesIds, content) {
    coursesIds.map((courseId) => {
      let course = Courses.findOne(courseId);
      Notifications.insert({
        toAdmin,
        studentId,
        courseId: course._id,
        courseTitle: course.title,
        content,
        date: new Date(),
      });
    });
  },
});
