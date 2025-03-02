// Cypress test suite to mimic GitHub authentication workflow
describe('GitHub Sign-In Test', () => {
  
  // Test case to simulate successful sign-in with GitHub
  it('should successfully sign in with GitHub', () => {

    // Visit the root page ('/')
    cy.visit('/')

    // Intercept the session API call and mock the response as if the user is already logged in with GitHub
    cy.intercept('/api/auth/session', {
      statusCode: 200,
      body: {  // Mocking the session data
        user: {
          name: Cypress.env('GITHUB_USERNAME'), // Using Cypress environment variable for GitHub username
          password: Cypress.env('GITHUB_PASSWORD'), // Using Cypress environment variable for GitHub password
        },
      }
    }).as('getSession')

    // Simulate the user clicking the "Continue with GitHub" button
    cy.get('button').contains('Continue with GitHub').click({ force: true }) // Force click to avoid any interaction blockers

    // Simulate the visit to the callback URL after authentication
    cy.visit('/?callbackUrl=%2F')

    cy.wait('@getSession')

    // Assert that the user is redirected and sees a personalized welcome message
    cy.contains('h1', `Welcome back, ${Cypress.env('GITHUB_USERNAME')}`).should('be.visible')

    // Ensure the "Sign Out" button is visible after a successful sign-in
    cy.contains('button', 'Sign Out').should('be.visible')
  });

  // Test case to simulate signing out after a successful sign-in
  it('should handle sign out', () => {

    //  Intercept the session API call and mock a signed-in state (user is already authenticated)
    cy.intercept('/api/auth/session', {
      statusCode: 200, 
      body: {  // Mocking session data with user information
        user: {
          name: Cypress.env('GITHUB_USERNAME'),  // Use the GitHub username from Cypress environment variables
          password: Cypress.env('GITHUB_PASSWORD'),  // GitHub password from Cypress environment variables
        },
      }
    }).as('getSession')

    // Visit the landing page
    cy.visit('/')
    cy.wait('@getSession')

    // Verify that the user is logged in by checking the welcome message
    cy.contains('h1', `Welcome back, ${Cypress.env('GITHUB_USERNAME')}`).should('be.visible')

    // Intercept the sign-out request and mock a successful response
    cy.intercept('POST', '/api/auth/signout', {
      statusCode: 200,  // Status code 200 indicates the sign-out was successful
      body: { url: '/' }  // After sign-out, redirect the user back to the landing page ('/')
    }).as('signOut')  // Alias for the sign-out API request

    // Simulate the user clicking the "Sign Out" button
    cy.get('button').contains('Sign Out').click()

    // Wait for the sign-out API request to complete
    cy.wait('@signOut')

    // Intercept the session API to return an empty session (i.e., user is logged out)
    cy.intercept('/api/auth/session', {
      statusCode: 200,  // Status code 200 for success
      body: {}  // Empty session body indicates the user is logged out
    }).as('getEmptySession')

    // Verify that the landing page now shows the "Welcome back" message without a username
    cy.contains('h1', 'Welcome back').should('be.visible')

    // Ensure that the "Sign in to your account" message is visible, prompting the user to log in again
    cy.contains('h3', 'Sign in to your account').should('be.visible')
  });
});
