import {
  CompletedCoursesHistory,
  CompletedModules,
  Course_Module_Img,
  CourseModules,
  Courses,
} from "./collections";

Meteor.methods({
  addCourse: function (data) {
    const { modules, ...rest } = data;
    let result1 = Courses.insert({ ...rest, createdAt: new Date() });
    let result2 = modules.map((module) => {
      CourseModules.insert({
        courseId: rest._id,
        ...module,
      });
    });
    return [result1, result2];
  },
  updateCourse: function (courseId, updatedData) {
    return Courses.update(courseId, { $set: updatedData });
  },
  updateCourseModule: function (moduleId, updatedData) {
    return CourseModules.update(moduleId, { $set: updatedData });
  },
  deleteCourses: function (query = {}) {
    const courseId = query._id;

    const courseModules = CourseModules.find({ courseId }).fetch();

    const moduleIds = courseModules.map((mod) => mod._id);

    Course_Module_Img.remove({
      "meta.moduleId": { $in: moduleIds },
    });

    CourseModules.remove({ courseId });

    Courses.remove(query);
  },
  completeStudentModule: function (studentId, courseId, moduleId) {
    CompletedModules.upsert(
      { studentId, courseId, moduleId },
      {
        $set: {
          studentId,
          courseId,
          moduleId,
          date: new Date(),
          isCompleted: true,
        },
      }
    );

    const allCourseModules = CourseModules.find({
      courseId,
    }).fetch();

    const completedModuleIds = CompletedModules.find({
      studentId,
      courseId,
      isCompleted: true,
    })
      .fetch()
      .map((m) => m.moduleId);

    const allCompleted = allCourseModules.every((mod) =>
      completedModuleIds.includes(mod._id)
    );

    if (allCompleted) {
      const user = Meteor.users.findOne({ _id: studentId });
      const enrolledCourses = user?.profile?.enrolledCourses || [];

      const index = enrolledCourses.findIndex(
        (course) => course.courseId === courseId
      );

      if (index !== -1) {
        enrolledCourses[index].state = "Completed";

        Meteor.users.update(
          { _id: studentId },
          {
            $set: {
              "profile.enrolledCourses": enrolledCourses,
            },
          }
        );
        CompletedCoursesHistory.insert({
          studentId,
          courseId,
          courseTitle: Courses.findOne({ _id: courseId }).title,
          completionDate: new Date(),
        });

        Meteor.call(
          "addNotification",
          true,
          studentId,
          [courseId],
          "Student successfully completed the course",
          (err) => console.log(err)
        );
      }
    }

    return;
  },
});
