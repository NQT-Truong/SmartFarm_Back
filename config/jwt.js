module.exports = {
  "secret": process.env.jwt_secret|| "my_farm_nhung_secret_key_adevrrvvevwveege",
  "tokenLife": "365d",
  "recover_pw_secret": process.env.jwt_recover_pw_secret || "1zunds5avbbl",
  "recoverPwTokenLife": "2h"
};