const File = require("../models/fileupload"); // Import User Model Schema
const { v4: uuidv4 } = require("uuid");
const hash = require("../config/password-hasher");
const mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
const formidable = require("formidable");
const path = require("path");
const ObjectId = mongoose.Types.ObjectId;
let fs = require("fs");
const { fail } = require("assert");

module.exports = (router) => {
  router.post("/addFile/:user_id", async (req, res) => {
    let useFor = "files";
    let formidable = require("formidable");
    let fs = require("fs");
    let path = require("path");
    let md5 = require("md5");

    var form = new formidable.IncomingForm();

    form.maxFileSize = 2500 * 1024 * 1024;
    form.multiples = true;

    form.uploadDir = path.join(__dirname, "..", "images/files");

    form.on("file", function (field, file) {
      let newFileName = [useFor, Math.random(), Math.random(), Math.random()];

      newFileName = `${md5(newFileName.join(""))}.${file.originalFilename
        .split(".")
        .pop()}`;

      fs.rename(file.filepath, path.join(form.uploadDir, newFileName), () => {
        let uploadData = new File({
          id: uuidv4(),
          user_id: req.params.user_id,
          source: newFileName,
          for: "files",
          filetype: file.mimetype.substring(0, file.mimetype.indexOf("/")),
        });
        uploadData.save((err, data) => {
          console.log(err);
          console.log(data);
        });
      });
    });

    form.on("progress", (bytesReceived, bytesExpected) => {});

    process.on("uncaughtException", function (err) {
      //this does nothing
      console.log(err);
      throw err;
    });

    form.on("error", function (err) {
      console.log("An error has occured: \n" + err);
      res.eventEmitter("error");
    });

    // once all the files have been uploaded, send a response to the client
    form.on("end", function () {
      console.log("finished uploading");
    });

    // parse the incoming request containing the form data
    // form.parse(req);

    form.parse(req, async (err, fields, files) => {
      let returnMe = [];

      returnMe.push([fields, files]);

      if (err) {
        next(err);
        return;
      }
      return await res.json({
        success: true,
        message: "Files uploaded successfully ",
        data: returnMe,
      });
    });
  });

  router.post("/addAvatar", (req, res) => {
    let useFor = req.body.useFor;
    let username = "tester";
    let formidable = require("formidable");
    let fs = require("fs");
    let path = require("path");
    let md5 = require("md5");

    var form = new formidable.IncomingForm();

    let newFileName = [username, Math.random(), Math.random(), Math.random()];

    let fileMime = "";

    form.uploadDir = `${__dirname}/../images/`;
    form.on("file", async (field, file) => {
      newFileName = `${md5(newFileName.join(""))}.${file.originalFilename
        .split(".")
        .pop()}`;

      fileMime = file.mimetype.substring(0, file.mimetype.indexOf("/"));

      if (fs.existsSync(file.filepath)) {
        fs.rename(
          file.filepath,
          path.join(form.uploadDir, newFileName),
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: err.name + " " + err.message,
              });
            }
          }
        );
      } else {
        return res.json({
          success: false,
          message: "Something went wrong please re-upload your image.",
        });
      }
    });

    form.on("error", function (err) {
      console.log("An error has occured: \n" + err);
    });
    form.on("end", function () {
      // console.log('hey');
    });
    //   form.parse(req);

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error(err);

        return;
      }

      let uploadData = new File({
        id: uuidv4(),
        source: newFileName,
        user_id: fields.id,
        for: "avatar",
        filetype: fileMime,
      });

      uploadData.save((err, data) => {
        if (err) {
          res.json({
            success: false,
            message: "Error, could not save avatar : " + err,
          });
        } else {
          res.json({
            success: true,
            message: "Avatar uploaded successfully ",
            data: data,
          });
        }
      });
    });
  });
  router.post("/addOrphanAvatar", (req, res) => {
    let useFor = "orphan";
    let username = "tester";
    let formidable = require("formidable");
    let fs = require("fs");
    let path = require("path");
    let md5 = require("md5");

    var form = new formidable.IncomingForm();

    let newFileName = [username, Math.random(), Math.random(), Math.random()];

    let fileMime = "";

    form.uploadDir = `${__dirname}/../images/`;
    form.on("file", async (field, file) => {
      newFileName = `${md5(newFileName.join(""))}.${file.originalFilename
        .split(".")
        .pop()}`;

      fileMime = file.mimetype.substring(0, file.mimetype.indexOf("/"));

      if (fs.existsSync(file.filepath)) {
        fs.rename(
          file.filepath,
          path.join(form.uploadDir, newFileName),
          (err) => {
            if (err) {
              return res.json({
                success: false,
                message: err.name + " " + err.message,
              });
            }
          }
        );
      } else {
        return res.json({
          success: false,
          message: "Something went wrong please re-upload your image.",
        });
      }
    });

    form.on("error", function (err) {
      console.log("An error has occured: \n" + err);
    });
    form.on("end", function () {
      // console.log('hey');
    });
    //   form.parse(req);

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error(err);

        return;
      }

      let uploadData = new File({
        id: uuidv4(),
        source: newFileName,
        user_id: fields.id,
        for: "avatar",
        filetype: fileMime,
      });

      uploadData.save((err, data) => {
        if (err) {
          res.json({
            success: false,
            message: "Error, could not save avatar : " + err,
          });
        } else {
          res.json({
            success: true,
            message: "Avatar uploaded successfully ",
            data: data,
          });
        }
      });
    });
  });

  router.put("/deleteFile", (req, res) => {
    console.log(req.body);

    let file = req.body.link.source;
    let id = req.body.link.id;

    let fs = require("fs");
    fs.unlink(
      `${path.join(__dirname, "..", "images/files")}/${file}`,
      (err) => {
        if (err) {
          return res.json({
            success: false,
            message: "The server cant find the file.",
          });
        } else {
          File.deleteOne({ id: id }, (err, results) => {
            if (err) {
              return res.json({ success: false, message: err.message });
            } else {
              return res.json({
                success: true,
                message: "The file has been remove.",
              });
            }
          });
        }
      }
    );
  });

  router.get("/getAllFiles/:user_id", (req, res) => {
    let query = req.params;

    File.find(query, (err, files) => {
      if (err) {
        return res.json({ success: false, message: err.message });
      } else {
        return res.json({ success: true, message: "Files", data: files });
      }
    });
  });

  return router;
};
