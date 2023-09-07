describe('Date picker - Material UI', () => {
  it('opens and closes the date picker dialog', () => {
    // Arrange
    cy.visit('/')
    // Act
    cy.contains('label', 'Date Picker')
      .next()
      .find('button[aria-label="Choose date"]')
      .as('calendarButton')
      .click()
    // Assert
    cy.get('div[role="dialog"]')
      .should('be.visible')
      .as('datePickerDialog')
    // Act
    cy.get('@calendarButton')
      .click()
    // Assert
    cy.get('@datePickerDialog')
      .should('not.exist')
  })

  context('With `cy.clock("2023-06-06")`', () => {
    // Arrange
    const today = new Date('2023-06-06')
    // Arrange (steps that are equal to all tests)
    beforeEach(() => {
      // Freeze the date to June 6, 2023
      cy.clock(today.getTime())
      // Visit the url of the web page under test
      cy.visit('/')
      // From the 'Date Picker' label,
      // get the next element,
      // and give it an alias of `basicDatePicker`
      cy.contains('label', 'Date Picker')
        .next()
        .as('basicDatePicker')
      // From the `basicDatePicker`,
      // find the calendar button by its aria-label,
      // give it an alias of `calendarButton`,
      // and click on it
      cy.get('@basicDatePicker')
        .find('button[aria-label="Choose date"]')
        .as('calendarButton')
        .click()
      // Get the opened date picker dialog by its role,
      // give it an alias of `datePickerDialog`,
      // and assert it is visible
      cy.get('div[role="dialog"]')
        .as('datePickerDialog')
        .should('be.visible')
      // From the `datePickerDialog`,
      // find the calendar by its role,
      // and give it an alias of `calendar`
      cy.get('@datePickerDialog')
        .find('div[role="grid"]')
        .as('calendar')
    })

    it('picks the current date (today)', () => {
      // Act
      cy.get('@calendar')
        .find('[role="gridcell"]')
        .contains('6')
        .should('be.visible')
        .click()
      // Assert
      cy.assertPickedDateIsEqualTo(today)
    })

    it('picks a date in the past (yesterday)', () => {
      // Arrange
      const yesterday = new Date('2023-06-05')
      // Act
      cy.get('@calendar')
        .find('[role="gridcell"]')
        .contains('5')
        .should('be.visible')
        .click()
      // Assert
      cy.assertPickedDateIsEqualTo(yesterday)
    })

    it('picks a date in the future (tomorrow)', () => {
      // Arrange
      const tomorrow = new Date('2023-06-07')
      // Act
      cy.get('@calendar')
        .find('[role="gridcell"]')
        .contains('7')
        .should('be.visible')
        .click()
      // Assert
      cy.assertPickedDateIsEqualTo(tomorrow)
    })

    context('Month and year', () => {
      beforeEach(() => {
        // Arrange and assert
        cy.get('@datePickerDialog')
          .find('[role="presentation"]:contains(June 2023)')
          .as('currentMonthAndYear')
          .should('be.visible')
      })

      context('Previous and next months', () => {
        it('picks the 28th of the previous month', () => {
          // Arrange
          const twentyEighthOfPreviousMonth = new Date('2023-05-28')
          // Act
          cy.get('@datePickerDialog')
            .find('button svg[data-testid="ArrowLeftIcon"]')
            .click()
          // Assert
          cy.get('@datePickerDialog')
            .find('[role="presentation"]:contains(May 2023)')
            .should('be.visible')
          // Act
          cy.get('@calendar')
            .find('[role="gridcell"]')
            .contains('28')
            .should('be.visible')
            .click()
          // Assert
          cy.assertPickedDateIsEqualTo(twentyEighthOfPreviousMonth)
        })

        it('picks the 17th two months ahead', () => {
          // Arrange
          const seventeenthTwoMonthsAhead = new Date('2023-08-17')
          // Act
          cy.get('@datePickerDialog')
            .find('button svg[data-testid="ArrowRightIcon"]')
            .as('calendarArrowRightIcon')
            .click()
          // Assert
          cy.get('@datePickerDialog')
            .find('[role="presentation"]:contains(July 2023)')
            .should('be.visible')
          // Act
          cy.get('@calendarArrowRightIcon').click()
          // Assert
          cy.get('@datePickerDialog')
            .find('[role="presentation"]:contains(August 2023)')
            .should('be.visible')
          // Act
          cy.get('@calendar')
            .find('[role="gridcell"]')
            .contains('17')
            .should('be.visible')
            .click()
          // Assert
          cy.assertPickedDateIsEqualTo(seventeenthTwoMonthsAhead)
        })
      })

      context('Year different than the current one', () => {
        it('picks the 1st of January (5 years ahead)', () => {
          // Arrange
          const firstOfJanuaryFiveYearsAhead = new Date('2028-01-01')
          // Act
          cy.get('@currentMonthAndYear').click()
          cy.contains('.MuiYearCalendar-root button', '2028')
            .should('be.visible')
            .click()
          cy.get('@calendar')
            .find('[role="gridcell"]')
            .contains('1')
            .should('be.visible')
            .click()
          // Assert
          cy.assertPickedDateIsEqualTo(firstOfJanuaryFiveYearsAhead)
        })
      })
    })
  })
})
