const fs = require('fs');
const express = require('express');

const app = express();

//Middleware: Modify incoming data
app.use(express.json());
/* app.get('/', (req,res)=>{
    res
        .status(200)
        .json({message: 'hello',
                app: 'Natours'});
})

app.post('/', (req, res)=>{
    res.send('you can post ');
}) */

//read Json data from file 
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Get Request
app.get('/api/v1/tours', (req, res)=>{
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    })
});

//Post Request
app.post('/api/v1/tours', (req,res) => {
    //console.log(req.body);
    
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tours: newTour
            }
        })
    })

    //res.end('Done'); //always need to send response to complete req res cycle

});

const port = 3000;
app.listen(port, () =>{
    console.log(`App running at ${port}`);
});

