/// <reference types="cypress" />

const { Dropdown } = require("bootstrap")
const exp = require("constants")

describe('First test suite', () => {

    it('first test', () => {

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //how to find a web element by tag name
        cy.get('input')

        //by ID
        cy.get('#inputEmail1')

        //by Class Value
        cy.get('.input-full-width')

        //by attribute name
        cy.get('[fullwidth]')

        //by Attribute and value
        cy.get('[placeholder="Email"]')

        //by entire Class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        //by two attributes, attribute name and attribute and value
        cy.get('[placeholder="Email"][fullwidth]')

        //by tag, attribute id and class
        cy.get('input[placeholder="Email"].input-full-width')

        //by cypress test ID, the most recommended way to retrieve locators.
        cy.get('[data-cy="imputEmail1"]')
    })

    it('second test', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //GET: used to find elements globally on the page by locator.
        //GET will always find elements on entire page, no matter how you change that.
        //FIND: used to find child elements by locator.
        //CONTAINS: used to find elements by HTML text and by locator.

        cy.contains('Sign in')
        //So in this case, we are using an attribute with text.
        cy.contains('[status="warning"]', 'Sign in')
        //Another way to find a button is using Concatenation, please see below:
        //the parent element is nb-card
        cy.contains('nb-card', 'Horizontal form').find('button')
        cy.contains('nb-card', 'Horizontal form').contains('Sign in')

        //cypress chains and DOM
        cy.get('#inputEmail3')
            .parents('form')
            .find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click()
    })

    it('save subject of the command', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        /*
        cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.contains('nb-card','Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')
        */


        /* The below will not work as expected.
        const usingTheGrid = cy.contains('nb-card', 'Using the Grid')
        usingTheGrid.find('[for="inputEmail1"]').should('contain', 'Email')
        usingTheGrid.find('[for="inputPassword2"]').should('contain', 'Password')
        */

        //Cypress Alias
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')

        // 2 Cypress then() methods
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
        })

    })

    it('extract text values', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //we are making sure that "email address" text appears in the "Basic Form" within our app.
        cy.contains('nb-card', 'Basic form').should('contain', 'Email address')

        //2, we are using the JQUERY to extract the HTML Text
        cy.get('[for="exampleInputEmail1"]').then(label => {
            const labelText = label.text()
            expect(labelText).to.equal('Email address')
        })

        //3, 
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })

        //4, we are making sure that the class label is within the label tag
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then(classValue => {
            expect(classValue).to.equal('label')
        })

        //5 how to invoke properties, to know if there is text within our field
        cy.get('#exampleInputEmail1').type('test@test.com')
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then(property => {
            expect(property).to.equal('test@test.com')
        })

    })

    it('radio buttons', () => {
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')

        cy.get('@usingTheGrid').find('[type="radio"]').then(radioButtons => {
            cy.wrap(radioButtons).eq(0).check({ force: true }).should('be.checked')
            cy.wrap(radioButtons).eq(1).check({ force: true })
            cy.wrap(radioButtons).eq(0).should('not.be.checked')
            cy.wrap(radioButtons).eq(2).should('be.disabled')
        })

    })

    it('checkboxes', () => {
        cy.visit('/')
        cy.contains('Modal & Overlays').click()
        cy.contains('Toastr').click()

        cy.get('[type="checkbox"]').eq(0).click({ force: true })
        cy.get('[type="checkbox"]').eq(1).check({ force: true })
    })

    it('Date picker', () => {
        function selectDayFromCurrent(day) {

            //JS variable
            let date = new Date()
            date.setDate(date.getDate() + day)
            let futureDay = date.getDate()
            //This is what the application provides us with: Fri Sep 06 2024 23:56:09 GMT-0
            //the 'es-US' is because we are using our application in US format
            let futureMonth = date.toLocaleDateString('en-US', { month: 'short' })
            let futureYear = date.getFullYear()
            let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`

            cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
                //It means that the condition is evaluated as "true" if the evaluation is NOT successful.
                if (!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)) {
                    cy.get('[data-name="chevron-right"]').click()
                    selectDayFromCurrent(day)
                } else {
                    //in this case we would like take only active days within the months, the reason why are excluding anything that has bounding-month
                    cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
                }
            })
            return dateToAssert
        }

        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Datepicker').click()

        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click()
            const dateToAssert = selectDayFromCurrent(5)
            //perform assertion
            cy.wrap(input).invoke('prop', 'value').should('contains', dateToAssert)
            cy.wrap(input).should('have.value', dateToAssert)
        })
    })

    it('Lists and Dropdowns', () => {

        cy.visit('/')

        //Our first option
        //we are finding the parent and then looking for the child
        cy.get('nav').find('nb-select').click()
        //or the we can also us the following:
        //cy.get('nav nb-select').click()
        cy.get('.options-list').contains('Dark').click()
        //Create the assertion
        cy.get('nav').find('nb-select').should('contain', 'Dark')

        //Our second option
        cy.get('nav').find('nb-select').then(Dropdown => {
            cy.wrap(Dropdown).click()
            //the reason why we are adding an index is to stop the loop once we reached the last option, so the dropdown does not open again if there is no option to select
            cy.get('.options-list nb-option').each((listItem, index) => {
                const itemText = listItem.text().trim()
                cy.wrap(listItem).click()
                cy.wrap(Dropdown).should('contain', itemText)
                //And here where you apply it
                if (index < 3) {
                    cy.wrap(Dropdown).click()
                }
            })
        })
    })

    it('Web Tables', () => {
        cy.visit('/')
        cy.contains('Tables & Data').click()
        cy.contains('Smart Table').click()

        //1 How to get the row of the tably by text displayed in the row
        //1. Find Larry
        //2. Click on the edit button
        //Change his Age to 25
        //Click on Save
        //Validate it works as expected
        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click()
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35')
            cy.wrap(tableRow).find('.nb-checkmark').click()
            //There is an issue and it happens once you close the edit mode, there is no way to identify what is holding our new value, therefore,
            //we must use the index in order to know what we need to assert.
            //the 6 equals to the filed of that particular row, in other words, the column
            cy.wrap(tableRow).find('td').eq(6).should('contain', '35')
        })

        //Get row by index
        //Click on the add button
        //Add First and Last name
        //Validate it works
        cy.get('thead').find('.nb-plus').click()
        //Please have into consideration that table head was 3 rows.
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type('Manuel')
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Taylor')
            cy.wrap(tableRow).find('[class="nb-checkmark"]').click()
        })
        cy.get('tbody').contains('tr', 'Manuel').then(tableRow => {
            //There is an issue and it happens once you close the edit mode, there is no way to identify what is holding our new value, therefore,
            //we must use the index in order to know what we need to assert.
            //the 6 equals to the filed of that particular row, in other words, the column
            cy.wrap(tableRow).find('td').eq(2).should('contain', 'Manuel')
            cy.wrap(tableRow).find('td').eq(3).should('contain', 'Taylor')
        })

        //3 Get each row validation
        cy.get('thead [placeholder="Age"]').clear().type('20')
        //Then our next is to double-check each of the rows only has 20 in the Age field
        cy.wait(500)
        //There is going to be an issue because the the page takes its time to update itself, and therefore, it creates an issue for
        //Cypress, the reason why we must add a wait before doing the loop
        cy.get('tbody tr').each(tableRow => {
            cy.wrap(tableRow).find('td').eq(6).should('contain', '20')
        })
    })

})