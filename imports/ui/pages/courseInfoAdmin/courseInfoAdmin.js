import "./courseInfoAdmin.html";
import {
  Course_Module_Img,
  CourseModules,
  Courses,
} from "../../../api/courses/collections";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";

Template.courseInfoAdmin.onCreated(function () {
  this.courseId = new ReactiveVar(FlowRouter.getParam("_id"));

  this.autorun(() => {
    this.subscribe("getCourses", { _id: this.courseId.get() });
  });
});

Template.courseInfoAdmin.helpers({
  getCourse() {
    return Courses.findOne({ _id: Template.instance().courseId.get() });
  },
  getCourseModules() {
    return CourseModules.find({
      courseId: Template.instance().courseId.get(),
    }).fetch();
  },
  getCourseModuleImg(moduleId) {
    return Course_Module_Img.findOne({ "meta.moduleId": moduleId })?.link();
  },
});

Template.courseInfoAdmin.events({
  "click #foo": function (event, template) {},
});
