import { checkSchema } from "express-validator";
import db from "../../Database/DB_Connect.mjs";


const Validate_Login = checkSchema({
    email: {
        isEmail:{
            errorMessage: "Must be an Email"
        },
        notEmpty:{
            errorMessage: "Email must not be empty."
        },
        trim: true,
    },
    password: {
        isLength: {
          options: { min: 6 },
          errorMessage: "Password must be at least 6 characters",
        },
        notEmpty: {
          errorMessage: "Password must not be empty",
        },
        trim: true,
      },
}) 

const Validate_Register = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Must be an Email",
    },
    notEmpty: {
      errorMessage: "Email must not be empty.",
    },
    trim: true,
    custom: {
      options: async (value) => {
        const existing = await db.query("SELECT * FROM users WHERE email = $1", [value]);
        if (existing.rows.length > 0) {
          const user = existing.rows[0];
          if (user.is_verified === true) {
            throw new Error("Email is already used");
          }
        }
        return true;
      },
    },
  },
    password: {
        isLength: {
          options: { min: 6 },
          errorMessage: "Password must be at least 6 characters",
        },
        notEmpty: {
          errorMessage: "Password must not be empty",
        },
        trim: true,
      },
      confirmPassword: {
        notEmpty: {
          errorMessage: "Confirm password must not be empty",
        },
        custom: {
          options: (value, { req }) => value === req.body.password,
          errorMessage: "Passwords do not match",
        },
        trim: true,
      },
}) 

const Validate_Code = checkSchema({
  email: {
    isEmail:{
        errorMessage: "Must be an Email"
    },
    notEmpty:{
        errorMessage: "Email must not be empty."
    },
    trim: true,
},
  code: {
    isLength: {
      options: { min: 6, max: 6 },
      errorMessage: "Code must be 6 characters long",
    },
    custom: {
      options: async (value, { req }) => {
        const checkUser = await db.query(
          `SELECT verification_code, code_expires_at FROM users WHERE email = $1`,
          [req.body.email]
        );
        const validateCode = checkUser.rows[0];
        if (!validateCode ) {
          throw new Error("No user found");
        }

        if (validateCode.verification_code !== value) {
          throw new Error("Invalid Code");
        }
        
        const now = new Date();
        if (validateCode.code_expires_at && now > validateCode.code_expires_at) {
          throw new Error("Code has expired");
        }

        return true;
      }
    }
  }
});


export {Validate_Login, Validate_Register, Validate_Code}