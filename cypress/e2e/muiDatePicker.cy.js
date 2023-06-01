describe('Date picker - Material UI', () => {
  // Arrange
  let today = new Date()
  const todaysDay = today.getDate()
  // Arrange (steps that are equal to all tests)
  beforeEach(() => {
    // Prevent failure due to application's uncaught exception
    cy.on('uncaught:exception', () => false)
    // Visits the url of the web page under test
    cy.visit('/date-picker')
    // From the 'Basic date picker' label,
    // get the next element,
    // and give it an alias of `basicDatePicker`
    cy.contains('label', 'Basic date picker')
      .next()
      .as('basicDatePicker')
    // From the `basicDatePicker`,
    // find the calendar button by its aria-label,
    // give it an alias of `calendarButton`
    // and click on it
    cy.get('@basicDatePicker')
      .find('button[aria-label="Choose date"]')
      .as('calendarButton')
      .click()
    // Get the opened date picker dialog by its role,
    // and give it an alias of `datePickerDialog`
    cy.get('div[role="dialog"]')
      .as('datePickerDialog')
    // From the `datePickerDialog`,
    // find the calendar by its role
    // and give it an alias of `calendar`
    cy.get('@datePickerDialog')
      .find('div[role="grid"]')
      .as('calendar')
  })

  afterEach(() => {
    // Wait 2 seconds after every test
    // so the recorded video doesn't get cut
    // Source: https://youtu.be/afy7iS13ctM
    /* eslint-disable cypress/no-unnecessary-waiting */
    cy.wait(2000)
    // Reset todays' date
    today = new Date()
  })

  it('shows the opened date picker dialog and closes it', () => {
    // Assert
    cy.get('@datePickerDialog')
      .its('length')
      .should('be.equal', 1)
    cy.get('@datePickerDialog')
      .should('be.visible')
    // Act
    cy.get('@calendarButton')
      .click()
    // Assert
    cy.get('@datePickerDialog')
      .should('not.exist')
  })

  it('picks the current date (today)', () => {
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(todaysDay)
      .should('be.visible')
      .as('today')
    cy.get('@today').click()
    // Assert
    cy.assertPickedDateIsEqualTo(today)
  })

  it('picks a date in the past (yesterday)', () => {
    // Arrange
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdaysDay = yesterday.getDate()
    // In case today is the 1st day of the month,
    // navigate to the previous month first
    if (todaysDay === 1) {
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowLeftIcon"]')
        .click()
    }
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(yesterdaysDay)
      .should('be.visible')
      .as('yesterday')
    cy.get('@yesterday').click()
    // Assert
    cy.assertPickedDateIsEqualTo(yesterday)
  })

  it('picks a date in the future (tomorrow)', () => {
    // Arrange
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowsDay = tomorrow.getDate()
    // In case tomorrow is the 1st day of next month,
    // navigate to the next month first
    if (tomorrowsDay === 1) {
      cy.get('@datePickerDialog')
        .find('button svg[data-testid="ArrowRightIcon"]')
        .click()
    }
    // Act
    cy.get('@calendar')
      .find('[role="gridcell"]')
      .contains(tomorrowsDay)
      .should('be.visible')
      .as('tomorrow')
    cy.get('@tomorrow').click()
    // Assert
    cy.assertPickedDateIsEqualTo(tomorrow)
  })

  context('Month and year', () => {
    // Arrange
    const year = today.getFullYear()
    const month = today.getMonth()
    const months = Object.freeze({
      0: 'January',
      1: 'February',
      2: 'March',
      3: 'April',
      4: 'May',
      5: 'June',
      6: 'July',
      7: 'August',
      8: 'September',
      9: 'October',
      10: 'November',
      11: 'December',
    })

    beforeEach(() => {
      cy.get('@datePickerDialog')
        .find(`[role="presentation"]:contains(${months[month]} ${year})`)
        .as('currentMonthAndYear')
        .should('be.visible')
    })

    context('Previous and next months', () => {
      it('visits the previous calendar month', () => {
        // Arrange
        const todayOneMonthAgo = today.setMonth(today.getMonth() - 1)
        const dateOneMonthAgo = new Date(todayOneMonthAgo)
        const yearOneMonthAgo = dateOneMonthAgo.getFullYear()
        const previousMonth = dateOneMonthAgo.getMonth()
        // Act
        cy.get('@datePickerDialog')
          .find('button svg[data-testid="ArrowLeftIcon"]')
          .click()
        // Assert
        cy.get('@datePickerDialog')
          .find(`[role="presentation"]:contains(${months[previousMonth]} ${yearOneMonthAgo})`)
          .should('be.visible')
      })

      it('visits the next calendar month', () => {
        // Arrange
        const todayOneMonthAhead = today.setMonth(today.getMonth() + 1)
        const dateOneMonthAhead = new Date(todayOneMonthAhead)
        const yearOneMonthAhead = dateOneMonthAhead.getFullYear()
        const nextMonth = dateOneMonthAhead.getMonth()
        // Act
        cy.get('@datePickerDialog')
          .find('button svg[data-testid="ArrowRightIcon"]')
          .click()
        // Assert
        cy.get('@datePickerDialog')
          .find(`[role="presentation"]:contains(${months[nextMonth]} ${yearOneMonthAhead})`)
          .should('be.visible')
      })
    })

    context('Year different than the current one', () => {
      it('picks a date in the 1st of January (5 years ahead)', () => {
        // Arrange
        const todayFiveYearsAhead = today.setFullYear(today.getFullYear() + 5)
        let firstOfJanuaryFiveYearsAhead = new Date(todayFiveYearsAhead)
        firstOfJanuaryFiveYearsAhead.setDate(1)
        firstOfJanuaryFiveYearsAhead.setMonth(0)
        firstOfJanuaryFiveYearsAhead = new Date(firstOfJanuaryFiveYearsAhead)
        // Act
        cy.get('@currentMonthAndYear').click()
        cy.contains('.MuiYearCalendar-root button', year + 5)
          .should('be.visible')
          .click()
        cy.get('@calendar')
          .find('[role="gridcell"]')
          .contains(firstOfJanuaryFiveYearsAhead.getDate())
          .should('be.visible')
          .click()
        // Assert
        cy.assertPickedDateIsEqualTo(firstOfJanuaryFiveYearsAhead)
      })
    })
  })
})
