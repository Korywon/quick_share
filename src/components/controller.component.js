import React, { Component } from 'react';
import Form from './form.component';
import Table from './table.component';

export default class Controller extends Component
{
  constructor (props)
  {
    super(props);

    this.state = {
      cash: 0,
      lowerLimit: 0,
      upperLimit: 0,
      step: 10,
      sigFigs: 1,
      rawCash: '0.00',
      rawLowerLimit: '0.00',
      rawUpperLimit: '0.00',
      rawStep: '10',
      rawSigFigs: '1'
    };

    this.handleChangeFloat = this.handleChangeFloat.bind(this);
    this.handleChangeInt = this.handleChangeInt.bind(this);
  }

  handleChangeFloat(event)
  {
    const rawValue = event.target.value;
    const name = event.target.name;
    const rawName = 'raw' + name.charAt(0).toUpperCase() + name.slice(1);

    if (rawValue === '') {
      this.setState({
        [name]: 0,
        [rawName]: ''
      });
    } else {
      const value = parseFloat(rawValue);
      if (!isNaN(rawValue) && !isNaN(value)) {
        this.setState({
          [name]: value,
          [rawName]: rawValue
        });
      }
    }
  }

  handleChangeInt(event)
  {
    const rawValue = event.target.value;
    const name = event.target.name;
    const rawName = 'raw' + name.charAt(0).toUpperCase() + name.slice(1);

    if (rawValue === '') {
      this.setState({
        [name]: 0,
        [rawName]: ''
      });
    } else {
      const value = parseInt(rawValue, 10);
      if (!isNaN(rawValue) && !isNaN(value) &&
        value.toString(10) === rawValue) {
        this.setState({
          [name]: value,
          [rawName]: rawValue
        });
      }
    }
  }

  render ()
  {
    return(
      <div>
        <Form handleChangeFloat={this.handleChangeFloat}
          handleChangeInt={this.handleChangeInt} state={this.state} />
        <br />
        <Table state={this.state} />
      </div>
    );
  }
}