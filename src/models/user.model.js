import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        index: true
    },
    avatar: {
        type: String, // cloudinary url
        required: true
    },
    coverimage: {
        type: string,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is Required']
    },
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    jwt.sign({
        id: this.id,
        email: this.en = mail,
        username: this.username,
        fullName: this.fullName
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    jwt.sign({
        id: this.id,
    },
        process.env.Refresh_TOKEN_SECRET,
        {
            expiresIn: process.env.Refresh_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)