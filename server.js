const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');

//Environment Variable
// console.log(app.get('env')); //Set by Express
//console.log(process.env);//Set by Nodejs
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`App running at ${port}`);
});