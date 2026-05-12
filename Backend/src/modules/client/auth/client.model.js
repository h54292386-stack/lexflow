import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
    houseFlatNo: {
        type: String,
        required: true,
        trim: true
    },

    street: {
        type: String,
        required: true,
        trim: true
    },

    city: {
        type: String,
        required: true,
        trim: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

    pinCode: {
        type: String,
        required: true,
        match: [/^[0-9]{6}$/, "Invalid PIN code"]
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
            default: "https://default-profile.png"

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
        ]
    },
    {
        timestamps: true
    }
);

clientSchema.methods.toJSON = function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;

    delete obj.password;
    delete obj.refreshToken;
    delete obj.otp;

    return obj;
};

clientSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  
  this.password = await bcrypt.hash(this.password, 10);
});

const Client = mongoose.model("Client", clientSchema);

export default Client;