/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
class Game {
  constructor() {
    this._name = ''
    this._room = ''
    this._cards = []
    this._selectedCards = []
    this._hasStarted = false
    this._state = undefined
  }

  get name() {
    return this._name
  }

  get room() {
    return this._room
  }

  get cards() {
    return this._cards
  }

  get selectedCards() {
    return this._selectedCards
  }

  get state() {
    return this._state
  }

  set name(name) {
    this._name = name
  }

  set room(room) {
    this._room = room
  }

  set cards(cards) {
    this._cards = cards
  }

  set selectedCards(selectedCards) {
    this._selectedCards = selectedCards
  }

  set state(state) {
    this._state = state
    this.sortCards()

    console.log('Game state reload', this)

    // render the new state
    if (!this._hasStarted) {
      // render only the player names
      const players = []

      state.playerList.forEach(player => players.push(player.name))

      renderPlayerList(this._room, this._name, players)
    } else {
      // render player names with number of cards
      const players = []
      state.playerList.forEach(player => players.push(player.name + ' - ' + player.numberOfCards))
      renderPlayerList(this._room, this._name, players)

      // render current round details
      renderCurrentRoundInfo(state.totalCentralStackSize, state.lastTurnSize, state.currentRank, state.currentRound, state.turn)

      // render the cards
      renderCards(this)
      renderCheckButton(this)
      renderTurnButton(this)

      // if it not the turn of the current player disable clicks in the cards div
      if (state.turn !== this._name) {
        document.getElementById('cards').style[ 'pointer-events' ] = 'none'
        document.getElementById('checkButton').style[ 'pointer-events' ] = 'none'
      } else {
        document.getElementById('cards').style[ 'pointer-events' ] = 'auto'

        // if first turn then disable the check button
        if (this.state.firstTurn) {
          document.getElementById('checkButton').style[ 'pointer-events' ] = 'none'
        } else {
          document.getElementById('checkButton').style[ 'pointer-events' ] = 'auto'
        }
      }
    }
  }

  start() {
    this._hasStarted = true
    // delete the form
    document.getElementById('registration').remove()

    const $roundInfo = document.createElement('div')
    $roundInfo.id = 'round-info'
    document.getElementById('root').appendChild($roundInfo)

    const $cardsDiv = document.createElement('div')
    $cardsDiv.id = 'cards'
    document.getElementById('root').appendChild($cardsDiv)
  }

  callBluff() {
    // handle bluff button clicks here
    socket.emit('call-bluff', (error) => {
      if (error) {
        alert(error)
      } else {
        this._selectedCards = []
      }
    })
  }

  endTurn() {
    // handle sending of cards and passes here
    if (this._selectedCards.length === 0) {
      socket.emit('pass', (error) => {
        if (error) {
          alert(error)
        } else {
          this._selectedCards = []
        }
      })
    } else {
      const cards = this._cards.filter(card => this.selectedCards.includes(card.id))

      if (this.state.firstTurn) {
        document.getElementById('cards').style[ 'pointer-events' ] = 'none'
        const $modal = document.getElementById('cardModal')
        $modal.style.display = 'block'

        // Adding an onClick to the submit button of the modal
        document.getElementById('modal-submit').onclick = () => {
          const rank = Array.from(document.getElementById('selectCard').options).find(option => option.selected).value

          socket.emit('turn', cards, rank, (error) => {
            if (error) {
              alert(error)
            } else {
              this._selectedCards = []
              // Removing the modal from the screen
              $modal.style.display = 'none'
            }
          })
        }
      } else {
        socket.emit('turn', cards, null, (error) => {
          if (error) {
            alert(error)
          } else {
            this._selectedCards = []
          }
        })
      }
    }
  }

  sortCards() {
    const suitIndex = {
      spades: 0,
      clubs: 1,
      hearts: 2,
      diamonds: 3
    }

    const rankIndex = {
      'A': 0,
      '2': 1,
      '3': 2,
      '4': 3,
      '5': 4,
      '6': 5,
      '7': 6,
      '8': 7,
      '9': 8,
      '10': 9,
      'J': 10,
      'Q': 11,
      'K': 12
    }

    this.cards.sort(function (a, b) {
      if (rankIndex[ a.rank.shortName ] < rankIndex[ b.rank.shortName ] || (rankIndex[ a.rank.shortName ] === rankIndex[ b.rank.shortName ] && suitIndex[ a.suit.name ] < suitIndex[ b.suit.name ])) {
        return -1
      }
      return 1
    })
  }
}

export default Game;
