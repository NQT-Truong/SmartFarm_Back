const ip = require('ip');

module.exports = {
  "hostname": ip.address(),
  "domain": "smartfarm.tinasoft.com.vn",
  "port": process.env.port || "8001"
};