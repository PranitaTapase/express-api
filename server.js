/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(con => console.log("DB connection successful"));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});

//Creating Model
const Tour = mongoose.model('Tour', tourSchema);
//Creating Document
const testTour = new Tour({
  name:'The Forest Hiker',
  rating: 4.7,
  price: 497
});
testTour.save().then();


const app = require('./app');
//Environment Variable
// console.log(app.get('env')); //Set by Express
//console.log(process.env);//Set by Nodejs
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running at ${port}`);
});