module.exports = {
  db: {
      production: "mongodb://"+process.env.MONGODB_ADDRESS+":27017/tickets",
      development: "mongodb://"+process.env.MONGODB_ADDRESS+":27017/tickets",
  }
};
