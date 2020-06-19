module.exports = {
  apps : [{
    name: 'SmartFame',
    script: `./bin/www.js`,
    error_file: './.pm2/err.log',
    out_file: './.pm2/out.log',
    log_file: './.pm2/combined.log',
    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1, //'max'
    autorestart: true,
    restart_delay: 1,
    watch: false,
    ignore_watch: ['./views', '/views', 'views'],
    vizion: true,
    max_memory_restart: '2G',
    env: {

    },
    env_dev: {
      NODE_ENV: 'dev',
      DEBUG: 'debug:*',
      DEBUG_FD: 1
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: 'debug:*',
      DEBUG_FD: 1
    },
    env_staging: {
      NODE_ENV: 'staging',
      DEBUG: 'debug:*',
      DEBUG_FD: 1
    }
  }],

  // pm2 deploy production
  deploy: {
    production: {
      user: "root",
      host: "smartfarm.tinasoft.com.vn",
      ref: "origin/master",
      repo: "git@gitlab.tinasoft.com.vn:hocptit/smartfarm.git",
      path: "/home/SmartFarm/smartfarm", // __dirname
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env=production"
      // 'pre-deploy': 'git fetch --all',
      // 'post-deploy' : 'npm install -d && npm run build:staging && pm2 reload ecosystem.config.js --env staging',
      // 'post-setup' : 'npm install -d && npm run build:staging && pm2 reload ecosystem.config.js --env staging',
      //       // "ssh_options": [
      //       //   "StrictHostKeyChecking=no",
      //       //   "PasswordAuthentication=no"
      //       // ]

    }
  }
};
