
# bandcast 
Two Way SMS Communication for Events
Bandcast allows Event Attendees and Event Organizers to communicate over a common phone number.
Organizers are able to directly text users as well as message every attendee at once.
Attendees are able to ask questions or provide feedback by texting the bandcast number.

## Bandcast Scenarios:
![Bandcast Scenarios](https://s3.amazonaws.com/bandcast-readme-images/Broadcast_Scenarios.png)

## Bandcast Flowchart:
![Flow Chart](https://s3.amazonaws.com/bandcast-readme-images/FlowChart.png)


## Application Setup
### Configure Bandwidth Application Platform
Requires App Platform Account with provisioned number and application setup.
##### Provisioning Number Instructions:
[First purchase a number](http://ap.bandwidth.com/docs/how-to-guides/buying-new-phone-numbers/)

##### Configuring application
###### Create new Application
First create a new Application.
* Set the Application Name
* Set the Call URL <not used but required to be set>
* Set the Message URL

![application configure](https://s3.amazonaws.com/bandcast-readme-images/configure_application.png)

######  Add Number to Application
Click the Add Numbers Button at the Bottom

![add number](https://s3.amazonaws.com/bandcast-readme-images/add_phonenumber.png)

Select the number ordered above

![select number](https://s3.amazonaws.com/bandcast-readme-images/select_phonenumber.png)

Click the save button

##### Final Configuration
Once configured the application should look something like this:

![final setup](https://s3.amazonaws.com/bandcast-readme-images/final.png)

### Setup Database
Requires Postgresql connection. Follow the instructions here:
* [HomeBrew OSX](http://exponential.io/blog/2015/02/21/install-postgresql-on-mac-os-x-via-brew/)
* [Ubuntu](http://www.postgresql.org/download/linux/ubuntu/)
* [Here for other setups](https://wiki.postgresql.org/wiki/Detailed_installation_guides)

Then Create the database within Postgresql.
* [Tutorial here](http://www.tutorialspoint.com/postgresql/postgresql_create_database.htm)

### Environment Varaibles
bandcast uses environment varaibles to configure the application.

#### Database Related Variables
```DB_USER``` - Username for Postgresql database

```DB_PASS``` - Password for Postgresql database

```DB_NAME``` - Name of Database

```DB_HOST``` - Location of Postgresql database

```DB_PORT``` - Database port

#### Catapult Related Varaibles
```CATAPULT_BASE_URL``` - The location of the catapult sever. Defaults to ```'https://api.catapult.inetwork.com/v1'```

```CATAPULT_USER_ID``` - The Catapult User ID

```CATAPULT_API_TOKEN``` - The Catapult API Token

```CATAPULT_API_SECRET``` - The Catapult API Secret

```CATAPULT_END_POINT``` - The path provided for the catapult callback. Defaults to ```'/catapult'```

```BANDCAST_NUMBER``` - The Number for Broadcast to use

#### Application Specific Varaibles
```APP_LOG_LEVEL``` - Logging level, defaults to ```'debug'```

```REQUEST_LOG_LEVEL``` - Logging level for requests, defaults to ```default```

```PORT``` - Server Port, defaults to ```'8081'```

```ORGANIZER_SUBSCRIBE_STRING``` - String used to subscribe organizers

```BANDCAST_DEFAULT_ADMIN``` - Default user for basic auth for API and Web interface

```BANDCAST_DEFAULT_PASSWORD``` - Default password for basic auth

## Running Locally

### Tip for running locally
Create an application and provide the location of the server. To run locally I use [ngrok](http://ngrok.com)

### Installing and Running
Once the environment variables are set run:
```
npm install
npm start
```

### Add users
Add users with the endpoint

```POST /users```

With body:
```json
{
 "role":"organizers | attendees",
 "tn":"<tn-of-user>",
 "firstName" : "<optional-first-name>",
 "lastName" : "<optional-last-name>"
}
```
