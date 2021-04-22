# Serve (project-4)
> A web app aiming to help aliviate food waste.

## Product Vision
FOR large to small businesses operating as either restaurants, food vendors, supermarkets, or convenience shops, with a regular excess of foodstuffs, and produce, which often goes to waste, WHO are looking for a system to donate their excess foodstuffs, THAT integrates seamlessly into their already existing methods of food distribution, and delivery. UNLIKE other food donation platforms, OUR product integrates seamlessly with the business’ already existing methods of food delivery and distribution, making sure that the business owners and workers won’t have to take any extra steps, or spend any money and resources unnecessarily, but instead focus on conducting their business as usual.

## Important Qualities To Consider
#### Number of Users
We expect to have a number of users that use this app daily to find locations offering food at discounted prices. Our app should have scalable technology in order to prevent a downgrade in performance.
#### Software compatibility
Our app should be designed in a way that mobile users and destop users should be comfortable using. We also need to make the app easily integratable with businesses' existing methods of food delivery and distribution.
#### Security (Nonfunctional product characteristics)
Users and businesses should feel secure while browsing and ordering through our app. Sensitive information, such as credit card info and passwords, must be encrypted.

## Technologies
Front-end: 
- Reactjs for UI
- Redux for state management
- React Router library for browser routing
- Axios library implemented into Redux action creators to make calls to the backend api
- Socket.io client-side api for real-time communication with the backend

Backend:
- Node, ExpressJs server
- Redis session storage to manage user sessions
- Socket.io server-side api for real-time communication with the frontend
- PassportJs, JWT, Twilio programmable SMS, and Email, bcrypt, apis, and libraries for authentication

Database: 
- MongoDB Atlas for a NoSQL database.

## Product Architecture
<img src="https://github.com/CSCI-40500-77100-Spring-2021/project-4/blob/master/readme-images/Holistic%20Architectural%20Model%20of%20Serve.png" width="600px">

## Usage
The current release is a rough interpretation of what type of business partners/users the app will be allowing, and what sort of information will be required to authenticate these users

To view this release:
* Locate the 'my-app' directory in the project folder.
* cd into the 'my-app' directory
* run `npm install` or `yarn-install` to install the required project dependencies
* After the installation is complete, in the my-app directory, run `yarn start` command to run the project in localhost.
* A browswer window should be open with the prototype rendered. Click on the tabs to view the popup messages.

## Docker
The current Docker image is simply a starting point of the frontend implementation. More to follow.

##### Frontend:
```
docker pull rickyricky14/project-4-frontend
sudo docker run -p 8080:80 rickyricky14/project-4-frontend
# Run the port provided (Ex. http://172.17.0.2:3000)
```
### Backend:
```
docker pull serveappproj4dev/project4-backend
docker run serveappproj4dev/project4-backend 
```
the above will start a full nodejs, expressjs, redis server, using redis for session management, and a mongodb image for to connect via mongoose
