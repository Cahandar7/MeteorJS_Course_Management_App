import "./students.html";
import { Courses } from "../../../api/courses/collections";

Template.students.onCreated(function () {
  this.selectedStudentId = new ReactiveVar(null);

  this.autorun(() => {
    this.subscribe("getStudents");
  });

  this.autorun(() => {
    this.subscribe("getCourses");
  });
});

Template.students.helpers({
  listAllStudents() {
    return Meteor.users.find();
  },
  listAllCourses() {
    return Courses.find();
  },
  isAdmin(role) {
    return role === "admin";
  },
  enrolledCourseNames(student) {
    if (!student?.profile?.enrolledCourses) return [];

    const enrolledMap = {};
    student.profile.enrolledCourses.forEach((entry) => {
      enrolledMap[entry.courseId] = entry.state;
    });

    return Courses.find({ _id: { $in: Object.keys(enrolledMap) } })
      .fetch()
      .map((course) => ({
        title: course.title,
        state: enrolledMap[course._id] || "Not Started",
      }));
  },
  isEnrolled(id) {
    return Meteor.users
      .findOne({ _id: Template.instance().selectedStudentId.get() })
      ?.profile?.enrolledCourses?.some((item) => item.courseId === id);
  },
});

Template.students.events({
  "click .delete-student-btn": function (event, template) {
    const studentId = event.currentTarget.dataset.id;

    if (confirm("Are you sure you want to delete this student?")) {
      Meteor.call("deleteStudent", studentId, (err) => {
        if (err) {
          alert("Failed to delete: " + err.reason);
        } else {
          alert("Student deleted successfully!");
        }
      });
    }
  },
  "click .enroll-btn": function (event, template) {
    template.selectedStudentId.set(event.currentTarget.dataset.id);
  },
  "click .confirm-enroll-btn"(event, template) {
    const studentId = template.selectedStudentId.get();
    const student = Meteor.users.findOne({ _id: studentId });

    let enrolledCourses = student?.profile?.enrolledCourses || [];
    let newEnrolledCourses = [];

    $(".enroll-course-checkbox:checked").each(function () {
      const courseId = this.value;
      const alreadyEnrolled = enrolledCourses.some(
        (item) => item.courseId === courseId
      );
      if (!alreadyEnrolled) {
        enrolledCourses.push({ courseId, state: "Not Started" });
        newEnrolledCourses.push(courseId);
      }
    });

    $(".enroll-course-checkbox:not(:checked)").each(function () {
      const courseId = this.value;
      enrolledCourses = enrolledCourses.filter(
        (item) => item.courseId !== courseId
      );
    });

    Meteor.call("updateStudent", studentId, enrolledCourses, (err) => {
      if (err) {
        alert("Error: " + err.reason);
      } else {
        alert("Successfully enrolled!");
        $("#enrollModal").modal("hide");
      }
    });

    Meteor.call(
      "addNotification",
      false,
      studentId,
      newEnrolledCourses,
      "You were assigned to new course",
      (err) => {
        if (err) {
          console.log("Error: " + err.reason);
        }
      }
    );
  },
});
