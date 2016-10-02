class InitialState {

  state;

  get() {
    return this.state;
  }

  set(state) {
    this.state = state;
  }
}

export default new InitialState();
