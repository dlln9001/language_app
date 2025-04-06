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
})