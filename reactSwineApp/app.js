import React from 'react';
import ReactDOM from 'react-dom';
import '../game.css';
import Board from './components/Board';
ReactDOM.render(
  <Board />,
  // React.createElement('p',null, 'bonjour'),
  document.getElementById('root')
);
