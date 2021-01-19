/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { io } from 'socket.io-client';
import game from './index'

const socket = io()

socket.on('update-game-state', (state, cards) => {
  console.log('recieved game state', state, cards)
  game.cards = cards
  game.state = state
})

socket.on('start', () => {
  game.start()
})

socket.on('win', (name) => {
  alert(name + ' wins')
  // eslint-disable-next-line no-restricted-globals
  location.reload()
})

export default socket
