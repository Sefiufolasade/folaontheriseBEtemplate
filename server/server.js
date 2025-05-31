const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const fs = require('fs')
const morgan = require ('morgan')
const bodyParser = require ('body-parser')
require('dotenv').config()
// const auth = reqiure("./routes/auth")
// const category = reqiure("./routes/category")
// const cloudinary = reqiure("./routes/cloudinary")
// const coupon = reqiure("./routes/coupon")
// const product = reqiure("./routes/product")
// const sub = reqiure("./routes/Sub")


const app = express()

//db
mongoose.connect(process.env.DATABASE)
.then(() => console.log("DB CONNECTED"))
.catch((err) => console.log("DB CONNECTION ERR:", err))


//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())


//routes
fs.readdirSync('./routes').map((r)=>app.use('/api', require('./routes/'+ r)))
// app.use("/api", auth)
// app.use("/api", category)
// app.use("/api", sub)
// app.use("/api", cloudinary)
// app.use("/api", coupon)
// app.use("/api", product)

//port
const port = process.env.PORT || 8000;

app.listen(port, console.log(`server is running on port ${port}`))