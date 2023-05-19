Cypress.Commands.add('assertPickedDateIsEqualTo', date => {
  // Spread the date into three different variables
  // (day, month, and year)
  let day = date.getDate()
  // Since in JavaScript months start in 0,
  // add 1 to it.
  let month = date.getMonth() + 1
  const year = date.getFullYear()
  // Formalize the day and month
  // so they have a zero before them
  // in case their values are less than 10
  day < 10 ? day = `0${day}` : day
  month < 10 ? month = `0${month}` : month
  // From the `basicDatePicker`,
  // find the input field with a "MM/DD/YYYY" placeholder,
  cy.get('@basicDatePicker')
    .find('input[placeholder="MM/DD/YYYY"]')
    // Then, get its value,
    // and assert it matches with the received date
    .then($dateInputField => {
      const setDate = $dateInputField[0].value
      expect(setDate).to.equal(`${month}/${day}/${year}`)
    })
})
