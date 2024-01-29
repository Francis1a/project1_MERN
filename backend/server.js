const express = require('express')
const workoutRoutes = require('./routes/workouts')
const { default: mongoose } = require('mongoose')
const userRoutes = require('./routes/user')


//express app
const app = express()

//middleware or check if api routes no error
app.use(express.json())

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})
// END middleware

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/user', userRoutes)

//connect to mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(()=>{      
      //listen for requests
      app.listen(process.env.PORT,()=> {
        console.log('Connected to db and Listening to port', process.env.PORT);
      })
  })
  .catch((error)=> {
    console.log(error)
  })

