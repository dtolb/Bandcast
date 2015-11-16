### Send Message to attendees
All messages sent to this endpoint are assumed to be from an organizer.

```
POST /messages
```
Body

```json
{
"text":"<message-text>",
"from":"<tn-of-organizer-sending-message>"
}
```

--
### List Messages

```
GET /messages
```

#### Query Options
The resources are queryable by the following parameters:

* `to` : `organizers | attendees` : the user role of the sender
* `from` : `<tn>` : the telephone number of the sender

#### Example Output

```
{
 messages : [
  {
   "from" : "<tn>",
   "to" : "organizers | attendees",
   "text" : "this is a test message",
   "timestamp" : "<timestamp with timezone>",
   "username" : "<username of attendee if available>"
  },
  <...>
 ]
}
```

--
### List Users

##### All Users

```
GET /users

```

#### Example Output
```
{
 users : [
 {
   "role" : "organizers | attendees",
   "firstName" : "<optional-firstName>",
   "lastName" : "<optional-lastName>",
   "tn": "<tn>"
   "username": "<username-if-attendee> || <null-if-organzier>"
 },
 <...>
 ]
}
```
--
### Delete Users
##### Any User

```
DELETE /users?tn=<tn-of-user-to-delete>

```
--
### Add User

##### Attendee

```
POST /users
```

Body

```json
{
 "role":"organizers | attendees",
 "tn":"<tn-of-user>",
 "firstName" : "<optional-first-name>",
 "lastName" : "<optional-last-name>"
}
```
