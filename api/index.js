const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");
const jwt = require("jsonwebtoken");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mimeType = require("mime-types");

const app = express();
dotenv.config();
const bucket = "mern-booking-app";

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(cors({
  credentials: true,
  origin: "http://localhost:5173"
}));

// mongoose.connect(process.env.MONGO_URL);

const uploadToS3 = async (path, originalFilename, mimetype) => { 
  try {
    const client = new S3Client({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
      }
    });

    const parts = originalFilename.split(".");
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + "." + ext;

    const data = await client.send(new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read"
    }))

    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
  } catch(err) {
    console.log(err);
  }
};

const bcryptSalt = bcrypt.genSaltSync(10);

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if(err) throw err;
      resolve(userData);
    })
  })
  
};

app.post("/api/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt)
    })

    res.status(200).json(userDoc);
  } catch(err) {
    res.status(422);
  }
});

app.post("/api/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({email});
    if(userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if(passOk) {
        jwt.sign({
          email: userDoc.email, 
          id: userDoc._id}, 
          process.env.JWT_SECRET, 
          {}, 
          (err, token) => {
          if(err) throw err;
          res.cookie("token", token, 
          {sameSite: "none", secure: true}).status(201).json(userDoc);
        });
      }
    } else {
      res.json(false);
    }

  } catch(err) {
    res.status(500);
  }
});

app.get("/api/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if(err) throw err;
      try {
        const {name, email, _id} = await User.findById(userData.id);
        if({name, email, _id}) {
          res.json({name, email, _id});
        } else {
          res.json("User not found...");
        }
      } catch(err) {
        res.status(500);
      }
    })
  }
});

app.post("/api/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/api/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";

  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName
  });

  const url = await uploadToS3("/tmp/" + newName, newName, mimeType.lookup("/tmp/" + newName));
  res.json(url);
});

const photosMiddleware = multer({dest: "/tmp"});

app.post("/api/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const uploadedFiles = [];

  for(let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];

    try {
      const url = await uploadToS3(path, originalname, mimetype);
      uploadedFiles.push(url);
    } catch(err) {
      console.log(err);
    }
  };

  res.json(uploadedFiles);
});

app.post("/api/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    try {
      const placeDoc = await Place.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price
      });

      res.json(placeDoc);
    } catch(err) {
      res.status(500);
    }
  })
});

app.get("/api/user-places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    try {
      const { id } = userData;
      
      res.json(await Place.find({owner: id}));
    } catch(err) {
      res.status(500);
    }
  })
});

app.get("/api/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/api/places", async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    try {
      const placeDoc = await Place.findById(id);

      if(userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          price
        });

        const placeUpdated = await placeDoc.save();
        res.json(placeUpdated);
      }

    } catch(err) {
      res.json("Fail to update...");
    }
  })
});

app.get("/api/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.post("/api/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);

  const { 
    place,
    checkIn, 
    checkOut, 
    numberOfGuests, 
    name, 
    mobile,
    price 
  } = req.body;

  try {
    const bookingDoc = await Booking.create({
      place,
      user: userData.id,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      mobile,
      price
    });

    res.status(200).json(bookingDoc);
  } catch(err) {
    res.status(500);
  }
});

app.get("/api/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  try {
    res.json(await Booking.find({user: userData.id}).populate("place"));
  } catch(err) {
    console.log(err);
  }
});


app.listen("8000", () => {
  console.log("Api is running...");
});
