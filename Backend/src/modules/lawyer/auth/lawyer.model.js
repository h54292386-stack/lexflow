import mongoose from "mongoose";

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

    state: {
        type: String,
        required: true,
        trim: true
    },

    pinCode: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    },

});

const officeAddressSchema = new mongoose.Schema({
    officeName: {
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
    
    state: {
        type: String,
        required: true,
        trim: true
    },

    pinCode: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true,
        trim: true
    }
});

const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true,
        trim: true
    },

    fieldOfStudy: {
        type: String,
        trim: true   // e.g., Law, Criminal Law, Corporate Law
    },

    university: {
        type: String,
        required: true,
        trim: true
    },

    startYear: {
        type: Number,
        min: 1950,
        max: new Date().getFullYear()
    },

    endYear: {
        type: Number,
        validate: {
            validator: function (value) {
                return !this.startYear || value >= this.startYear;
            },
            message: "End year must be greater than start year"
        }
    },

    grade: {
        type: String,  //  CGPA / percentage
        trim: true
    },

    certificate: {
        type: String   // URL (uploaded document proof)
    }
});

const documentsSchema = new mongoose.Schema({
    barCertificate: {
        type: String,   // URL of uploaded file (Cloudinary, S3, etc.)
        required: true
    },

    enrollmentCertificate: {
        type: String,
        required: true
    },

    idProof: {
        type: String,
        required: true
    },

    additionalDocuments: [
        {
            type: String   // optional extra files
        }
    ]
}, { _id: false });

const lawyerSchema = new mongoose.Schema(
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

        barCouncilNumber: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },

        role: {
            type: String,
            default: "lawyer",
            enum: ["lawyer"]
        },

        profileImage: {
            type: String
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

        googleId: {
            type: String,
            index: true,
            sparse: true
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        isApproved: {
            type: Boolean,
            default: false
        },

        verificationStatus: {
            type: String,
            enum: ["pending", "submitted", "approved", "rejected"],
            default: "pending"
        },
        profileCompleted: {
            type: Boolean,
            default: false
        },

        documents: {
            type: documentsSchema,
            required: false
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

        dateOfBirth: {
            type: Date
        },


        address: addressSchema,

        specialization: [
            {
                type: String
            }
        ],


        officeAddress: officeAddressSchema,

        education: [educationSchema],

        experience: {
            type: Number
        },


        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        totalReviews: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

lawyerSchema.methods.toJSON = function () {
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

const Lawyer = mongoose.model("Lawyer", lawyerSchema);

export default Lawyer;