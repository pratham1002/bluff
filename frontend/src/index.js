import React from 'react';
import ReactDOM from 'react-dom';
import Form from './components/form/form'
import Game from './Game'

const game = new Game();

ReactDOM.render(<Form/>, document.getElementById('root'));

export default game;
