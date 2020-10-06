

exports.upload =
  (uploadFile.array("photos", 8),
  async (req, res, next) => {
    const photos = req.files;
    const _id = req.params.id;
    const menu = await Menu.findById(_id);

    // Check if menu id is valid
    if (!menu) {
      return next(new ErrorResponse(`Menu with ${_id} is not found.`, 404));
    }

    // Check if any photo is selected for upload
    if (!photos) {
      return next(new ErrorResponse("No photo selected.", 400));
    } else {
      let data = [];
      // Loop through req.files.photos
      for (let key in req.files.photos) {
        if (req.files.photos.hasOwnProperty(key)) {
          // Assign photos arrays to a variable
          let photoURL = req.files.photos[key];

          //Generate random date and Pick last 3 digits of tiimestamp generated
          let today = new Date();
          today = Date.now().toString().slice(-3);
          let rand = Math.floor(Math.random() * 10000);

          // Rename uploaded files
          photoURL.name = `menu_${rand}${today}${
            path.parse(photoURL.name).ext
          }`;

          // Validate uploaded file
          if (!photoURL.mimetype.startsWith("image")) {
            return next(new ErrorResponse("Photos only", 400));
          }
          // Validate uploaded file size
          if (photoURL.size > process.env.FILE_SIZE) {
            return next(
              new ErrorResponse("Sorry, file is larger than 2mb", 400)
            );
          }
          data.push({
            name: photoURL.name,
            data: photoURL.data,
            mimeType: photoURL.mimeType,
            size: photoURL.size,
          });
          await Menu.findByIdAndUpdate(_id, {
            photo: photoURL.data,
          });
        }
      }
      return res.json({
        status: true,
        message: "Photos uploaded successfully.",
      });
    }
    console.error(error);
  });
