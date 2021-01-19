/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const socket = io()

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
  register(game)

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
    location.reload()
  })
})
