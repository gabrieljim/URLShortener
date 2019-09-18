const mongoose = require('mongoose');
require('dotenv').config();
const autoIncrement = require('mongoose-auto-increment')
mongoose.connect(process.env.URL, { useNewUrlParser: true, useUnifiedTopology:true })
autoIncrement.initialize(mongoose.connection)

const UrlSchema = mongoose.Schema({
	original_url: String,
	short_url: Number
})

UrlSchema.plugin(autoIncrement.plugin, {model: 'Url', field: 'short_url'})

const Url = mongoose.model('Url', UrlSchema);

module.exports = Url
