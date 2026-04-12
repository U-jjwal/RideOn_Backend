import mongoose from "mongoose";

const captainSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
    select: false, //password will not be returned by default when querying the user
  },
  socketId: {
    type: String,
  },
  status:{
    type: String,
    enum: [ 'active', 'inactive'],
    default: 'inactive'
  },

  vehicle: {
    color : {
        type: String,
        required: true,
        minlength: [3, "Vehicle color must be at least 3 characters long"],
    },
    plate: {
        type: String,
        required: true,
        minlength: [3, "vehicle plate must be at least 3 charachters long"],
    },
    capacity: {
        type: Number,
        required: true,
        min: [1, "capacity must be at least 1"],
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ['car', 'motorcycle', 'auto']
    }
  },

  location : {
    lat: {
        type: Number,
    },
    lng : {
        type: Number,
    }
  }
});

export const Captain = mongoose.model("Captain", captainSchema)
