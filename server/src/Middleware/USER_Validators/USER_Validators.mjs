import { checkSchema } from "express-validator";


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

export {Validate_Login, Validate_Register}