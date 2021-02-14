import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import cryto from 'crypto'

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      reqired: [true, 'Please provide a username'],
    },
    email: {
      type: String,
      reqired: [true, 'Please provide a email'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      reqired: [true, 'Please add a password'],
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      require: true,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = cryto.randomBytes(20).toString('hex')

  this.resetPasswordToken = cryto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000)

  return resetToken
}

const User = mongoose.model('User', userSchema)

export default User
