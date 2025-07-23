Meteor.methods({
  createStudent: function (data) {
    return Accounts.createUser(data);
  },
  deleteStudent: function (id) {
    return Meteor.users.remove(id);
  },
  updateStudent: function (studentId, courses) {
    Meteor.users.update(
      { _id: studentId },
      { $set: { "profile.enrolledCourses": courses } }
    );
  },
  updateStudentCourseState: function (studentId, courseId, newState) {
    const student = Meteor.users.findOne(studentId);

    const enrolledCourses = student.profile?.enrolledCourses || [];

    const updatedCourses = enrolledCourses.map((course) => {
      if (course.courseId === courseId) {
        return { ...course, state: newState, startDate: new Date() };
      }
      return course;
    });

    Meteor.users.update(
      { _id: studentId },
      { $set: { "profile.enrolledCourses": updatedCourses } }
    );
  },
});
