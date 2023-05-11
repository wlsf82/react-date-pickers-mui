describe('Date picker - Material UI', () => {
  beforeEach(() => {
    cy.visit('/date-picker')
    cy.contains('label', 'Basic date picker')
      .next()
      .as('basicDatePicker')
    cy.get('@basicDatePicker')
      .find('button[aria-label="Choose date"]')
      .click()
  })

  it('shows the opened date picker dialog and closes it', () => {
    cy.get('div[role="dialog"]')
      .as('datePickerDialog')
      .its('length')
      .should('be.equal', 1)
    cy.get('@datePickerDialog')
      .should('be.visible')
    cy.get('@basicDatePicker')
      .click()
    cy.get('@datePickerDialog')
      .should('not.exist')
  })

  it('picks the current date', () => {
    const today = new Date()
    let day = today.getDate()
    let month = today.getMonth() + 1
    const year = today.getFullYear()
    day < 10 ? day = `0${day}` : day
    month < 10 ? month = `0${month}` : month

    cy.get('div[role="dialog"] .MuiPickersDay-today')
      .should('be.visible')
      .click()
    // Or
    // cy.get('div[role="dialog"] button[aria-current="date"]')
    //   .should('be.visible')
    //   .click()
    cy.get('@basicDatePicker')
      .find('input[placeholder="MM/DD/YYYY"]')
      .then($dateInputField => {
        const currentDate = $dateInputField[0].value
        expect(currentDate).to.equal(`${month}/${day}/${year}`)
      })
  })

  it('picks a date in the past', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1)
    let day = yesterday.getDate()
    let month = yesterday.getMonth() + 1
    const year = yesterday.getFullYear()
    day < 10 ? day = `0${day}` : day
    month < 10 ? month = `0${month}` : month

    cy.get('div[role="dialog"] .MuiPickersDay-today')
      .prev()
      .as('yesterday')
      .should('be.visible')
    // Or
    // cy.get('div[role="dialog"] button[aria-current="date"]')
    //   .prev()
    //   .as('yesterday')
    //   .should('be.visible')
    cy.get('@yesterday')
      .click()
    cy.get('@basicDatePicker')
      .find('input[placeholder="MM/DD/YYYY"]')
      .then($dateInputField => {
        const currentDate = $dateInputField[0].value
        expect(currentDate).to.equal(`${month}/${day}/${year}`)
      })
  })

  it('picks a date in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1)
    let day = tomorrow.getDate()
    let month = tomorrow.getMonth() + 1
    const year = tomorrow.getFullYear()
    day < 10 ? day = `0${day}` : day
    month < 10 ? month = `0${month}` : month

    cy.get('div[role="dialog"] .MuiPickersDay-today')
      .next()
      .as('tomorrow')
      .should('be.visible')
    // Or
    // cy.get('div[role="dialog"] button[aria-current="date"]')
    //   .next()
    //   .as('tomorrow')
    //   .should('be.visible')
    cy.get('@tomorrow')
      .click()
    cy.get('@basicDatePicker')
      .find('input[placeholder="MM/DD/YYYY"]')
      .then($dateInputField => {
        const currentDate = $dateInputField[0].value
        expect(currentDate).to.equal(`${month}/${day}/${year}`)
      })
  })
})
