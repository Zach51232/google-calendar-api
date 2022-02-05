require('dotenv').config();
const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
    process.env.CLIENT_KEY,
    process.env.CLIENT_PASS
);
oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
})

const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDate());
eventStartTime.setMinutes(eventStartTime.getMinutes()+55)

const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDate());
eventEndTime.setMinutes(eventEndTime.getMinutes()+100)
const event = {
    summary: 'head to the airport',
    description: 'I have to head to the airport sometime today!',
    start: {
        dateTime: eventStartTime,
        timeZone: 'America/New_York'
    },
    end: {
        dateTime: eventEndTime,
        timeZone: 'America/New_York'
    },
    colorId: 1
}

calendar.freebusy.query({
    resource: {
        timeMin: eventStartTime,
        timeMax: eventEndTime,
        timeZone: 'America/New_York',
        items: [{id: 'primary'}]
    },
}, 
(err,res) => {
    if(err) return console.error('Freebusy Query Error: '+err);
    //can for loop over all calendars so primary, et in calendars array.
    const eventsArray = res.data.calendars.primary.busy;

    if(eventsArray.length === 0) return calendar.events.insert({
        calendarId: 'primary', resource: event}, 
        err=> {
            if(err) return console.error('Calendar Event Creation Error: '+err);
            return console.log('Calendar Event Created.');
        })
        return console.log(`Sorry I'm Busy`);
})