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

    it ('clicking words to learn button opens words to learn modal', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#words-learn-id').click()
        cy.get('#add-to-list-button').should('exist')
        cy.get('#word-input').should('exist')
    })

    it ('clicking add to list button adds word to list', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#words-learn-id').click()
        cy.get('#word-input').type('testWord')
        cy.get('#add-to-list-button').click()
        cy.get('#inputted-word').contains('testWord')
    })

    it ('deleting word from list works', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#words-learn-id').click()
        cy.get('#word-input').type('testWord')
        cy.get('#add-to-list-button').click()
        cy.get('#remove-word-button').click()   
        cy.get('#inputted-word').should('not.exist')
    })

    it ('x button closes words to learn modal', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#words-learn-id').click()
        cy.get('#close-words-modal-button').click()
        cy.get('#words-list-modal').should('not.exist')
    })
})