import React, { Component } from 'react';

export default class Table extends Component
{
  validity = {
    validCash: true,
    validLowerLimit: true,
    validUpperLimit: true,
    validStep: true,
    validSigfigs: true
  };

  resultsLimit = 1000;               //slow down usually begins at 1000 results
  errorMessage = "";                                 //error message collection
  maxSigFigs = 10;

  /**
   * Resets the error message to a blank string.
   */
  resetErrorMessage () {
    this.errorMessage = "";
  }

  /**
   * Appends a message to the errorMessage.
   * @param {*} message
   */
  appendToErrorMessage (message) {
    this.errorMessage = this.errorMessage + " " + message;
  }

  /**
   * Validates the inputs and reassigns the validity object.
   *
   * @param {*} cash
   * @param {*} lowerLimit
   * @param {*} upperLimit
   * @param {*} step
   * @param {*} sigFigs
   */
  validateInput (cash, lowerLimit, upperLimit, step, sigFigs)
  {
    let newValidity = {
      validCash: true,
      validLowerlimit: true,
      validUpperLimit: true,
      validStep: true,
      validSigfigs: true
    }

    this.resetErrorMessage();                            //clears error message

    if (cash <= 0) {
      newValidity.validCash = false;
      this.appendToErrorMessage("cash must be more than 0...");
    }

    if (lowerLimit < 0) {
      newValidity.validLowerLimit = false;
      this.appendToErrorMessage("lower limit must be at least 0...");
    }

    if (upperLimit <= 0) {
      newValidity.validUpperLimit = false;
      this.appendToErrorMessage("upper limit must be more than zero...");
    }

    //
    // Prevents the lower limit from exceeding the upper limit.
    //
    if (lowerLimit > upperLimit || upperLimit < lowerLimit) {
      newValidity.validLowerLimit = false;
      this.appendToErrorMessage("lower limit exceeds upper limit...");
    }

    //
    // Having a step of negative or zero would create an inifinite number of
    // results. This prevents that from happening
    //
    if (step <= 0) {
      newValidity.validStep = false;
      this.appendToErrorMessage("step needs to be a least 1...");
    }

    //
    // Negative significant figures makes no sense.
    //
    if (sigFigs < 0) {
      newValidity.validSigFigs = false;
      this.appendToErrorMessage("invalid sig. figs....");
    }

    //
    // Limits the highest number of significant figures.
    //
    if (sigFigs > this.maxSigFigs) {
      newValidity.validSigFigs = false;
      this.appendToErrorMessage("invalid sig. figs....");
    }

    //
    // This basically restricts us from producing a predetermined number of
    // results in order to prevent slow performance or even freezing.
    //
    if (upperLimit - lowerLimit / step > this.resultsLimit) {
      newValidity.validLowerLimit = false;
      newValidity.validUpperLimit = false;
      newValidity.step = false;
      this.appendToErrorMessage("too many results, change limits or step...");
    }

    this.validity = newValidity;
  }

  /**
   * Normalizes the significant figures. Money is usually represented with two
   * decimal places.
   *
   * @param {*} sigFigs
   */
  getNormalizedSigFigs (sigFigs) { return sigFigs < 2 ? 2 : sigFigs; }

  /**
   * Returns the fixed number of shares. Due to rounding issues, it is common
   * to get the wrong number of shares, and overshoot the cash that we have on
   * hand. This function adjusts the price based on the significant figures we
   * are looking to aim for.
   *
   * @param {*} cash
   * @param {*} price
   * @param {*} sigFigs
   */
  getFixedShares(cash, price, sigFigs)
  {
    const shares = (cash / price).toFixed(sigFigs);
    const decrement = parseFloat(`1e${-sigFigs}`);

    //
    // Basically, we take the number of shares and check if its product with
    // the price is higher than the total. If it is, we decrement the least
    // significant figure until it's underneath the cash that we have.
    //
    let sharesFixed = shares;
    for (sharesFixed; sharesFixed * price > cash;
      sharesFixed = (sharesFixed - decrement).toFixed(sigFigs)) {
      // empty body...
    }

    return sharesFixed;
  }

  /**
   * Determines whether or not every single validity condition in the validity
   * object is true.
   */
  validInput ()
  {
    let valid = true;

    for (let key in this.validity) {
      if (!this.validity[key]) return false;
    }

    return valid;
  }

  /**
   * Builds a table of shares listing. Calculates the number of shares,
   * normalizes them, and formats them to be presented to the user.
   */
  buildTable ()
  {
    //
    // Grabs the state data from the props. Easier to reference and maintain.
    //
    const cash = this.props.state.cash;
    const lowerLimit = this.props.state.lowerLimit;
    const upperLimit = this.props.state.upperLimit;
    const step = this.props.state.step;
    const sigFigs = this.props.state.sigFigs;

    //
    // Validate the inputs. We should also see error messages set here.
    //
    this.validateInput(cash, lowerLimit, upperLimit, step, sigFigs);

    //
    // Check if we have a valid input from validation.
    //
    if (this.validInput()) {
      let data = [];
      const normSigFigs = this.getNormalizedSigFigs(sigFigs);
      const cashFixed = cash.toFixed(normSigFigs);

      //
      // Go through each step-up in price of shares. Prices and number of
      // shares have to be fixed here in order to account for rounding errors.
      //
      for (let price = lowerLimit; price < upperLimit; price += step) {
        const priceFixed = price.toFixed(normSigFigs);
        const sharesFixed =
          this.getFixedShares(cashFixed, priceFixed, sigFigs);
        const total = (priceFixed * sharesFixed).toFixed(normSigFigs);

        data.push({
          shares: sharesFixed,
          price: priceFixed,
          total: total
        });
      }

      //
      // Maps out the data into <p> tags. The color of each share price listing
      // alernates between white and off-white. Check App.css to see what the
      // className do. Just in case rounding errors do happen, we have a final
      // check to display share listings in red if it exceeds our cash amount.
      //
      return data.map((object, index) => {
        let className = "";

        if (object.shares * object.price > cash) {
          className = "Red";
        } else if (index % 2 !== 0) {
          className = "Off-white";
        }

        return(
          <p key={'share' + index} className={`${className} Smaller-text`}>
            {object.shares} shares @ {object.price} (total: ${object.total})
          </p>
        );
      });

    //
    // If we don't have a valid input, then we print out the error message.
    //
    } else {
      return(
        <div>
          <p>
            awaiting valid inputs...
            <br />
            <span className="Red Smaller-text">{this.errorMessage}</span>
          </p>
        </div>
      )
    }
  }

  render ()
  {
    return(
      <div>
        { this.buildTable() }
      </div>
    );
  }
}