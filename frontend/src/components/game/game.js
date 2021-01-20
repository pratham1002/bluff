import React from 'react';
import socket from '../../play'

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.name,
      room: props.room,
      players: [],
      cards: [],
      selectedCards: [],
      hasStarted: false,
      totalCentralStackSize: 0,
      lastTurnSize: 0,
      currentRank: null,
      currentRound: [],
      turn: null
    };

    socket.on('update-game-state', (s, cards) => {
      console.log('recieved game state', s, cards)
      this.setState({
        cards: cards,
        players: s.playerList,
        totalCentralStackSize: s.totalCentralStackSize,
        lastTurnSize: s.lastTurnSize,
        currentRank: s.currentRank,
        currentRound: s.currentRound,
        turn: s.turn
      });
    });

    socket.on('start', () => {
      console.log('start call')
      this.setState({
        hasStarted: true
      })
    })
  }

  render() {
    if (!this.state.hasStarted) {
      return (
        <ul>
          {
            this.state.players.map(item => (
              <li key={item.name}>{item.name}</li>
            ))}
        </ul>
      );
    } else {
      return (
        <div>
          <div id="player-list">
            <h3>{this.state.room}-{this.state.name}</h3>
            <ul>
              {
                this.state.players.map(item => (
                  <li key={item.name}>{item.name}-{item.numberOfCards}</li>
                ))}
            </ul>
          </div>
          <div id="round-info">
            Central Stack: {this.state.centralStackSize} ({this.state.centralStackLast})<br />
                            rank: {this.state.currentRank || 'first turn'}<br />
                            turn: {this.state.turn}
            {/* <ol>
              {
                this.state.currentRound.map(item => (
                  <li key={item}>{item}</li>
                ))}
            </ol> */}
          </div>
        </div>
      )
    }
  }
}

export default Game;
