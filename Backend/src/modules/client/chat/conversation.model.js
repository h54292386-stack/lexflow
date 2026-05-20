import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userType",
    },

    userType: {
      type: String,
      required: true,
      enum: ["Client", "Lawyer"],
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    conversationKey: {
  type: String,
  unique: true,
},
    participants: {
      type: [participantSchema],
      default: [],
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    unreadCount: {
      client: {
        type: Number,
        default: 0,
      },

      lawyer: {
        type: Number,
        default: 0,
      },
    }
  },
  { timestamps: true }
);

const Conversation = mongoose.model(
  "Conversation",
  conversationSchema
);

export default Conversation;