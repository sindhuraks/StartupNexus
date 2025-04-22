# Sprint 4
## Frontend Development

## User stories
- Like and unlike a post : Frontend and backend integration
- Comment on a post : Frontend and backend integration
- Report a post : Frontend and backend integration
- Sign out of the application and return to homepage
- Design and develop messaging feature to
    - compose a new message
    - search a conversation history
    - search for a user and send a message
    - switch between conversations
    - send and receive messages with time stamp
- Enhancements for network feature 
    - accept/Ignore conection requests
    - remove existing users from my network section
    - display no pending requests if no requests
- Cypress and unit testing

## What issues your team planned to address
- Introduction of new unit tests to:
    - verify the component renders the conversation list in message feature
    - test that users can switch between different conversations by clicking on user names
    - confirm functionality for sending new messages in the current conversation and checks that sent messages appear correctly
    - compose modal functionality - opening it, closing it, and verifying the send button is properly disabled when required fields are empty
    - validate the recipient search functionality within the compose modal, ensuring users can search for, select recipients, and see confirmation of their selection
    - functionality for accepting and ignoring connection invitations, ensuring the appropriate buttons disappear after user actions
    - checks that users can remove existing connections and validates that UI updates accordingly
    - confirms conditional messaging appears when no invitations ("No pending invitations") or connections ("No connections yet") exist

- Introduction of new Cypress tests for : 
    - creation of a post
    - viewing a profile
    - like a post
    - comment on a post
    - signout of the application

- As an authenticated user,
    - should be able to like/unlike a post using the Like button
    - should be able to comment on a post and upon pressing Enter the comment should be added
    - should be able to view all comments using the Comments button
    - vshould be able to view the number of Likes and Comments on a post
    - should be able to report a post using the report button
    - should be able to signout of the application using Signout button in the dashboard
    - integrate front end and back end for the above functionalities
    - should have the ability to have separate conversations with different users
    - to have a message history stored per-conversation and have a real-time conversation switching with active conversation highlighting
    - compose modal for new conversations
    - recipient search functionality
    - timestamp display
    - view pending connection invitations
    - accept/ignore incoming connection requests
    - remove existing connections
    - have a clean separation between invitations and connections

## Which ones were successfully completed
- Successfully tested whether the a new post could be created, view a profile when View Profile button was clicked, like and comment on a post, signout of the application.
- Like a post and increment the like count. Display of the total number of likes after liking a post.
- Unlike a post and decrement the like count. Display of the total number of likes after unliking a post.
- Add a new comment on a startup post. Upon pressing Enter, the comment would be added to the database. Upon clicking the Comments button could see the comment posted and also display the number of comments.
- Report a post using the Report option and render a textbox stating the reason why the post was being reported. Delete a post when the report count exceeds the threshold set.
- Signout of the application when the Signout button is clicked.
- Create users view and switch between multiple chat conversations, each with its own message history
- Displays a list of contacts and their recent messages on the left sidebar
- Shows the full chat window for the selected user, including all exchanged messages
- Allows sending new messages in the current conversation and updates the chat in real time
- Includes a compose modal for starting new conversations, with recipient search and message input
- Displays a list of pending connection invitations and current user connections
- Enables users to accept or ignore invitations, updating the connection lists accordingly
- Shows clear messages when there are no pending invitations or no connections
- Integrate front and Backend using API queries.
    - Like/ report a post using a POST method
    - Unlike a post usig DELETE method
    - Display all likes/unlikes/comments using GET method
    - Edit a post using PUT method
    - Delete a post usig DELETE method

## Frontend Unit Tests
Unit tests to:
- verify the component renders the conversation list in message feature
- test that users can switch between different conversations by clicking on user names
- confirm functionality for sending new messages in the current conversation and checks that sent messages appear correctly
- compose modal functionality - opening it, closing it, and verifying the send button is properly disabled when required fields are empty
- validate the recipient search functionality within the compose modal, ensuring users can search for, select recipients, and see confirmation of their selection
- functionality for accepting and ignoring connection invitations, ensuring the appropriate buttons disappear after user actions
- checks that users can remove existing connections and validates that UI updates accordingly
- confirms conditional messaging appears when no invitations ("No pending invitations") or connections ("No connections yet") exist


### Technologies Used
- Jest
- Cypress

