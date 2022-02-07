const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModels');

dotenv.config({ path: './../../config.env' });
//console.log(process.env.DATABASE);
/* const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
); */
mongoose
  .connect(
    'mongodb+srv://Pranita:ihqY9flO7FbLXha0@cluster0.hzfy2.mongodb.net/natours?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then((con) => console.log('DB connection successful'));

//Read Json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete ALl data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Successfully deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
//CMD to Run in console: node path/.js --import/--delete
console.log(process.argv);
