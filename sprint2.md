## Front-end

## User stories
- Setup Signup Form and Dashboard UI
- Cypress and unit testing for landing page, Sign in buttons

## What issues your team planned to address
- Cypress and unit testing using Jest for the landing page, Sign in button functionalites
- As a user, render a sign up form after succesful authentication using OAuth for a user visiting the website for the first time.
- Integrate front end and back end

## Which ones were successfully completed
- Successfully tested whether the landing page rendered the necessary text and buttons using Cypress and Jest
- Sucessfully tested whether the sign in and sign out functionality worked when a user clicked Continue with GitHub button using Cypress and Jest
- Designed the basic layout for a dashboard with Start a post functionality and display of View Profile, Sign Out button after a user is authenticated using OAuth
- Designed a role-based sign up form that would be rendered after a new user after successful OAuth for setting up user profiles.


Details fetched using signup form:
```

{
"full_name": "John Doe",
"email": "john444.doe@example.com",
"role": "Entrepreneur",
"phone_number": "1234567890",
"location": "New York",
"linkedin_profile": "https://linkedin.com/in/johndoe",
"industry" : "AI"
}

{
"full_name": "William Brown",
"email": "william.brown@example.com",
"role": "Mentor",
"phone_number": "8889990000",
"location": "San Diego",
"linkedin_profile": "https://linkedin.com/williambrown",
"expertise": "Marketing & Growth Hacking",
"past_mentorships": "20 startups",
"years_of_experience": 10,
"verification_proof": "/path/to/pdf_file",
"industry" : "AI"
}

{
"full_name": "Emma Watson",
"email": "emma.watson@example.com",
"role": "Investor",
"phone_number": "7778889999",
"location": "Chicago",
"linkedin_profile": "https://linkedin.com/emmawatson",
"investment_range": "50K-200K",
"experience_years": 5,
"verification_proof": "/path/to/pdf_file",
"industry" : "AI"
}
```

- Integrate front and Backend using API queries.
    - Check if user profile already exists in the database using a GET method
    - If user exists, redirect him to application home page
    - If user doesn't exist, render the signup form for user profile setup
    - On submitting the form, use API post method to update the user profile in data base

## Cypress tests
- Landing Page Elements Visibility : Ensures that the correct elements (text and buttons) are displayed on the landing page when the user is not logged in. It checks if the page presents the expected content to an unauthenticated user.
- GitHub Authentication Workflow : Simulates the GitHub authentication workflow, covering both the sign-in and sign-out processes. It verifies that users can successfully log in with GitHub and log out, checking the necessary UI elements and interactions along the way.

## Unit tests
- Landing Page Elements Visibility : Ensures that the logo of the application, buttons are rendered correctly on the landing page when the user is not logged in. 
- After authentication : Ensures that, when the user is authenticated, a personalized welcome message and the "Sign Out" button are displayed.
- Sign in function for GitHub and Google : Verifies that the signIn function from next-auth is called with the correct parameters when the "Continue with GitHub" and "Continue with Google" buttons are clicked. Mock sessions and fireEvent.click used to simulate the workflow.

Sprint 2 - Backend Development
------------------------------

### Overview

In Sprint 2, significant progress was made in implementing connection functionalities between Entrepreneurs, Investors, and Mentors. The backend now supports requesting, accepting, rejecting, and retrieving connections between users, enhancing collaboration and networking opportunities.

- Added CORS support to allow cross-origin requests from the frontend.

### Features Implemented

#### **1\. Connection Request Functionality**

*   Investors and Mentors can send connection requests to Entrepreneurs.
    
*   Validates user roles to ensure only eligible users can send/receive requests.
    
*   Prevents duplicate connection requests.
    

#### **2\. Accept Connection Request**

*   Entrepreneurs can accept pending connection requests.
    
*   Updates connection status from pending to accepted.
    
*   Ensures only the intended recipient can accept the request.
    

#### **3\. Get Pending Connection Requests**

*   Entrepreneurs can retrieve a list of pending connection requests.
    
