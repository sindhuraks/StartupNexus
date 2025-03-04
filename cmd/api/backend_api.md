# Backend API Documentation

1. Signup API

### Endpoint: /signup
- Method: POST
- Description:
- The /signup endpoint is used for registering a new user on the platform. It accepts a JSON payload with user details and creates a user in the database. The API supports handling specific fields based on the user role (Entrepreneur, Investor, or Mentor) and creates associated role-specific records.


#### Request Body:
- The request body must contain a JSON object with the following fields. Depending on the role of the user, role-specific fields are optional.

- Common Fields:
- full_name (string): The full name of the user (Required).
- email (string): The email address of the user (Required).
- role (string): The role of the user (Required). Possible values: Entrepreneur, Investor, Mentor.
- phone_number (string): The phone number of the user (Required).
- location (string): The location of the user (Required).
- linkedin_profile (string): The LinkedIn profile URL of the user (Required).
- verification_proof (string, optional): A URL or link to the verification proof. Only used for Mentor and Entrepreneur roles.
- interest (string, optional): User's interests. This is an optional field.
- Role-Specific Fields:

##### For Entrepreneur:
- startup_name (string, optional): Name of the startup (Required if the role is Entrepreneur).
- industry (string, optional): The industry of the startup (Required if the role is Entrepreneur).
- description (string, optional): A description of the startup (Optional).
- budget (float64, optional): The budget of the startup (Optional).
- timeframe (string, optional): Timeframe for the startup (Optional).

##### For Investor:
- investment_range (string, optional): The investment range of the investor (Required if the role is Investor).
- preferred_industries (string, optional): A comma-separated list of preferred industries for investment (Required if the role is Investor).
- experience_years (integer, optional): Number of years of experience in investing (Optional).

##### For Mentor:
- expertise (string, optional): Area of expertise (Required if the role is Mentor).
- past_mentorships (string, optional): Details about past mentorships (Optional).
- years_of_experience (integer, optional): Number of years of experience as a mentor (Optional).

#### Example request body 
```json
{
  "full_name": "John Doe",
  "email": "johndoe@example.com",
  "role": "Entrepreneur",
  "phone_number": "+1234567890",
  "location": "New York",
  "linkedin_profile": "https://www.linkedin.com/in/johndoe",
  "verification_proof": "https://example.com/proof.jpg",
  "interest": "Technology, Innovation",
  "startup_name": "Tech Innovations",
  "industry": "Technology",
  "description": "A tech startup focusing on innovative solutions.",
  "budget": 50000.0,
  "timeframe": "1 year"
}
```

- Responses:
Success Response (HTTP Status 200):
```json 
{
  "status": "success",
  "message": "User registered successfully! Please verify your account.",
  "user_id": "123"
}
```

- Error Response (HTTP Status 400):
If the request body is invalid (e.g., missing required fields or incorrect data type):
``` json
{
  "status": "error",
  "message": "Invalid request payload."
}
```

- Error Response (HTTP Status 409):
If a user with the given email already exists:
```json 
{
  "status": "error",
  "message": "User already exists with this email. Please log in."
}
```

- Error Response (HTTP Status 500):
If there is an internal server error while creating the user:
```json 
{
  "status": "error",
  "message": "Error creating user."
}
```

2. User check API 

### Endpoint : /user/check
- Method: GET
- URL: /user/check?email=<email>

- Description:
The /user/check endpoint checks if a user exists based on the provided email. It returns a response indicating whether the user already exists in the system and, if so, provides relevant user information.

- Query Parameters:
email (string): The email address to check (Required).

- Example Request:
- GET /user/check?email=johndoe@example.com

- Responses:
Success Response (HTTP Status 200):
If the user does not exist, the response will indicate that the user can proceed to sign up.
```json 
{
  "exists": false
}
```

- If the user exists, the response will provide user details, including their role, full name, email, phone number, location, LinkedIn profile, and verification status.

```json 
{
  "exists": true,
  "role": "Entrepreneur",
  "full_name": "John Doe",
  "email": "johndoe@example.com",
  "phone_number": "+1234567890",
  "location": "New York",
  "linkedin": "https://www.linkedin.com/in/johndoe",
  "verification_status": "pending"
}
```

