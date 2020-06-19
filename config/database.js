const setting = {
    "user": process.env.database_user || "mongo",
    "host": process.env.database_host|| "mongodb://localhost/farm",
    "password": process.env.databse_password ||"",
    "database": "farm",
    "port": 1234,
    "url": "mongodb://localhost/farm",
};
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};
module.exports = {
    setting,
    options
};
