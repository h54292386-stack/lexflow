import mongoose from "mongoose";

const adminSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
              v
            );
          },

          message:
            "Invalid email format",
        },
      },

      password: {
        type: String,
        required: true,
        select: false,
        minlength: 6,
      },

      role: {
        type: String,
        default: "admin",
        enum: ["admin"],
      },

      isActive: {
        type: Boolean,
        default: true
      },

      refreshToken: {
        type: String,
        select: false,
      },
    },
    {
      timestamps: true,
    }
  );

adminSchema.methods.toJSON =
  function () {

    const obj =
      this.toObject();

    obj.id = obj._id;

    delete obj._id;
    delete obj.__v;

    delete obj.password;
    delete obj.refreshToken;

    return obj;
  };

const Admin = mongoose.model(
  "Admin",
  adminSchema
);

export default Admin;