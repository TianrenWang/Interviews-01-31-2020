import express from 'express';
import moment from 'moment';
import { DailyImage } from './nasa/daily-image';

const app = express();
app.use(express.json());
const port = 8002; // default port to listen

// define a route handler for the default home page
app.get( '/', async ( request: any, response: any ) => {
    response.send({});
} );

// Handle get requests to /nasa
app.get( '/daily', async ( request: any, response: any ) => {
    const daily = new DailyImage();
    // Sends in today's date as a formatted string
    const result = await daily.getImageForDate(moment().format('YYYY-MM-DD'));
    // Sends back the result of the image getter
    response.send(result);
} );

// Handle get requests to /nasa with dates parameters
app.get( '/dates', async ( request: any, response: any ) => {

    //Get the requested dates in chronological order
    var dates = request.query.dates;
    dates = dates.substring(1, dates.length-1);
    var dates_list = dates.split(',');
    dates_list.sort();
    dates_list = dates_list.reverse();

    // Loop through every date and get the results for each date
    var results = [];

    for (let i = 0; i < dates_list.length; i++) {
        const daily = new DailyImage();
        const result = await daily.getImageForDate(dates_list[i]);
        results.push(result)
    }

    // Sends back the result of the image getter
    response.send({timeline: results});
} );

// start the Express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );
