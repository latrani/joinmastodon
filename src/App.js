import React, { Component } from 'react';
import { FormGroup, FormControl, Button, InputGroup } from 'react-bootstrap';
import Select from 'react-select';
import classNames from 'classnames';
import { Element, scroller } from 'react-scroll';
import FontAwesome from 'react-fontawesome';

import 'react-select/dist/react-select.css';
import './App.css';

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' }
];

const INSTANCES = {
  small: {
    name: 'tiny.zone',
    owner: '@minifox',
    count: 23
  },
  large: {
    name: 'glowy.space',
    owner: '@glowyote',
    count: 1234
  }
};

const SCROLL_OPTIONS = {
  duration: 1000,
  delay: 100,
  smooth: true
};

class App extends Component {
  constructor () {
    super();

    this.state = {
      username: '',
      usernameChosen: false,
      language: '',
      instanceSize: '',
      selectedInstance: {}
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  handleUsernameChange (e) {
    this.setState({
      username: e.target.value
    });
  }

  handleUsernameSubmit (e) {
    e.preventDefault();
    if (this.state.username.length > 0) {
      this.setState({
        usernameChosen: true
      }, () => {
        scroller.scrollTo('usernameScrollAnchor', SCROLL_OPTIONS);
      });
    } else {
      this.setState({
        usernameChosen: false
      });
    }
  }

  handleLanguageChange (option) {
    this.setState({
      language: option
    }, () => {
      // There's some weird timing issue with react-select that makes the
      // scrolling not happen if we try it immediately.
      setTimeout(() => {
        scroller.scrollTo('languageScrollAnchor', SCROLL_OPTIONS);
      }, 0);
    });
  }

  chooseServerSize(size) {
    return () => {
      this.setState({
        instanceSize: size,
        selectedInstance: INSTANCES[size]
      }, () => {
        scroller.scrollTo('sizeScrollAnchor', SCROLL_OPTIONS);
      });
    };
  }

  render() {
    return (
      <div className="App">
        <h1>So you&apos;re curious about Mastodon&hellip;</h1>
        <p>
          Signing up for Mastodon is a bit different from what you might have
          experienced before. You have a lot more control, but that also means
          you have a bit more to think about.
        </p>
        <p>
          But we can start off easy. What username do you want?
          <Element name="usernameScrollAnchor" />
        </p>
        <form onSubmit={this.handleUsernameSubmit}>
          <FormGroup>
            <InputGroup>
              <FormControl
                type="text"
                bsSize="large"
                value={this.state.username}
                onChange={this.handleUsernameChange}
              />
              <InputGroup.Button>
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={this.handleUsernameSubmit}
                >
                  <FontAwesome name="arrow-right" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
        </form>

        <div className={classNames('reveal', { show: this.state.usernameChosen })}>
          <p>
            Great! Now it’s time to pick an instance. This part is a bit more complicated.
            An instance is, basically, the site you go to when you’re using Mastodon.
            Even though there are lots of different instances available, you can talk to folks
            on other instances, just like you can still email someone at hotmail.com even if
            your email address is at gmail.com.
          </p>
          <p>
            But unlike with email, Mastodon instances can be specialized to different countries,
            interest groups, and more. For now though, let’s keep it general.
          </p>
          <p>
            Which of these language are you most comfortable using?
            <Element name="languageScrollAnchor" />
          </p>

          <Select
            value={this.state.language}
            options={LANGUAGE_OPTIONS}
            onChange={this.handleLanguageChange}
            resetValue=""
          />

          <div className={classNames('reveal', { show: this.state.language })}>
            <p>
              We’ve found 34 instances that primarily use {this.state.language.label},
              with 43567 accounts between them. <strong>You’ll be able to talk to all those
              folks and more regardless of what instance you pick</strong>, but you&apos;ll be in
              closer contact with users on the same instance as you.
            </p>
            <Element name="sizeScrollAnchor" />
            <div className="App-server-sizes">
              <button
                className={classNames(
                  'App-server-size-choice',
                  { 'App-server-size-choice-selected': this.state.instanceSize === 'large' }
                )}
                onClick={this.chooseServerSize('large')}
              >
                I want to see as much new stuff as I can!
                Show me an instance with lots of people on it!
              </button>
              <button
                className={classNames(
                  'App-server-size-choice',
                  { 'App-server-size-choice-selected': this.state.instanceSize === 'small' }
                )}
                onClick={this.chooseServerSize('small')}
              >
                I’d like to start off someplace a bit quiet.
                Show me an instance with not very many users yet.
              </button>
            </div>
            <div className={classNames('App-selections', 'reveal', { show: this.state.instanceSize })}>
              <p>Sounds great!</p>
              <div className="App-server-size-choice-selected App-instance-info">
                <div className="App-instance-name">
                  <a href={`https://${this.state.selectedInstance.name}`}>
                    {this.state.selectedInstance.name}
                  </a>
                </div>
                <p>is an instance with {this.state.selectedInstance.count} users.</p>
                <p>
                  The admin of {this.state.selectedInstance.name} is {' '}
                  <a href={`https://${this.state.selectedInstance.name}/${this.state.selectedInstance.owner}`}>
                    {this.state.selectedInstance.owner}
                  </a>,
                  and this is what they have to say about their instance: “We’re a new small instance,
                  and we welcome anyone who’s willing to help contribute to our friendly, constructive
                  atmosphere”
                </p>
                <Button bsStyle="primary">
                  Join Mastodon as @{this.state.username}@{this.state.selectedInstance.name}
                </Button>
              </div>

              <div className="App-more-links">
                <Button bsStyle="link">
                  Show me another {this.state.instanceSize} instance
                  that mostly speaks {this.state.language.label}
                </Button>

                <div className="App-or-separator">
                  or
                </div>

                <Button bsStyle="link">
                  Back up to change my selections
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
