import React, {Component} from 'react';
import logo from '../css/logo.svg';
import '../css/App.css';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Deck from './Deck';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super();

    this.state = {
      deckId: null,
      deck: {}
    }
  }

  async componentDidMount() {
    const { cookies } = this.props;

    //  Some of this needs to be sequenced, so we'll need to use async/await here
    //  https://www.valentinog.com/blog/await-react/

    if ( cookies.get('savedDeck') == null ) {
      //  No saved cookie, so lets create a new deck
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');
      const json = await response.json();
      cookies.set('savedDeck', json.deck_id );
    } else {
      //  We have a cookies with a deck id, so shuffle it
      const url = "https://deckofcardsapi.com/api/deck/" + cookies.get('savedDeck') + "/shuffle/"

      const response = await fetch( url );
      const json = await response.json();
      this.setState({ deck: json });
    }

    //  Now that we have the deck, lets load the cards
    const urlCards = "https://deckofcardsapi.com/api/deck/" + cookies.get('savedDeck') + "/draw/?count=312"
    fetch( urlCards )
      .then( results => results.json() )
      .then( results => {
        //  Trim out some of the extra data
        const cards = results.cards.map( card => {
          let newCard = {
            value: card.value,
            suit: card.suit,
            code: card.code
          }
          return newCard;
        });

        this.setState({ deck: cards });
      })

    this.setState({ deckId: cookies.get('savedDeck') });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React With Michael!
            {this.state.deckId}
          </a>
        </header>
        <Deck singleDeck={this.state.deck} />
      </div>
    );
  }
}

export default withCookies(App);
