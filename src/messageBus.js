var events = require("events"),
  EventEmitter = require("events").EventEmitter,
  ee = new EventEmitter();

/*var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: process.env.SES_KEY || 'foo',
    secretAccessKey: process.env.SES_SECRET 'bar',
    region: 'eu-west-1',
    rateLimit: 1
}));

ee.on("newUser", function(user) {
  transporter.sendMail({
      from: 'andy.grant@laterooms.com',
      to: user.email,
      subject: 'Welcome to LonelyDevs',
      text: 'hello world!'
  });
});*/
 
module.exports = ee;
