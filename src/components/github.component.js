import React, { Component } from 'react';
import { FaGithub } from 'react-icons/fa';

export default class GitHub extends Component
{
  render ()
  {
    return(
      <>
        <a className="White" target="_blank" rel="noreferrer"
          href="https://www.github.com/korywon/quick_share">
          <FaGithub /> Korywon
        </a>
      </>
    );
  }
}
