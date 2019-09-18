const mongoose = require('mongoose');
const UrlSchema = mongoose.Schema({
	original_url: String,
	short_url: Number
})

const Url = mongoose.model('Url', UrlSchema);

module.exports = Url
