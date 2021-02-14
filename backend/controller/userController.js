import crypto from 'crypto'
import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../model/userModel.js'
import { ErrorResponse } from '../utils/errorResponse.js'
import { sendEmail } from '../utils/sendEmail.js'

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ErrorResponse('Please provide email and password', 400)
  }

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    throw new ErrorResponse('Invalid credentials', 401)
  }
})

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    throw new ErrorResponse('User already exists', 400)
  }

  const user = await User.create({
    username,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    throw new ErrorResponse('Invalid user data', 400)
  }
})

// @desc    Post forget password
// @route   POST /api/users/forgetpassword
// @access  Public
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  try {
    const user = await User.findOne({ email })

    if (!user) {
      throw new ErrorResponse('Email could not be sent', 404)
    }

    const resetToken = user.getResetPasswordToken()

    await user.save()

    const resetUrl = `http://localhost:5000/api/v1/users/passwordreset/${resetToken}`

    const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password</p>
    <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      })

      res.status(200).json({ success: true, data: 'Email Sent' })
    } catch (error) {
      user.getResetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      throw new ErrorResponse('Email could not be sent', 500)
    }
  } catch (error) {
    throw new ErrorResponse(error.message, 500)
  }
})

// @desc    Put reset password
// @route   PUT /api/users/resetpassword/:resetToken
// @access  Public

const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex')

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      throw new ErrorResponse('Invalid reset token', 400)
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    return res.status(201).json({
      success: true,
      data: 'Password reset success',
    })
  } catch (error) {
    throw new ErrorResponse(error.message, 500)
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    throw new ErrorResponse('User not found', 404)
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    throw new ErrorResponse('User not found', 404)
  }
})

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    return next(new ErrorResponse('User not found', 404))
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    return next(new ErrorResponse('User not found', 404))
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    return next(new ErrorResponse('User not found', 404))
  }
})

export {
  authUser,
  registerUser,
  forgetPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
}
