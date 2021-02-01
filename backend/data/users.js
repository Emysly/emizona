import bcrypt from 'bcryptjs'

const users = [
  {
    username: 'Admin User',
    email: 'admin@emizona.com',
    password: bcrypt.hashSync('123456', 20),
    isAdmin: true,
  },
  {
    username: 'John Doe',
    email: 'john@emizona.com',
    password: bcrypt.hashSync('123456', 20),
  },
  {
    username: 'Jane Doe',
    email: 'jane@emizona.com',
    password: bcrypt.hashSync('123456', 20),
  },
]

export default users
