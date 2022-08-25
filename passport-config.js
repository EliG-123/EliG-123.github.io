const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/account');


function initialize (passport, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await User.findOne({ username: username })
        console.log(user)
        if (user == null) {
            return done(null, false, {message: 'Incorrect Username or Password'})
        }
        try {
           if ( await bcrypt.compare(password, user.password) ) {
            return done(null, user)
           } else {
            return done(null, false, {message: 'Incorrect Username or Password'})
           }
        } catch (e) {
            return done(e)
        }

    }

    passport.use(new localStrategy({
        usernameField:'username'
    }, authenticateUser) )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}


module.exports = initialize


/// Before I break the function, this is the one that worked
// function initialize (passport, getUserById) {
//     const authenticateUser = async (username, password, done) => {
//         const user = await User.findOne({ username: username })
//        console.log(user)
//         if (user == null) {
//             return done(null, false, {message: 'Incorrect Username or Password'})
//         }
//         try {
//            if ( await bcrypt.compare(password, user.password) ) {
//             return done(null, user)
//            } else {
//             return done(null, false, {message: 'Incorrect Username or Password'})
//            }
//         } catch (e) {
//             return done(e)
//         }

//     }

//     passport.use(new localStrategy({
//         usernameField:'username'
//     }, authenticateUser) )

//     passport.serializeUser((user, done) => {done(null, user.id)})
    
//     passport.deserializeUser((id, done) => {
//         return done(null, getUserById(id))
//     })
// }
