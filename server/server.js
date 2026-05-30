const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const fs = require('fs')
const morgan = require ('morgan')
const bodyParser = require ('body-parser')
require('dotenv').config()
const auth = require("./routes/auth")
const category = require("./routes/category")
const cloudinary = require("./routes/cloudinary")
const coupon = require("./routes/coupon")
const product = require("./routes/product")
const sub = require("./routes/Sub")
// const logger = require('./config/logger');
// const { startCronJobs } = require('./jobs');

const allowOrigins = [
    "https://folaontherise.com","https://www.folaontherise.com"
]

const app = express()

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like curl or Postman)
        if (!origin || allowOrigins.includes(origin)) {
            callback(null, true);
        }else{
            callback(new Error("CORS not allowed from this origin"))
        }
    },
    credentials: true
}))

app.get("/", (req, res) => {
  res.json("Welcome to the server");
});

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("CONNECTED TO DB"))
  .catch((err) => console.log("FAILED CONNECTING TO DB -->", err));

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   logger.error('UNHANDLED REJECTION! Shutting down...', { error: err.message });
//   server.close(() => process.exit(1));
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err.message });
//   process.exit(1);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   logger.info('SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     logger.info('Process terminated.');
//     process.exit(0);
//   });
// });


//routes
// fs.readdirSync('./routes').map((r)=>app.use('/api', require('./routes/'+ r)))
app.use("/api", auth)
app.use("/api", category)
app.use("/api", sub)
app.use("/api", cloudinary)
app.use("/api", coupon)
app.use("/api", product)

//port
const port = process.env.PORT || 8000;

app.listen(port, console.log(`server is running on port ${port}`))
