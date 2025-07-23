import "./coursesAdmin.html";
import { Course_Module_Img, Courses } from "../../../api/courses/collections";
import { Random } from "meteor/random";

Template.coursesAdmin.onCreated(function () {
  this.filterCategory = new ReactiveVar("");

  this.autorun(() => {
    this.subscribe("getCourses");
  });

  this.autorun(() => {
    this.subscribe("courseCategories");
  });
});

Template.coursesAdmin.onRendered(function () {
  $(".num-of-modules").on("input", function () {
    const num = parseInt($(this).val());
    const container = $("#modules-container");
    container.empty();

    if (typeof num == "number" && num > 0) {
      for (let i = 1; i <= num; i++) {
        container.append(`
          <div class="mb-3 module-input" data-index="${i}">
            <label class="form-label">Module ${i} Title</label>
            <input type="text" class="form-control module-title" name="moduleTitle${i}" required />

            <label class="form-label mt-2">Module ${i} Description</label>
            <input type="text" class="form-control module-desc" name="moduleDesc${i}" />

            <label class="form-label mt-2">Module ${i} Image</label>
            <input type="file" class="form-control module-file" name="moduleFile${i}" />
          </div>
        `);
      }
    }
  });
});

Template.coursesAdmin.helpers({
  getCourses() {
    return Courses.find({}, { sort: { createdAt: -1 } });
  },
  getCategories() {
    const categories = Courses.find()
      .fetch()
      .map((cat) => cat.category);

    return [...new Set(categories)];
  },
});

Template.coursesAdmin.events({
  "submit .course-form": function (event, template) {
    event.preventDefault();

    const title = $(".course-form .title").val();
    const desc = $(".course-form .desc").val();
    const category = $(".course-form .category").val();
    const duration = $(".course-form .duration").val();
    const numModules = Number($(".course-form .num-of-modules").val());

    const modules = [];

    let uploadsDone = 0;

    for (let i = 1; i <= numModules; i++) {
      const moduleTitle = $(`[name='moduleTitle${i}']`).val();
      const moduleDesc = $(`[name='moduleDesc${i}']`).val();
      const fileInput = $(`[name='moduleFile${i}']`)[0];
      const file = fileInput?.files[0];

      const moduleId = Random.id();

      const moduleData = {
        _id: moduleId,
        title: moduleTitle,
        description: moduleDesc,
      };

      if (file) {
        const upload = Course_Module_Img.insert(
          {
            meta: {
              temp: true,
              moduleId,
            },
            file,
            chunkSize: "dynamic",
          },
          false
        );

        upload.on("end", function (error, fileObj) {
          if (error) {
            console.log("Upload error:", error);
          } else {
            moduleData.imgId = fileObj._id;
          }

          modules.push(moduleData);
          uploadsDone++;

          if (uploadsDone === numModules) {
            insertCourseAndModules();
          }
        });

        upload.start();
      } else {
        modules.push(moduleData);
        uploadsDone++;

        if (uploadsDone === numModules) {
          insertCourseAndModules();
        }
      }
    }

    function insertCourseAndModules() {
      const newCourse = {
        _id: Random.id(),
        title,
        desc,
        category,
        duration,
        numModules,
        modules,
      };

      Meteor.call("addCourse", newCourse, function (err, res) {
        if (err) {
          console.log("Course insert error:", err);
        } else {
          console.log("Course added");
          $("#modules-container").empty();
          window.location.reload();
        }
      });
    }
  },
  "click .delete-btn": function (event, template) {
    Meteor.call("deleteCourses", { _id: this._id }, (error, success) => {
      if (error) {
        console.log({ error });
      } else {
        console.log({ success });
      }
    });
  },
  "click .clear-btn": function (event, template) {
    Meteor.call("deleteCourses", (error, success) => {
      if (error) {
        console.log({ error });
      } else {
        console.log({ success });
      }
    });
  },
  "click .filter-btn": function (event, template) {
    const selectedCategory = $(".filter-category").val();

    template.filterCategory.set(selectedCategory);
  },
  "click .reset-filter-btn": function (event, template) {
    template.filterCategory.set("");

    $(".filter-category").val("");
  },
});