- Error Response (HTTP Status 400):
If the email query parameter is missing:
```json 
{
  "status": "error",
  "message": "Email is required"
}
```

3. Connection Pending API 

### Endpoint: /connection/pending

- Method : GET 
- Description: Fetches all pending connection requests for a specified entrepreneur.

Query Parameters:
email (required): The email address of the entrepreneur to check for pending requests.

Response:
Status 200:
```json 
[
  {
    "connection_id": "123",
    "full_name": "Jane Smith",
    "email": "janesmith@example.com",
    "role": "Investor",
    "location": "California",
    "linkedin": "https://linkedin.com/in/janesmith"
  },
  {
    "connection_id": "124",
    "full_name": "Bob Johnson",
    "email": "bobjohnson@example.com",
    "role": "Mentor",
    "location": "Texas",
    "linkedin": "https://linkedin.com/in/bobjohnson"
  }
]
```

Status 400: Missing email parameter
```json 
{
  "status": "error",
  "message": "Email is required"
}
```

4. Connection Request API 
- Method : POST 
Description: Allows an Investor or Mentor to send a connection request to an Entrepreneur.
- Request Body:
```json 
{
  "sender_email": "investor@example.com",
  "receiver_email": "entrepreneur@example.com"
}
```

- Response 
Status 201:
```json 
{
  "status": "success",
  "message": "Connection request sent from investor@example.com to entrepreneur@example.com"
}
```

Status 400: Invalid request payload
```json 
{
  "status": "error",
  "message": "Invalid request payload"
}
```
Status 404: Sender or receiver not found
```json 
{
  "status": "error",
  "message": "Sender not found"
}
```
Status 403: Sender or receiver role mismatch
```json 
{
  "status": "error",
  "message": "Only Investors and Mentors can send connection requests"
}
```

5. Connection Accept API 
- Method: PUT 
Description: Allows an Entrepreneur to accept a pending connection request.
URL Parameters:
id (required): The connection request ID to accept.
Query Parameters:
email (required): The email address of the Entrepreneur accepting the connection.

Response:
Status 200:
```json 
{
  "status": "success",
  "message": "Connection request 123 accepted"
}
```

Status 400: Missing or invalid email parameter
```json 
{
  "status": "error",
  "message": "Email is required"
}
```

Status 404: Connection request not found or not in pending state
```json
{
  "status": "error",
  "message": "Pending connection request not found"
}
```

6. Reject connection 
- Method: DELETE 
Description: Allows an Entrepreneur to reject a pending connection request.
URL Parameters:
id (required): The connection request ID to reject.
Query Parameters:
email (required): The email address of the Entrepreneur rejecting the connection.

Response:
Status 200:
```json 
{
  "status": "success",
  "message": "Connection request 123 rejected"
}
```

Status 400: Missing or invalid email parameter
```json 
{
  "status": "error",
  "message": "Email is required"
}
```

Status 404: Connection request not found or not in pending state
```json
{
  "status": "error",
  "message": "Pending connection request not found"
}
```

7. My connections 
- Description: Fetches all accepted connections for a specified user (either an Investor, Mentor, or Entrepreneur).

Query Parameters:
email (required): The email address of the user to fetch accepted connections for.

Response:
Status 200:
```json 
{
  "status": "success",
  "connections": [
    {
      "id": 1,
      "name": "Jane Smith",
      "email": "janesmith@example.com",
      "role": "Investor"
    },
    {
      "id": 2,
      "name": "Bob Johnson",
      "email": "bobjohnson@example.com",
      "role": "Mentor"
    }
  ]
}
```

Status 400: Missing email parameter
```json 
{
  "status": "error",
  "message": "Email is required"
}
```

8. All Startup API
Endpoint: /startups
Method: GET
Description: Fetches all startup information available.
Responses:
Success Response (HTTP Status 200):
```json 
{
  "status": "success",
  "startups": [
    {
      "id": 1,
      "name": "Tech Innovators",
      "location": "San Francisco",
      "founders": ["Alice", "Bob"]
    }
  ]
}
```

