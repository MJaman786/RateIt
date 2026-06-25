import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        default: null,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false,   // never returned in queries by default
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN', 'SUPER_ADMIN'],
        default: 'USER',
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BANNED'],
        default: 'ACTIVE',
    },
    avatar: {
        type: String,
        default: null,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerifyToken: {
        type: String,
        default: null,
        select: false,
    },
    emailVerifyExpiry: {
        type: Date,
        default: null,
        select: false,
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false,
    },
    resetPasswordExpiry: {
        type: Date,
        default: null,
        select: false,
    },
    refreshToken: {
        type: String,
        default: null,
        select: false,
    },
    lastLogin: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

// Use async middleware and let Mongoose await the promise.
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// compare password helper
userSchema.methods.comparePassword = async function (clientPassword) {
    return bcrypt.compare(clientPassword, this.password);
};

const User = mongoose.model('User', userSchema, 'Users');
export default User;