*   Fetches sender details (name, email, role, location, LinkedIn profile).
    

#### **4\. Reject Connection Request**

*   Entrepreneurs can reject a connection request.
    
*   Updates connection status from pending to rejected.
    
*   Deletes the rejected connection request from the database.
    

#### **5\. Get Accepted Connections**

*   Users can view all accepted connections.
    
*   Fetches details of connected users based on accepted requests.
    
*   Works for both senders and receivers.
    

### **Technical Implementation**

*   **Framework**: Go with Chi router for handling HTTP requests.
    
*   **Database**: PostgreSQL with GORM ORM.
    

### **API Endpoints Implemented**

*   POST /connections/request – Request a connection.
    
*   POST /connections/{id}/accept – Accept a pending request.
    
*   GET /connections/pending?email={email} – Retrieve pending requests.
    
*   DELETE /connections/{id}/reject – Reject a connection request.
    
*   GET /connections/accepted?email={email} – Retrieve accepted connections.
    

### **Error Handling & Validation**

*   Ensures valid JSON input for connection requests.
    
*   Validates user roles before processing requests.
    
*   Handles cases where users or connection requests are not found.
    
*   Returns appropriate HTTP status codes (400, 404, 409, 500).
    


**Startup Operations API**
--------------------------

This API enables entrepreneurs to perform CRUD operations on their startup ideas.

### **Features Implemented**

*   **Fetch all startups** – Retrieves a list of all registered startups along with entrepreneur details.
    
*   **Insert a startup** – Allows an entrepreneur to register a new startup.
    
*   **Update a startup** – Enables an entrepreneur to modify their existing startup details.
    
*   **Delete a startup** – Allows an entrepreneur to remove their startup from the system.
    
*   **Get startups by user** – Fetches all startups associated with a specific entrepreneur.
    

The API ensures that only registered entrepreneurs can perform these operations, maintaining data integrity and security.

# Backend Unit Tests

## connections_test.go

### Test Setup
- **setupTestDB**: Initializes an in-memory SQLite database for testing.
- **TestMain**: Ensures the test database is set up before running tests.

### Connection Request Tests
- **TestRequestConnectionHandler**
  - **Successful Connection Request**: Ensures a valid connection request succeeds.
  - **Connection Already Exists**: Tests handling of duplicate connection requests.
  - **Invalid Sender Role**: Ensures role-based restrictions are enforced.

### Connection Acceptance Tests
- **TestAcceptConnectionHandler**
  - **Successful Connection Acceptance**: Tests approving a valid connection.
  - **Reject Non-Existing Connection**: Ensures handling of nonexistent connections.
  - **Unauthorized User Accepting Connection**: Tests unauthorized connection acceptance.

### Connection Rejection Tests
- **TestRejectConnectionHandler**
  - **Successful Connection Rejection**: Ensures a user can reject a pending request.
  - **Reject Non-Existing Connection**: Tests handling of nonexistent connections.

### Fetching Pending Connections
- **TestGetPendingConnectionsHandler**
  - **Retrieve Pending Connections Successfully**: Ensures correct retrieval of pending requests.

# Signup API Testing

This document outlines the test cases for the `signup_test.go` file, which tests the user signup and existence check functionalities of the application.

## Technologies Used
- Golang (Go)
- GORM (ORM for database interactions)
- Testify (Assertion library)
- net/http/httptest (For HTTP request testing)

## Test Cases

### TestCheckUserHandler
This test verifies the `/v1/user/check` endpoint, which checks if a user exists in the database.

#### User Exists
- **Setup**: Insert a mock user into the database.
- **Request**: `GET /v1/user/check?email=existing@example.com`
- **Expected Response**:
  ```json
  {
    "exists": true,
    "role": "Entrepreneur",
    "full_name": "Existing User",
    "email": "existing@example.com",
    "phone_number": "1234567890",
    "location": "New York",
    "linkedin": "https://linkedin.com/in/existinguser",
    "verification_status": "verified"
  }

