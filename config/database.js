const mongoose = require('mongoose')
require('dotenv').config()


mongoose.connect(process.env.DB_URI, 
    {useNewUrlParser: true}
    )
.then(()=>console.log('connect to db success'))
.catch(err=>console.log(err))