### Cypress tests
1. Introduction of new cypress test covering functionalities of sprint 3 and 4.
    1. Creation of a post.
    2. Like a post.
    3. Comment on a post.
    4. Signout of the application.
    5. View the user profile.



## Backend Development
## API Documentation

## User Stories Implemented
- As a user, I want to like a startup so I can show interest in it
- As a user, I want to comment on startups to share my thoughts
- As a user, I want to report a startup if I find inappropriate content
- As a user, I want to search for other users by name to find and connect with them
- As a platform, I want to enable universal connection requests between all roles
- As a platform, I want to implement intelligent connection suggestions based on user roles and profiles
- As a platform, I want to display startups in sorted order (newest first)
- As a user, I want to send messages to my connections so I can communicate directly with them
- As a user, I want to view my chat history with a connection so I can review our past conversations
- As a platform, I want to ensure only mutually connected users can message each other for privacy and security
- As a platform, I want to store and retrieve messages in chronological order for natural conversation flow


## What ones were successfully completed 
- Implemented like/unlike endpoints with duplicate prevention
- Built comment creation and retrieval system with validation
- Developed reporting system with duplicate prevention
- Created case-insensitive partial name search functionality
- Enabled universal connections between all user roles
- Implemented suggestion algorithm with role-based matching (100/80/50 scoring)
- Updated all startup queries to sort by created_at/updated_at
- Added comprehensive unit tests for all new endpoints
- Verified search and suggestion logic through testing
- Secure message sending between mutually connected users
- Chronological chat history retrieval for any connection
- User and connection validation before message exchange
- Backend-tested endpoints for reliability and data integrity


## User Management
1. Signup
- Endpoint: POST /v1/signup
- Description: Register a new user
- Request Body:
```json
{
  "full_name": "string",
  "email": "string",
  "role": "string (Entrepreneur/Investor/Mentor)",
  "phone_number": "string",
  "location": "string",
  "linkedin_profile": "string",
  "verification_proof": "string (optional)",
  
   "Entrepreneur-specific fields"
  "startup_name": "string (optional)",
  "industry": "string (optional)",
  "description": "string (optional)",
  "budget": "number (optional)",
  "timeframe": "string (optional)",
  
   "Investor-specific fields"
  "investment_range": "string (optional)",
  "preferred_industries": "string (optional)",
  "experience_years": "number (optional)",
  
   "Mentor-specific fields"
  "expertise": "string (optional)",
  "past_mentorships": "string (optional)",
  "years_of_experience": "number (optional)"
}
```

- Success Response:

```json
{
  "status": "success",
  "message": "User registered successfully! Please verify your account.",
  "user_id": "number"
}
```

2. Check User Existence
- Endpoint: GET /v1/user/check?email=user@example.com
- Description: Check if a user exists
- Query Parameters:
    email (required)
- Success Response:
```json
{
  "exists": true,
  "role": "string",
  "full_name": "string",
  "email": "string",
  "phone_number": "string",
  "location": "string",
  "linkedin": "string",
  "verification_status": "string"
}
```

3. Search Users by Name
- Endpoint: GET /v1/user/search?name=searchTerm
- Description: Search users by name (case-insensitive partial match)
- Query Parameters:
name (required)

Success Response:
```json
{
  "status": "success",
  "count": "number",
  "users": [
    {
      "id": "number",
      "full_name": "string",
      "email": "string",
      "role": "string",
      "location": "string",
      "linkedin_profile": "string"
    }
  ]
}
```

## Connection Management

1. Request Connection
- Endpoint: POST /v1/connection/request
- Description: Send a connection request
- Request Body:
```json
{
  "sender_email": "string",
  "receiver_email": "string"
}
```
- Success Response:
```json
{
  "status": "success",
  "message": "Connection request sent from sender@example.com to receiver@example.com"
}
```

2. Get Pending Connections
- Endpoint: GET /v1/connection/pending?email=user@example.com
- Description: Get pending connection requests for a user
- Query Parameters:
email (required)

Success Response:
```
[
  {
    "connection_id": number,
    "full_name": "string",
    "email": "string",
    "role": "string",
    "location": "string",
    "linkedin": "string"
  }
]
```

3. Accept Connection
- Endpoint: PUT /v1/connection/accept/{id}?email=user@example.com
- Description: Accept a pending connection request
- URL Parameters:
id (connection ID)

