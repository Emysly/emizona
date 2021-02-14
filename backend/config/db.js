import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    })
    console.log(`Mongodb connected on ${conn.connection.host}`)
  } catch (error) {
    console.log(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
