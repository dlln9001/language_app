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

    it ('clicking character creation button opens character creation modal', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#character-creation-id').click()
        cy.get('#character-creation-modal').should('exist')
    })

    it ('clicking randomize button randomizes character name', () => { 
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#character-creation-id').click()
        cy.get('#character-name-input').should('have.value', '')
        cy.get('#randomize-character-button').click()
        cy.get('#character-name-input').should('not.have.value', '')
    })

    it ('clicking add character button adds character to list', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#character-creation-id').click()
        cy.get('#character-name-input').should('have.value', '')
        cy.get('#character-name-input').type('testName')
        cy.get('#add-character-button').click()
        cy.get('#character-name-input').should('have.value', '')
        cy.get('#character-name').contains('testName')
    })

    it ('deleting character from list works', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#character-creation-id').click()
        cy.get('#character-name-input').type('testName')
        cy.get('#add-character-button').click()
        cy.get('#character-button').click()
        cy.get('#delete-character-button').click()   
        cy.get('#character-name').should('not.exist')
    })

    it ('closing character creation modal works', () => {
        cy.visit('http://localhost:3000/')
        cy.get('#menu-burger-id').click()
        cy.get('#character-creation-id').click()
        cy.get('[data-cy="close-character-modal"]').click()
        cy.get('#character-creation-modal').should('not.exist')
    })
})