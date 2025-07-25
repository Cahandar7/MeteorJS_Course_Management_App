import {
  CompletedCoursesHistory,
  CompletedModules,
  Course_Module_Img,
  CourseModules,
  Courses,
} from "./collections";

Meteor.publishComposite("getCourses", function (query = {}) {
  return {
    find() {
      return Courses.find(query, { sort: { createdAt: -1 } });
    },
    children: [
      {
        find(course) {
          return CourseModules.find({ courseId: course._id });
        },
        children: [
          {
            find(module) {
              return Course_Module_Img.find({ "meta.moduleId": module._id })
                .cursor;
            },
          },
        ],
      },
    ],
  };
});

Meteor.publish("completedModules", function (query = {}) {
  return CompletedModules.find(query);
});

Meteor.publish("completedCoursesHistory", function (query = {}) {
  return CompletedCoursesHistory.find(query);
});

Meteor.publish("courseCategories", function () {
  return Courses.find({}, { fields: { category: 1 } });
});
