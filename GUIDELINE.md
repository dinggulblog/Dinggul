## Running on your machine

These insturctions will get you a copy of the project up and running on your local machine for development or testing purposes.

### Prerequistes

* Node.js v16^
* npm
* MongoDB
* Aws account
* OpenAI account (optional, if you want to use OpenAI's completion API)
* Google account (optional, if you want to use Google analytics API)

## Installaion

#### 1. Clone the project

```bash
$ git clone https://github.com/dinggulblog/Dinggul.git
```

#### 2. Install packages from npm (both in frontend & backend)

```bash
$ cd FRONTEND
$ npm install --save-dev
$ cd ../BACNEND
$ npm install --save-dev
```

#### 3. Rename ```env.sample.json``` to ```.env``` (both in frontend & backend)

This file consists environment variables that are needed in frontend system.
```
VUE_APP_SECRET_KEY
VUE_APP_GA_MEASUREMENT_ID
```
* SECRET_KEY: Key used for signing up
* GA_MEASUREMENT_ID: Key used for GA cookies

This file consists environment variables that are needed in backend system.
```
COOKIE_SECRET
MONGO_ATLAS_CONNECT_URL
HOST_MAIL
AWS_S3_URL
AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY
OPENAI_API_KEY
GA_PROPERTY_ID
```
* COOKIE_SECRET: Key used for parsing cookies
* MONGO_ATLAS_CONNECT_URL: Full connection string of your MongoDB Atlas cluster
* HOST_MAIL: E-mail for AWS SES testing
* AWS_S3_URL: The S3 bucket path where the images will be stored or the CDN path associated with the S3 bucket
* AWS_ACCESS_KEY: Key used for access to aws s3 and lambda

#### 4. Create Database and User

[Following the Quickstart](https://www.mongodb.com/docs/drivers/node/current/quick-start/) is a perfect tutorial for this task. Please read through the article if you are not familar with creating database and user in MongoDB Atlas.

#### 5. Create IAM User in AWS

> In development

## Start Backend Development Server

Will be using *3000* port by default. 
```bash
$ cd BACKEND
$ npm run dev
```

## Start Frontend Development Server

Will be using *8080* port by default.
```bash
$ cd FRONTEND
$ npm run dev
```

## Connect with your browser.

* Base URL: http://localhost:8080
* Admin ID: test0001@test.com
* Admin PW: test0001
