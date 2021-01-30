import React, { Component } from 'react';
import { BiUpArrowAlt, BiDownArrowAlt } from 'react-icons/bi';
import { FaCalculator, FaMoneyBill } from 'react-icons/fa';
import { BsBarChartFill } from 'react-icons/bs';

export default class Form extends Component
{
  render ()
  {
    return(
      <div>
        <label htmlFor="cash"><FaMoneyBill /> cash</label>
        <br />
        <input type="text" id="cash" name="cash"
          value={this.props.state.rawCash}
          onChange={this.props.handleChangeFloat} />
        <br />
        <br />
        <label htmlFor="lowerLimit">
          <BiDownArrowAlt /> lower limit
        </label>
        <br />
        <input type="text" id="lowerLimit" name="lowerLimit"
          value={this.props.state.rawLowerLimit}
          onChange={this.props.handleChangeFloat} />
        <br />
        <br />
        <label htmlFor="upperLimit">
          <BiUpArrowAlt /> upper limit
        </label>
        <br />
        <input type="text" id="upperLimit" name="upperLimit"
          value={this.props.state.rawUpperLimit}
          onChange={this.props.handleChangeFloat} />
        <br />
        <br />
        <label htmlFor="step">
          <BsBarChartFill /> step
        </label>
        <br />
        <input type="text" id="step" name="step"
          value={this.props.state.rawStep}
          onChange={this.props.handleChangeFloat} />
        <br />
        <br />
        <label htmlFor="sigFigs">
          <FaCalculator /> sig. figs.
        </label>
        <br />
        <input type="text" id="sigFigs" name="sigFigs"
          value={this.props.state.rawSigFigs}
          onChange={this.props.handleChangeInt} />
      </div>
    );
  }
}