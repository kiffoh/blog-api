const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt'); // Ensure bcrypt is installed via npm
const passport = require('passport');
const jwt = require('jsonwebtoken');

async function logIn (req, res, next) {
    console.log('LOG IN FUNCITON STARTED')
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
          return next(err); // Will generate a 500 error
        }
        if (!user) {
          return res.status(400).json({ message: 'Invalid email or password.' });
        }
    
        // If the user is authenticated successfully, generate a JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, username: user.username, admin: user.admin },
          'secretKey', // Use your secret key here or ideally an environment variable
          { expiresIn: '1h' }
        );
        console.log('Backend token: ',token)
    
        // Send the token to the client
        return res.status(200).json({ token, message: 'Login successful' });
      })(req, res, next);
}

// Sign up
async function createUser (req, res) {
    const {username, email, password, admin} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password before storing
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                admin
            }
        })
        res.status(201).json(newUser)
    } catch (err) {
        res.status(500).json({error: 'An error occurred while trying to create the user.'})
    }
}

// Log in

// Update user
async function updateUser (req, res) {
    const {username, email, password, admin} = req.body;
    const userId = req.user.id;

    try {
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined; // Hash only if password is provided
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: {
                username,
                email,
                password: hashedPassword,
                admin
            }
        })
        res.status(200).json({messsage: 'User updated successfully.', updatedUser})
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(500).json({error: 'An error occurred while trying to update the user.'})
    }
}

// Delete user
// Is it best practice to use the req.user.id as this is the user which will be logged in and passed the authorisation checks,
// or to use the req.params? Or does it not matter?
async function deleteUser (req, res) {
    const userId = req.user.id;
    try {
        const deleteComments = await prisma.comment.deleteMany({
            where: {
                authorId: parseInt(userId)
            }
        })

        const deletePosts = await prisma.post.deleteMany({
            where: {
                authorId: parseInt(userId)
            }
        })

        const deleteUser = await prisma.user.delete({
            where: {
                id: parseInt(userId)
            }
        })
        res.status(200).json({message: 'User successfully deleted.'})
    } catch (err) {
        if (err.code === 'P2025') { // Prisma error code for "Record not found"
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(500).json({error: 'An error occurred while trying to delete the user.'})
    }
}

async function findUser (req, res) {
    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        })
        if (user) {
            res.status(200).json(user); // 200 OK
        } else {
            res.status(404).json({ error: 'User not found.' }); // 404 Not Found
        }
    } catch (err) {
        if (err.code = 'P2025') {
            return res.status(404).json({error: 'User not found.'});
        }
        res.status(500).json({error: 'An error occured while trying to find the user.'})
    }
}

module.exports = {
    logIn,
    createUser,
    updateUser,
    deleteUser,
    findUser
}