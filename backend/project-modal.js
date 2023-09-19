const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    pname: { type: String, required: true },
    githublink: { type: String, required: true },
    deploylink: { type: String, required: true },
    zindex: { type: Number, required: true },
});

module.exports = mongoose.model('Project', projectSchema, 'projects'); 