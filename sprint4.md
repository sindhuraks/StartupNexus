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

## What ones were successfully completed 

## Startup Management

## Startup Engagement Features

## Backend Unit Tests

### Error Responses
All endpoints return appropriate HTTP status codes with error messages in the following format:

### Technical Details
- Framework: Go with Chi router
- Database: PostgreSQL with GORM ORM
- CORS: Enabled for cross-origin requests
- Timeout: 60 seconds for requests
- Supported Methods: GET, POST, PUT, DELETE, OPTIONS

