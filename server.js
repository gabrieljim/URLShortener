'use strict';

var express = require('express');
var mongoose = require('mongoose');
const dotenv = require('dotenv');
const Url = require('./Url');
const dns = require('dns');
dotenv.config();

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.URL, {useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false})

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(express.urlencoded({extended: true}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post("/api/shorturl/new", function (req, res) {
	let origUrl = req.body.url;
	let regex = /http(s)?:\/\/[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm

	if (!origUrl.match(regex)) {
		return res.status(400).json({error: 'invalid URL (add https://)'})
	}

	// First of all check if the given url exists
	dns.lookup(origUrl.replace(/https?:\/\//,''), (err,address) => {
		if (!address) {
			res.status(400).json({error: 'invalid URL'})
		}
		else {
			// Check if the sent url already exists
			Url.findOne({original_url: origUrl}, (err, doc) => {
				if (doc != null){
					res.status(400).json({
						error: "Hostname exists on database",
						existing_shortened_url: doc.short_url
					})
				} else {
					Url.countDocuments({}, (err, count) => {
						let newUrl = new Url({
							original_url: origUrl,
						});
						newUrl.save( (err) => {
							if (err) {
								console.error(err)
							}
							else {
								res.status(200).json(newUrl)
							}
						})
					})
				}
			})
		}
	})
});

app.get('/api/shorturl/:id', (req, res,) =>  {
	Url.findOne({short_url: req.params.id}, (err, doc) => {
		if (doc) {
			res.status(301).redirect(doc.original_url)
		}
		else {
			res.json({
				error: "Entry doesn't exist on database"
			})
		}
	})
})

app.listen(port, function () {
  console.log('Node.js listening on port' + port);
});
