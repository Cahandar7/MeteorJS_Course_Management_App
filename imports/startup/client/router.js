import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "../../ui/components/adminHeader/adminHeader";
import "../../ui/components/studentHeader/studentHeader";

import "../../ui/layouts/adminLayout/adminLayout";
import "../../ui/layouts/studentLayout/studentLayout";
import "../../ui/layouts/mainLayout/mainLayout";

import "../../ui/pages/students/students";
import "../../ui/pages/coursesAdmin/coursesAdmin";
import "../../ui/pages/editCourse/editCourse";
import "../../ui/pages/courseInfoAdmin/courseInfoAdmin";
import "../../ui/pages/courses/courses";
import "../../ui/pages/coursesInfoStudent/coursesInfoStudent";
import "../../ui/pages/completedCoursesHistory/completedCoursesHistory";
import "../../ui/pages/notFound/notFound";
import "../../ui/pages/login/login";
import "../../ui/pages/register/register";
import "../../ui/pages/feedbacks/feedbacks";
import "../../ui/pages/notificationStudent/notificationStudent";
import "../../ui/pages/notificationAdmin/notificationAdmin";

FlowRouter.triggers.enter([authMiddleware], {
  only: [
    "Courses",
    "CompletedCoursesHistory",
    "coursesInfoStudent",
    "AdminCourses",
    "CourseInfoAdmin",
    "EditCourse",
    "AdminStudents",
    "Register",
    "NotificationsStudent",
    "NotificationsAdmin",
    "Feedbacks",
  ],
});

FlowRouter.route("/", {
  name: "Courses",
  action() {
    BlazeLayout.render("studentLayout", { main: "courses" });
  },
});

FlowRouter.route("/history", {
  name: "CompletedCoursesHistory",
  action() {
    BlazeLayout.render("studentLayout", { main: "completedCoursesHistory" });
  },
});

FlowRouter.route("/notifications", {
  name: "NotificationsStudent",
  action() {
    BlazeLayout.render("studentLayout", { main: "notificationStudent" });
  },
});

FlowRouter.route("/admin/notifications", {
  name: "NotificationsAdmin",
  action() {
    BlazeLayout.render("adminLayout", { main: "notificationAdmin" });
  },
});

FlowRouter.route("/login", {
  name: "Login",
  action() {
    BlazeLayout.render("mainLayout", { main: "login" });
  },
});

FlowRouter.route("/admin/feedbacks", {
  name: "Feedbacks",
  action() {
    BlazeLayout.render("adminLayout", { main: "feedbacks" });
  },
});

FlowRouter.route("/register", {
  name: "Register",
  action() {
    BlazeLayout.render("adminLayout", { main: "register" });
  },
});

FlowRouter.route("/:_id", {
  name: "coursesInfoStudent",
  action() {
    BlazeLayout.render("studentLayout", { main: "coursesInfoStudent" });
  },
});

FlowRouter.route("/admin/courses", {
  name: "AdminCourses",
  action() {
    BlazeLayout.render("adminLayout", { main: "coursesAdmin" });
  },
});

FlowRouter.route("/admin/courses/:_id", {
  name: "CourseInfoAdmin",
  action() {
    BlazeLayout.render("adminLayout", { main: "courseInfoAdmin" });
  },
});

FlowRouter.route("/admin/courses/edit/:_id", {
  name: "EditCourse",
  action() {
    BlazeLayout.render("adminLayout", {
      main: "editCourse",
    });
  },
});

FlowRouter.route("/admin/students", {
  name: "AdminStudents",
  action() {
    BlazeLayout.render("adminLayout", { main: "students" });
  },
});

FlowRouter.route("*", {
  action() {
    BlazeLayout.render("mainLayout", { main: "notFound" });
  },
});

function authMiddleware(context, redirect) {
  if (!Meteor.userId() && !Meteor.loggingIn()) {
    redirect("/login");
  }
}
