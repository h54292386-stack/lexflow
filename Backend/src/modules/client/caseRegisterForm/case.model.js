import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true
        },

        personalData: {
            fullName: {
                type: String,
                required: true,
                trim: true
            },
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
                validate: {
                    validator: function (v) {
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                    },
                    message: "Invalid email format"
                }
            },
            phone: {
                type: String,
                trim: true,
                match: [/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Invalid Indian phone number"]
            },
            idProof: {
                type: {
                    type: String,
                    enum: ["aadhaar", "passport", "driving_license", "voter_id"],
                    lowercase: true,
                    trim: true
                },
                number: {
                    type: String,
                    trim: true
                },
                publicId: {
                    type: String // for delete/update
                },

            },
        },

        caseDetails: {
            caseName: {
                type: String,
                trim: true
            },

            caseType: {
                type: String,
                enum: ["criminal", "civil", "specialized", "constitutional", "adr"],
            },

            incidentDate: {
                type: Date,
                validate: {
                    validator: function (value) {
                        return !value || value <= new Date();
                    },
                    message: "Incident date cannot be in the future"
                }
            },

            description: {
                type: String,
                minlength: 20
            },

            urgencyLevel: {
                type: String,
                enum: ["low", "medium", "high"],
                default: "medium"
            },

            opponent: {
                name: String,
                relation: String,
                contact: String
            },

            incidentLocation: {
                city: String,
                state: String,
                country: String
            },


        },

        documents: {
            type: [
                {
                    documentName: {
                        type: String,
                        trim: true
                    },
                    documentType: {
                        type: String,
                        enum: ["evidence", "legal_notice", "agreement", "other"],
                        default: "other"
                    },
                    fileUrl: {
                        type: String,
                        required: true
                    },
                    publicId: {
                        type: String,
                        required: true
                    },
                    uploadedAt: {
                        type: Date,
                        default: Date.now
                    }
                }
            ],
            default: []
        },

        shareWithLawyer: Boolean,

        status: {
            type: String,
            enum: [
                "draft",
                "submitted",
                "requested",
                "proposal_received",
                "proposal_selected",
                "pending_admin_fee",
                "assigned",
                "in_progress",
                "completed",
                "closed"
            ],
            default: "draft"
        },

        stepCompleted: {
            type: Number,
            default: 1
        },

        isDraft: {
            type: Boolean,
            default: true
        },

        assignedLawyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lawyer"
        },
        selectedProposal: {
            requestId: {
                type: mongoose.Schema.Types.ObjectId
            },

            lawyerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lawyer"
            },

            professionalFee: Number,

            estimatedDuration: String,

            notes: String,

            selectedAt: Date
        },
        requestedLawyers: [
            {
                lawyerId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Lawyer"
                },
                status: {
                    type: String,
                    enum: [
                        "new",
                        "interested",
                        "accepted",
                        "declined",
                        "selected"
                    ],
                    default: "new"
                },
                proposal: {
                    professionalFee: Number,

                    estimatedDuration: String,

                    notes: String,
                    status: {
                        type: String,
                        enum: [
                            "pending",
                            "selected",
                            "rejected"
                        ],
                        default: "pending"
                    },


                    proposedAt: Date
                },
                requestedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        adminFee: {
            amount: {
                type: Number,
                default: 499
            },

            paid: {
                type: Boolean,
                default: false
            },

            paymentId: String,

            paidAt: Date
        },



        professionalPayment: {
            amount: Number,

            commissionPercent: {
                type: Number,
                default: 10
            },

            commissionAmount: Number,

            lawyerAmount: Number,

            status: {
                type: String,
                enum: [
                    "pending",
                    "success",
                    "failed",
                    "refunded"
                ],
                default: "pending"
            },

            paid: {
                type: Boolean,
                default: false
            },

            paymentId: String,

            paidAt: Date
        },

        // requestStatus: {
        //     type: String,
        //     enum: ["none", "pending", "accepted", "rejected"],
        //     default: "none"
        // },

        timeline: [
            {
                action: {
                    type: String,
                    enum: [
                        "created",
                        "personal_updated",
                        "case_updated",
                        "submitted",
                        "requested",
                        "accepted",
                        "declined",
                        "proposal_received",
                        "proposal_selected",
                        "admin_fee_paid",
                        "assigned",
                        "professional_fee_paid",
                        "payment_completed",
                        "closed"
                    ]
                }, date: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

caseSchema.index({ clientId: 1, createdAt: -1 });
caseSchema.index({ assignedLawyer: 1, status: 1 });
caseSchema.index({
    "selectedProposal.lawyerId": 1
});
caseSchema.index({
    "requestedLawyers.lawyerId": 1
});
const Case = mongoose.model("Case", caseSchema);
export default Case;