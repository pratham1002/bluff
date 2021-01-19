import React from 'react';
import styles from './form.module.css';
import game from '../../index'
import socket from '../../play'

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: `Choose your username and room name. Ensure you enter same room name as the person you are playing with.`,
      button: 'Play!',
      name: '',
      room: '',
      playClicked: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this)
  }

  handleNameChange(event) {
    this.setState({
      name: event.target.value
    })
  }

  handleRoomChange(event) {
    this.setState({
      room: event.target.value
    })
  }

  async handleSubmit(event) {
    if (!this.state.playClicked) {
      event.preventDefault();

      game.name = this.state.name.trim().toLowerCase()
      game.room = this.state.room.trim().toLowerCase()

      await socket.emit('join', game.name, game.room, (error) => {
        if (error) {
          alert(error)
        } else {
          this.setState({
            button: 'Start',
            playClicked: true
          })
        }
      })
    } else {
      console.log('start')
      event.preventDefault();
      await socket.emit('start')
    }
  }

  render() {
    return (
      <div id="registration">
        <p> {this.state.description} </p>
        <form id="registration-form" onSubmit={this.handleSubmit}>
          Username:
          <input
            onChange={this.handleNameChange}
            type="text" 
            placeholder="Enter username" 
            name="username" 
            required="true"
          />
          Room name:
          <input
            onChange={this.handleRoomChange}
            type="text" 
            placeholder="Enter room name" 
            name="room" 
            required="true"
          />
          <button type="submit">
            {this.state.button}
          </button>
        </form>
      </div>
    )
  }
}

export default Form;
