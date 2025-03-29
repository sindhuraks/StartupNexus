// Cypress test suite to mimic GitHub authentication workflow
describe('GitHub Sign-In Test', () => {
  
  // Test case to simulate successful sign-in with GitHub
  it('should successfully when an existing user signs-in with GitHub and display the dashboard ', () => {

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
  }); 
});
