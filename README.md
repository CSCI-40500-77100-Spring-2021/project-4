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

**Frontend**:
```
docker pull rickyricky14/project-4-frontend
sudo docker run -p 8080:80 rickyricky14/project-4-frontend
# Run the port provided (Ex. http://172.17.0.2:3000)
```
**Backend**:
```
docker pull serveappproj4dev/project4-backend
docker run serveappproj4dev/project4-backend 
```
the above will start a full nodejs, expressjs, redis server, using redis for session management, and a mongodb image for to connect via mongoose


## Microservices
#### OTP Email Microservice

![email_microservice](https://user-images.githubusercontent.com/29417661/118018954-6cc65b00-b326-11eb-855a-c8c7225c3bd6.png)

* The microservice implemented is a smaller component of our greater monolithic backend server. The self-contained service's solre responsibility is to email a one time password (OTP) to the given user email, which will then be used in the greater task of authenticating the user (specifically the Two-Factor Authentication portion). The service can be accessed publically via three ways; one, in usage of the web app while the user is attempting to login or signup, the service will be called via the REST API to send the user a OTP which'll be used for TFA. Two, via the PWA, which is similar in usage to the web app. Three, via curl, or postman, or similar API testing platforms to postman.

* **Instructions on testing (with CURL):**
```
 curl --header "Content-Type: application/json" \
 --request POST --data '{"to":"[RECEIVER'S EMAIL]","name":"[RECEIVER'S NAME]","expr": [INTEGER for time in minutes]}' \
 https://safe-journey-69480.herokuapp.com/api/email/send-email
```
> **Example:**
```
curl --header "Content-Type: application/json" \
 --request POST --data '{"to":"williamd8323@afsenyc.org","name":"William","expr": 10}' \
 https://safe-journey-69480.herokuapp.com/api/email/send-email
```
Where `[RECEIVER'S EMAIL]`, `[RECEIVER'S NAME]`, and `[INTEGER for time in minutes]` represent the email recepient's email, name, and number of minutes the OTP remains valid, respectively.
A successful request will return a json response of `{success: true, msg: "An email has been sent to [RECEIVER'S EMAIL]"}`, where `RECEIVER'S EMAIL` again is the email provided in the request body, and the recepient would receive an email with the OTP from `appserveproject@gmail.com` the temporary project email.
If another request is made before the previous OTP expires, a json response is returned indicating that an email has already been sent within `[INTEGER for time in minutes]` duration.
If any of the fields aren't provided in the request body, a json response is returned indicating to do so.
The request may take up to a few minutes due to cold starts

**Data consistency:**

The service uses the individual user session store implemented with redis, but when accessed from the web app or PWA, in addition to the session store, a single Mongodb database is used to store all the currently unexpired user OTP, to keep track of the emailed 2FA codes even when the user session is terminated. Write access to this Mongodb database is limited to the emailing service, but, however, the greater monolithic server also has read access.

**Microservice characteristics:**

This service is self-contained; it runs on its own http server, it's been built from a docker image, containerised using docker, and deployed onto heroku as a containerised app. This service is light-weight, as its only responsibility is to take a user's name, and email, and send them an OTP. This service may be implemented into any othe project, because the rest API can be called in any other web programming language capable, thus implementation idependent. This service is independently deployable as it can work, and run independently of a greater project. This service can also be run as a business that people can pay for, as emailing OTP for authentication is becoming more frequent in most modern web apps, and mobile apps.

**How service is called:**

Service is called Asynchronously from the web app as the entire authentication of a user is contingent, on them successfully receiving the OTP to proceed with two factor authentication. 
