const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser } = require("../service/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/noavatar.png",
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    next();
});

//virtual function
userSchema.static("matchPassword",async function(email,password){
  const user = await this.findOne({email});
  if(!user)  throw new Error("User not found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const hashedInputPassword = createHmac("sha256",salt).update(password).digest("hex");
  if(hashedPassword !== hashedInputPassword) throw new Error("Password does not match");

  const token = createTokenForUser(user);
  return token;

})

const User = new Model("user", userSchema);

module.exports = User;
