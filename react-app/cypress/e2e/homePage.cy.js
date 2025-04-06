describe('home page', () => {
  it('loads page', () => {
    cy.visit('http://localhost:3000/')
  })

  it('has a title', () => {
    cy.visit('http://localhost:3000/')
    cy.get('h1').contains('Personalized Japanese Stories')
  })

  it('has difficulty settings', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#difficulty-header').contains('Difficulty')
  })

  it('has length settings', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#length-header').contains('Length')
  })
  
  it('has generate story button', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#generate-story-id').contains('Generate Story')
  })
  
  it('has more options button', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#show-more-options-id').contains('More options')
  })

  it('click expands more options', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#show-more-options-id').click()
    cy.get('#select-genre-id').contains('Select Genre')
  })

  it('click genre dropdown shows dropdown', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#show-more-options-id').click()
    cy.get('#genre-button-id').click()
    cy.get('#genre-dropdown-id').should('exist')
  })

  it('selecting genre changes genre selected', () => {
    cy.visit('http://localhost:3000/')
    cy.get('#show-more-options-id').click()
    cy.get('#genre-button-id').contains('Random')
    cy.get('#genre-button-id').click()
    cy.get('#mystery-genre-id').click()
    cy.get('#genre-button-id').contains('Mystery')
  })

})