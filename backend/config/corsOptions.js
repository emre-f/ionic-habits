const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) { // No origin -> Postman etc.
            callback(null, true) // no error, allowed so true
        } else {
            // callback(new Error('Not allowed by CORS'))
            callback(null, true) // For now, allow all origins
        }
    },
    credentials: true, // Allows the access control allow credentials header
    optionsSuccessStatus: 200
}

module.exports = corsOptions