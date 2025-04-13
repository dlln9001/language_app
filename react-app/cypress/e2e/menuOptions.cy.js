describe('Menu Options', () => {
    it ('opens menu options', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#menu-options-id').should('exist')
    })

    it ('contains menu options', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#words-learn-id').contains('Words to Learn List')
        cy.get('#character-creation-id').contains('Character Creation')
    })
})