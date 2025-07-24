import {
  CompletedModules,
  Course_Module_Img,
  CourseModules,
  Courses,
} from "../../../api/courses/collections";
import "./coursesInfoStudent.html";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.coursesInfoStudent.onCreated(function () {
  this.courseId = new ReactiveVar(FlowRouter.getParam("_id"));

  this.autorun(() => {
    this.subscribe("getCourses", { _id: this.courseId.get() });
  });

  this.autorun(() => {
    this.subscribe("completedModules", {
      studentId: Meteor.userId(),
    });
  });
});

Template.coursesInfoStudent.helpers({
  getCourse: function () {
    return Courses.findOne({ _id: Template.instance().courseId.get() });
  },
  getCourseModules: function () {
    return CourseModules.find({
      courseId: Template.instance().courseId.get(),
    }).fetch();
  },
  getCourseModuleImg: function (moduleId) {
    return Course_Module_Img.findOne({ "meta.moduleId": moduleId })?.link();
  },
  isCourseStarted: function (id) {
    return (
      Meteor.users
        .findOne({ _id: Meteor.userId() })
        ?.profile?.enrolledCourses?.find((course) => course.courseId === id)
        ?.state === "In Progress"
    );
  },
  isCourseCompleted: function (id) {
    return (
      Meteor.users
        .findOne({ _id: Meteor.userId() })
        ?.profile?.enrolledCourses?.find((course) => course.courseId === id)
        ?.state === "Completed"
    );
  },
  isModuleCompleted: function (moduleId) {
    return CompletedModules.findOne({ moduleId })?.isCompleted === true;
  },
});

Template.coursesInfoStudent.events({
  "click #start-course-btn": function (event, template) {
    Meteor.call(
      "updateStudentCourseState",
      Meteor.userId(),
      template.courseId.get(),
      "In Progress"
    );
  },
  "click .isModuleCompleted": function (event, template) {
    const studentId = Meteor.userId();
    const courseId = template.courseId.get();
    const module_id = event.target.value;

    Meteor.call("completeStudentModule", studentId, courseId, module_id);
  },
  "submit #feedbackForm": function (event, template) {
    event.preventDefault();

    const feedbackText = $("#feedbackText").val();
    const feedbackRating = $("#feedbackRating").val();

    if (!feedbackText || !feedbackRating) {
      alert("Please fill in both the feedback and rating.");
      return;
    }

    const studentId = Meteor.userId();
    const courseId = template.courseId.get();

    Meteor.call(
      "addFeedback",
      {
        studentId,
        courseId,
        content: feedbackText,
        rating: parseInt(feedbackRating),
      },
      function (error) {
        if (error) {
          alert("Error submitting feedback: " + error.reason);
          $("#feedbackModal").modal("hide");
        } else {
          alert("Feedback submitted successfully!");
          $("#feedbackModal").modal("hide");
          event.target.reset();
        }
      }
    );
  },
});
