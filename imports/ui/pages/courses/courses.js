import "./courses.html";
import { Courses } from "../../../api/courses/collections";

Template.courses.onCreated(function () {
  this.autorun(() => {
    let courses = Meteor.user()?.profile?.enrolledCourses.map(
      (course) => course.courseId
    );
    console.log(courses);
    if (courses?.length) {
      this.subscribe("getCourses", {
        _id: {
          $in: courses,
        },
      });
    }
  });
});

Template.courses.helpers({
  getCourses() {
    return Courses.find();
  },
});
