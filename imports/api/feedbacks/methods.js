import { Courses } from "../courses/collections";
import { Feedbacks } from "./collections";

Meteor.methods({
  addFeedback({ studentId, courseId, content, rating }) {
    const course = Courses.findOne(courseId);

    const courseTitle = course.title;

    return Feedbacks.insert({
      studentId,
      courseId,
      courseTitle,
      content,
      rating,
      date: new Date(),
    });
  },
});
