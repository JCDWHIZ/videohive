import express, { Application, Request, Response } from "express";
import { ConnectToDb } from "./config/db";
const app: Application = express();
const authRouter = require("./routes/auth");
require("dotenv").config();
app.use(express.json());
ConnectToDb();

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} ${JSON.stringify(req.body)}`,
  );
  next();
});

app.use(authRouter);

// // for formdata url encoded data
// app.use(express.urlencoded({ extended: true }));
// // for from data
// app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>hello world</h1>");
});

app.get("/about", (req: Request, res: Response) => {
  res.send("<h1>nice website welcome to the about page</h1>");
});

app.post("/contact", (req, res) => {
  const { name, email, password, message } = req.body;

  if (!name || !email || !password || !message) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "password must be at least 6 characters",
    });
  }

  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({
      message: "please provide a valid email address",
    });
  }

  // save the information to the database or send an email

  res.json({
    message: "contact form submitted successfully",
  });
});

//! request object
// app.get("/test/:id/name/:name", (req: Request, res: Response) => {
//   // request params
//   console.log(req.params.id);
//   console.log(req.params.name);

//   res.send(
//     `<h1>test page welcome to ${req.params.id} and ${req.params.name}</h1>`,
//   );
// });

// app.get("/test", (req: Request, res: Response) => {
//   //  request query
//   console.log(req.query);
//   res.send(
//     `<h1>test page welcome to ${req.query.id} and ${req.query.name}</h1>`,
//   );
// });

// app.post("/test", (req: Request, res: Response) => {
//   // request body
//   console.log(req.body);
//   res.send({
//     message: "data received successfully",
//   });
// });

// ! response object
// app.get("/test", (req: Request, res: Response) => {
//   // response status code
//   res.status(200).json({
//     message: "test page",
//     children: [
//       {
//         name: "john",
//         age: 30,
//       },
//     ],
//   });
// });

app.listen(5555, () => {
  console.log("server is running at 5555");
});
