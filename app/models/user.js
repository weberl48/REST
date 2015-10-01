// grab packages needed for model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user Schema
var UserSchema = new Schema({
  name: String,
  // setting the index and unique attributes, we are tellingMongoose to create a unique index for this path. This means that a username can not be duplicated.
  username: { type: String, required: true, index: {unique: true}},
  // select: false on the password attribute.When we query the list of users or a single user, there will be no need to provide the password.
  password: {type: String, required:true, select:false}
});

//hash password before the user is saved
// creating a function using pre that will ensure that the password is hashed before wesave the user.
UserSchema.pre('save', function(next){
  var user = this;

  // hash password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  //generate the hash
  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) return next(err);
    //change the password to the hashed version
    user.password = hash
    next();
  })
});
// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this //UserSchema object
  return bcrypt.compareSync(password, user.password);


};

// return the model
module.exports = mongoose.model("User", UserSchema);