- Query Parameters:
email (required)

- Success Response:
```json
{
  "status": "success",
  "message": "Connection request [id] accepted"
}
```

4. Reject Connection
- Endpoint: DELETE /v1/connection/reject/{id}?email=user@example.com
- Description: Reject a pending connection request
- URL Parameters:
id (connection ID)

- Query Parameters:
email (required)

Success Response:
```json
{
  "status": "success",
  "message": "Connection request [id] rejected"
}
```

5. Get Accepted Connections
- Endpoint: GET /v1/connection/my?email=user@example.com
- Description: Get all accepted connections for a user
- Query Parameters:
email (required)

Success Response:
```json
{
  "status": "success",
  "connections": [
    {
      "id": "number",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  ]
}
```

6. Get Connection Suggestions
- Endpoint: GET /v1/suggestions?email=user@example.com
- Description: Get connection suggestions based on user role and interests
- Query Parameters:
email (required)

Success Response:
```json
{
  "status": "success",
  "user_email": "string",
  "user_role": "string",
  "suggestions": [
    {
      "type": "string (investor/mentor/startup)",
      "id": "number",
      "email": "string",
      "name": "string",
      "location": "string",
      "match_reason": "string",
      "score": "number"
    }
  ]
}
```

## Startup Management

1. Get All Startups
- Endpoint: GET /v1/startup/all
- Description: Get all registered startups with entrepreneur details

Success Response:
```json
{
  "status": "success",
  "startups": [
    {
      "id": "number",
      "startup_name": "string",
      "industry": "string",
      "description": "string",
      "budget": "number",
      "timeframe": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "entrepreneur": {
        "id": "number",
        "name": "string",
        "email": "string",
        "location": "string"
      }
    }
  ]
}
```

2. Get Startups by User
- Endpoint: GET /v1/startup/user?email=user@example.com
- Description: Get all startups for a specific entrepreneur
- Query Parameters:
email (required)

Success Response:

```json
{
  "status": "success",
  "startups": [
    {
      "id": "number",
      "startup_name": "string",
      "industry": "string",
      "description": "string",
      "budget": "number",
      "timeframe": "string",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  ]
}
```

3. Insert Startup
- Endpoint: POST /v1/startup/insert
- Description: Add a new startup
- Request Body:
```json
{
  "entrepreneur_email": "string",
  "startup_name": "string",
  "industry": "string",
  "description": "string",
  "budget": "number",
  "timeframe": "string"
}
```

- Success Response:
```json
{
  "status": "success",
  "message": "Startup inserted successfully"
}
```

4. Update Startup
- Endpoint: PUT /v1/startup/update
- Description: Update an existing startup
Request Body:
```json
{
  "email": "string",
  "startup_id": "number",
  "startup_name": "string",
  "industry": "string",
  "description": "string",
  "budget": "number",
  "timeframe": "string"
}
```

- Success Response:

```json
{
  "status": "success",
  "message": "Startup updated successfully"
}
```

5. Delete Startup
- Endpoint: DELETE /v1/startup/delete
- Description: Delete a startup
- Request Body:
```json
{
  "email": "string",
  "startup_id": "number"
}
```

- Success Response:
```json
{
  "status": "success",
  "message": "Startup deleted successfully"
}
```

## Startup Engagement Features
1. Add Comment
- Endpoint: POST /v1/startup/comment
- Description: Add a comment to a startup
- Request Body:
```json
{
  "email": "string",
  "startup_id": "number",
  "content": "string"
}
```

- Success Response:
```json
{
  "status": "success",
  "message": "Comment added successfully"
}
```
2. Get Comments
- Endpoint: GET /v1/startup/comments/{id}
- Description: Get all comments for a startup
- URL Parameters:
id (startup ID)

- Success Response:
```json 
{
  "status": "success",
  "comments": [
    {
      "user_id": "number",
      "startup_id": "number",
      "content": "string"
    }
  ]
}
```
3. Like Startup
- Endpoint: POST /v1/startup/like
- Description: Like a startup
- Request Body:
```json
{
  "email": "string",
  "startup_id": "number"
}
```

- Success Response:
```json
{
  "status": "success",
  "message": "Startup liked successfully"
}
```

4. Unlike Startup
- Endpoint: POST /v1/startup/unlike
- Description: Remove like from a startup
- Request Body:
```json
{
  "email": "string",
  "startup_id": "number"
}
```

