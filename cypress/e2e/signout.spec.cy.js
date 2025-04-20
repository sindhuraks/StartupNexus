describe('Sign Out Test', () => {
  beforeEach(() => {
    // Visit the dashboard page
    cy.visit('/dashboard')
    
    // Mock the session to simulate logged-in state
    cy.window().then((win) => {
      win.sessionStorage.setItem('next-auth.session-token', 'mock-token')
      
      // Mock user session for next-auth
      const mockSession = {
        user: {
          name: Cypress.env('GITHUB_USERNAME'), // Using Cypress environment variable for GitHub username
          password: Cypress.env('GITHUB_PASSWORD'), // Using Cypress environment variable for GitHub password
          name: 'Sindhura'
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      win.sessionStorage.setItem('next-auth.session', JSON.stringify(mockSession))
    });
    
    // Reload to apply the session
    cy.reload()
    
    // Intercept the sign out request
    cy.intercept('POST', '/api/auth/signout', {
      statusCode: 200,
      body: { url: '/' }
    }).as('signOutRequest');
    
    // Also intercept the potential redirect to sign-out callback
    cy.intercept('GET', '/api/auth/signout*', {
      statusCode: 200
    }).as('signOutCallback');
  });

  it('should signout the user when sign out button is clicked', () => {
    // Click on the profile section
    cy.get('[class*="profileSection"]').click()
    
    // Verify dropdown menu is visible
    cy.get('[class*="dropdownMenu"]').should('be.visible')
    
    // Verify sign out button exists
    cy.get('button').contains('Sign Out').should('be.visible')

    cy.get('button').contains('Sign Out').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('h1').contains('Welcome Back!').should('be.visible')
    // Check if the <h3> contains the text 'Sign in to your account' and is visible
    cy.get('h3').contains('Sign in to your account').should('be.visible')
    // Check if the <button> contains the text 'Continue with GitHub' and 'Continue with Google' and is visible
    cy.get('button').contains('Continue with GitHub').should('be.visible')
    cy.get('button').contains('Continue with Google').should('be.visible')
  });
});