### SELF SERVICE REPORT SYSTEM - FRONT END
----------

# Installation

 - Clone this project
 - Install module dependencies by run this script in terminal
    `npm install`
 - After finish downloading, then build Build Webpack DLL dependencies(If necessary).
	 `npm run build:dll`
 - Finally run the app.
	 `npm start`
 - Navigate to  [http://localhost:3001](http://localhost:3001)

# Deployment

 - First you need to build the production assets first
    `npm run build`
 - Then start the app
    `npm run start:prod`
 - If you want run it in background you may try PM2 [https://www.npmjs.com/package/pm2]( https://www.npmjs.com/package/pm2) Then run this command:
    `node node_modules/.bin/cross-env NODE_ENV=production pm2 start server`
 - Navigate to  [http://localhost:3001](http://localhost:3001)



 
