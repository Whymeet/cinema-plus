const cinemaRouter = require('./routes/cinema');
const placeRouter = require('./routes/place');

app.use(cinemaRouter);
app.use(placeRouter); 