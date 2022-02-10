const express = require('express');
const bodyParser = require('body-parser');
const moogoose = require('mongoose');

const eventsRoutes = require('./routes/events-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/events', eventsRoutes);

app.use('/api/users', usersRoutes);

app.use(() => { 
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {    // execute if middlewares before it yield an error
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({message: error.message || 'Unknown error occurred'});
}); 

moogoose
.connect('mongodb+srv://kirint:Ginathlamhi@cluster0.aqsbu.mongodb.net/moonlight?retryWrites=true&w=majority')
.then(() => {
  app.listen(5000);
})
.catch(error => console.log(error) );
