import "./editCourse.html";
import { CourseModules, Courses } from "../../../api/courses/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.editCourse.onCreated(function () {
  this.courseId = new ReactiveVar(FlowRouter.getParam("_id"));

  this.autorun(() => {
    this.subscribe("getCourses", { _id: this.courseId.get() });
  });
});

Template.editCourse.helpers({
  getCourse() {
    return Courses.findOne({ _id: Template.instance().courseId.get() });
  },
  getModules() {
    return CourseModules.find({
      courseId: Template.instance().courseId.get(),
    }).fetch();
  },
  IndexingModules(index) {
    return index + 1;
  },
});

Template.editCourse.events({
  "submit .edit-course-form"(event, template) {
    event.preventDefault();

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

    Meteor.call(
      "updateCourse",
      template.courseId.get(),
      updatedCourse,
      (error) => {
        if (error) {
          alert("Update failed");
          console.error(error);
        } else {
          $(".module-input").each(function () {
            const moduleId = $(this).find(".module-id").val();
            const title = $(this).find(".module-title").val();
            const description = $(this).find(".module-desc").val();

            const updatedModule = { title, description };

            Meteor.call(
              "updateCourseModule",
              moduleId,
              updatedModule,
              (err) => {
                if (err) {
                  console.error("Module update error:", err);
                }
              }
            );
          });
          alert("Course updated!");
          FlowRouter.go("/admin/courses");
        }
      }
    );
  },
});
