// cypress test spec to display the buttons on the landing page
describe('Landing Page', () => {

  // beforeEach hook to ensure the landing page is visited before each test
  beforeEach(() => {
    cy.visit('/')
  })

  // Test case to check if specific elements (text and buttons) are visible when the user is not logged in
  it('should display the text and buttons when user is not logged in', () => {
    // Check if the <h1> contains the text 'Welcome back' and is visible
    cy.get('h1').contains('Welcome Back!').should('be.visible')
    // Check if the <h3> contains the text 'Sign in to your account' and is visible
    cy.get('h3').contains('Sign in to your account').should('be.visible')
    // Check if the <button> contains the text 'Continue with GitHub' and 'Continue with Google' and is visible
    cy.get('button').contains('Continue with GitHub').should('be.visible')
    cy.get('button').contains('Continue with Google').should('be.visible')
  })
})