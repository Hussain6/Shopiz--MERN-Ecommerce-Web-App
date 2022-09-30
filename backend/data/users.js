import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'a@a.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
    },
    {
        name: 'b User',
        email: 'b@b.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'c User',
        email: 'c@c.com',
        password: bcrypt.hashSync('123456', 10),
    }
]

export default users