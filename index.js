import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer"; //Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
import helmet from "helmet"; //Helmet is a collection of several smaller middleware functions that set security-related HTTP response headers.
import morgan from "morgan"; //Morgan is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application.
import path from "path";
import { fileURLToPath } from "url";
import {register} from './controllers/auth.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import path from "path";
//  import User from "./models/User.js";
//  import Post from "./models/Post.js";
//  import { users, posts } from "./data/index.js";

/*CONFIGURATIONS*/
const __fileName = fileURLToPath(import.meta.url); // C:\Users\akvar\OneDrive\Desktop\demo\App\social media app\server\index.js
const __dirname = path.dirname(__fileName); // C:\Users\akvar\OneDrive\Desktop\demo\App\social media app\server
dotenv.config(); // so we can use .env files.
const app = express(); // so that we can use middlewares.
app.use(express.json()); //it is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
app.use(cors()) // this will envoke cross_Origin_Resource_Sharing policy.
app.use(morgan('common'));
app.use(bodyParser.json({limit: '30mb', extended: true}));
app.use(bodyParser.urlencoded({limit : '30mb', extended: true}));
app.use('/assets', express.static(path.join(__dirname, 'public/assets'))); // it will set the directory of where we keep our assets.
app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function(req,res){
  res.sendFile(path.join(__dirname, './client/build/index.html'))
});
/* FILE STORAGE */
// DiskStorage
//The disk storage engine gives you full control on storing files to disk.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
  // ROUTES WITH FILE
  app.post('/auth/register', upload.single('picture'), register);
  app.post('/posts', verifyToken, upload.single('picture'), createPost);
  
  //ROUTES
  app.use('/auth', authRoutes);
  app.use('/users', userRoutes);
  app.use('/posts', postRoutes);




  // Mongoose Setup
  const PORT = process.env.PORT || 6001;
  const url = process.env.MONGO_URL;
  mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGO_URL, {
    
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

        /* ADD DATA ONE TIME */
    //  User.insertMany(users);
    //  Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