Error Response (HTTP Status 500):
```json 
{
  "status": "error",
  "message": "Error fetching startup data."
}
```

9. Add Startup API
Endpoint: /startups/add
Method: POST

Description: Allows an Entrepreneur to add a new startup to the platform.

Request Body:
```json 
{
  "startup_name": "Tech Innovators",
  "industry": "Technology",
  "location": "San Francisco",
  "founders": ["Alice", "Bob"],
  "description": "A startup focused on cutting-edge technology.",
  "budget": 500000.00,
  "timeframe": "2 years"
}
```

Request Body Fields:

- startup_name (string, required): The name of the startup.
- industry (string, required): The industry the startup operates in.
- location (string, required): The location of the startup.
- founders (array of strings, required): List of founders' names.
- description (string, optional): Description of the startup.
- budget (float64, optional): Budget of the startup.
- timeframe (string, optional): Timeframe for achieving the startup's goals.

Response:

Success Response (HTTP Status 201):
```json
{
  "status": "success",
  "message": "Startup added successfully",
  "startup_id": "123"
}
```

Error Response (HTTP Status 400):
```json
{
  "status": "error",
  "message": "Invalid request payload"
}
```

Error Response (HTTP Status 500):
```json
{
  "status": "error",
  "message": "Error adding startup"
}
```

10. Update Startup API

Endpoint: /startups/update
Method: PUT

Description: Allows an Entrepreneur to update information about an existing startup.

Request Body:
```json
{
  "startup_id": "123",
  "startup_name": "Tech Innovators 2.0",
  "industry": "AI Technology",
  "location": "San Francisco",
  "founders": ["Alice", "Bob", "Charlie"],
  "description": "A startup advancing AI technology for automation.",
  "budget": 750000.00,
  "timeframe": "3 years"
}
```

Request Body Fields:

- startup_id (string, required): The ID of the startup to update.
- startup_name (string, required): The updated name of the startup.
- industry (string, required): The updated industry.
- location (string, required): The updated location.
- founders (array of strings, required): The updated list of founders.
- description (string, optional): The updated description.
- budget (float64, optional): The updated budget.
- timeframe (string, optional): The updated timeframe.

Response:

Success Response (HTTP Status 200):
```json
{
  "status": "success",
  "message": "Startup updated successfully"
}
```

Error Response (HTTP Status 400):
```json
{
  "status": "error",
  "message": "Invalid request payload"
}
```

Error Response (HTTP Status 404):
```json
{
  "status": "error",
  "message": "Startup not found"
}
```

Error Response (HTTP Status 500):
```json
{
  "status": "error",
  "message": "Error updating startup"
}
```

11. Delete Startup API

Endpoint: /startups/delete
Method: DELETE

Description: Allows an Entrepreneur to delete a startup from the platform.

Query Parameters:

startup_id (string, required): The ID of the startup to delete.
Response:

Success Response (HTTP Status 200):
```json 
{
  "status": "success",
  "message": "Startup deleted successfully"
}
```

Error Response (HTTP Status 400):
```json 
{
  "status": "error",
  "message": "Startup ID is required"
}
```

Error Response (HTTP Status 404):
```json 
{
  "status": "error",
  "message": "Startup not found"
}
```

Error Response (HTTP Status 500):

```json 
{
  "status": "error",
  "message": "Error deleting startup"
}
```

12. Get Startup By ID API

Endpoint: /startups/:id
Method: GET

Description: Fetches the information of a specific startup by ID.

URL Parameters:

id (string, required): The ID of the startup to fetch.
Response:

Success Response (HTTP Status 200):
```json 
{
  "status": "success",
  "startup": {
    "id": "123",
    "name": "Tech Innovators",
    "location": "San Francisco",
    "founders": ["Alice", "Bob"],
    "industry": "Technology",
    "description": "A startup focused on cutting-edge technology.",
    "budget": 500000.00,
    "timeframe": "2 years"
  }
}
```

Error Response (HTTP Status 404):
```json 
{
  "status": "error",
  "message": "Startup not found"
}
```

