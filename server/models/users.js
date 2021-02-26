const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate')

let userSchema = new Schema({
  googleId: String,
  name: String,
  watchlist: [String]
});

// userSchema.plugin(PassportLocalMongoose);
userSchema.plugin(findOrCreate);

var User = mongoose.model('User', userSchema);

module.exports = User;
