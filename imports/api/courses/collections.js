export const Courses = new Mongo.Collection("courses");
export const CourseModules = new Mongo.Collection("courseModules");
export const CompletedModules = new Mongo.Collection("completedModules");
export const CompletedCoursesHistory = new Mongo.Collection(
  "completedCoursesHistory"
);

import { FilesCollection } from "meteor/ostrio:files";

export const Course_Module_Img = new FilesCollection({
  collectionName: "Course_Module_Img",
  allowClientCode: false,
  storagePath: "C:/Users/user/Desktop/Meteor.js/MeteorJS_Course_Management/Cousre_Management_Files",
  onBeforeUpload(file) {
    if (file.extension === "png" && file.size <= 10 * 1024 * 1024) {
      return true;
    }
    return "Please upload PNG files only (max 10MB)";
  },
});
