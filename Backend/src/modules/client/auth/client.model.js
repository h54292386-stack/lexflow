import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
    houseFlatNo: {
        type: String,
        trim: true
    },

    street: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        trim: true
    },

    state: {
        type: String,
        trim: true
    },

    pinCode: {
        type: String,
        match: [/^[0-9]{6}$/, "Invalid PIN code"]
    },

    country: {
        type: String,
        trim: true
    }

});

const clientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "Invalid email format"
            }

        },

        password: {
            type: String,
            select: false,
            required: function () {
                return this.provider === "local";
            },
            minlength: 9,
            match: [
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).{9,}$/,
                "Password must contain letter, number and special character"
            ]
        },

        role: {
            type: String,
            default: "client",
            enum: ["client"]
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },

        googleId: {
            type: String,
            index: true,
            sparse: true
        },

        profileImage: {
            type: String,
            default: "https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg"

        },

        otp: {
            type: String,
            select: false

        },

        otpExpires: {
            type: Date
        },

        isVerified: {
            type: Boolean,
            default: false
        },
        otpLastSentAt: {
            type: Date
        },
        otpBlockedUntil: {
            type: Date
        },

        otpRequestCount: {
            type: Number,
            default: 0
        },
        otpAttempts: {
            type: Number,
            default: 0
        },

        refreshToken: {
            type: String,
            select: false

        },

        dateOfBirth: {
            type: Date
        },

        phone: {
            type: String,
            trim: true,
            match: [/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Invalid Indian phone number"]
        },

        alternatePhone: {
            type: String,
            trim: true,
            match: [/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Invalid Indian phone number"]
        },

        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },

        address: addressSchema,

        isActive: {
            type: Boolean,
            default: true
        },

        cases: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Case"
            }
        ],

        documents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Document"
            }
        ],

        profileCompleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

clientSchema.methods.toJSON = function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    delete obj.__v;


    delete obj.password;
    delete obj.refreshToken;
    delete obj.googleId;
    delete obj.otp;

    delete obj.otpAttempts;
    delete obj.otpRequestCount;
    delete obj.otpLastSentAt;
    delete obj.otpBlockedUntil;

    return obj;
};

clientSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

const Client = mongoose.model("Client", clientSchema);

export default Client;