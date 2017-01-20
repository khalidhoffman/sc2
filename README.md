# sc2
A server and web app for managing SoundCloud playlists 

### How to setup
1. `git clone https://github.com/khalidhoffman/sc2.git`
2. `yarn install`
3. Create an `.env.json` in root folder or set environment variables
   - model it after the [config.js](https://github.com/khalidhoffman/sc2/blob/master/config.js) with your DOMAIN, PUBLIC_URL, SOUNDCLOUD_CLIENT_ID, etc.
   - you'll need soundcloud api credentials. 
   - ***forewarning:*** SoundCloud does not allow you to change these settings once created

### How to use
1. `npm start`
 - starts the server
