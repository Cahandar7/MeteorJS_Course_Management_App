import "./editCourse.html";
import { Courses } from "../../../api/courses/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.editCourse.onCreated(function () {
  this.courseId = FlowRouter.getParam("_id");

  this.autorun(() => {
    this.subscribe("getCourses", { _id: this.courseId });
  });
});

Template.editCourse.helpers({
  getCourse() {
    return Courses.findOne({ _id: Template.instance().courseId });
  },
  plusOne(index) {
    return index + 1;
  },
});

Template.editCourse.events({
  "submit .edit-course-form"(event, template) {
    event.preventDefault();

    const courseId = FlowRouter.getParam("_id");

    let title = $(".edit-course-form .title").val();
    let desc = $(".edit-course-form .desc").val();
    let category = $(".edit-course-form .category").val();
    let duration = $(".edit-course-form .duration").val();
    let numModules = $(".edit-course-form .num-of-modules").val();

    const updatedCourse = {
      title,
      desc,
      category,
      duration,
      numModules,
    };

    Meteor.call("updateCourse", courseId, updatedCourse, (error) => {
      if (error) {
        alert("Update failed");
        console.error(error);
      } else {
        alert("Course updated!");
        FlowRouter.go("/admin/courses");
      }
    });
  },
});