- Success Response:
```json
{
  "status": "success",
  "message": "Startup unliked successfully"
}
```

5. Get Like Count
- Endpoint: GET /v1/startup/likes/{id}
- Description: Get number of likes for a startup
- URL Parameters:
id (startup ID)

- Success Response:
```json
{
  "status": "success",
  "like_count": "number"
}
```

6. Report Startup
- Endpoint: POST /v1/startup/report
- Description: Report a startup for inappropriate content
- Request Body:
```json
{
  "email": "string",
  "startup_id": "number",
  "reason": "string"
}
```
- Success Responses:
```json
{
  "status": "success",
  "message": "Report submitted successfully"
}
```

```json
{
  "status": "success",
  "message": "Startup has been removed"
}
```

- Error Response:
```json
{
  "status": "error",
  "message": "You have already reported this startup"
}
```

## Messaging Features
1. Send Message
- Endpoint: POST /v1/message/send
- Description: Send a message to a user you are connected with
- Request Body:
```json
{
  "sender_email": "johndoe@example.com",
  "receiver_email": "emmawatson@example.com",
  "content": "Hi Emma, I'm looking forward to your investment insights!"
}
```
- Success Response:
```json 
{
  "status": "success",
  "message": "Message sent successfully"
}
```
- Error Response
```json 
{
  "status": "success",
  "message": "Message sent successfully"
}
```

```json
{
  "status": "error",
  "message": "Sender not found"
}
```

```json
{
  "status": "error",
  "message": "Receiver not found"
}
```

```json
{
  "status": "error",
  "message": "Users are not connected"
}
```

```json
{
  "status": "error",
  "message": "Failed to save message"
}
```

2. Get Message History
- Endpoint: GET /v1/message/inbox?sender=johndoe@example.com&receiver=emmawatson@example.com
- Description: Retrieve the chronological chat history between two connected users

- Success Response:

```json
{
  "status": "success",
  "chat_with": "emmawatson@example.com",
  "messages": [
    {
      "from": "johndoe@example.com",
      "to": "emmawatson@example.com",
      "content": "Hi Emma, I'm looking forward to your investment insights!",
      "timestamp": "2024-06-07T11:25:47Z"
    },
    {
      "from": "emmawatson@example.com",
      "to": "johndoe@example.com",
      "content": "Thanks John, happy to help!",
      "timestamp": "2024-06-07T11:27:02Z"
    }
  ]
}
```

- Error Responses:

```json
{
  "status": "error",
  "message": "Missing sender or receiver email"
}
```

```json
{
  "status": "error",
  "message": "Sender not found"
}
```
```json
{
  "status": "error",
  "message": "Sender not found"
}
```

```json
{
  "status": "error",
  "message": "Receiver not found"
}
```

```json
{
  "status": "error",
  "message": "Users are not connected"
}
```

```json
{
  "status": "error",
  "message": "Failed to save message"
}
```


## Backend Unit Tests

1. Comments Feature
- Add Comment (Success, Invalid Payload, User Not Found)
- Get Comments by Startup ID (Valid ID, Invalid ID)

2. Likes Feature
- Like Startup (Success, Already Liked, Invalid Payload)
- Unlike Startup (Success, Invalid Payload)
- Get Like Count (Correct Count Retrieval)

3. Reports Feature
- Submit Report (Success, Duplicate Report, Auto-Delete After 5 Reports, Invalid Payload, User Not Found)

4. Startup Feature
- Insert Startup (Success, User Not Found)
- Get All Startups
- Get Startups by User (Valid User, User Not Found)
- Update Startup
- Delete Startup (Success, Not Owner)

5. Suggestions Feature
- Get Suggestions Handler (Missing Email, User Not Found, Invalid Role, Valid Entrepreneur Suggestions)

6. Messaging Feature
- Send Message (Success, Sender Not Found, Not Connected)
- Get Messages (Chat Retrieval with Connected Users, Valid Content in Response)


### Error Responses
All endpoints return appropriate HTTP status codes with error messages in the following format:

### Technical Details
- Framework: Go with Chi router
- Database: PostgreSQL with GORM ORM
- CORS: Enabled for cross-origin requests
- Timeout: 60 seconds for requests
- Supported Methods: GET, POST, PUT, DELETE, OPTIONS
