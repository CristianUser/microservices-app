import axios from 'axios';

export class CircuitBreaker {
  states: any;
  failureThreshold: number;
  cooldownPeriod: number;
  requestTimeout: number;
  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 1;
  }

  async callService(requestOptions: any) {
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    if (!this.canRequest(endpoint)) return false;

    // eslint-disable-next-line no-param-reassign
    requestOptions.timeout = this.requestTimeout * 1000;

    try {
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch (err) {
      this.onFailure(endpoint);
      return false;
    }
  }

  onSuccess(endpoint: string) {
    this.initState(endpoint);
  }

  onFailure(endpoint: string) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = 'OPEN';
      state.nextTry = Date.now() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  canRequest(endpoint: string) {
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    if (state.circuit === 'CLOSED') return true;
    const now = Date.now() / 1000;
    if (state.nextTry <= now) {
      state.circuit = 'HALF';
      return true;
    }
    return false;
  }

  initState(endpoint: string) {
    this.states[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: 'CLOSED',
      nextTry: 0
    };
  }
}

export default CircuitBreaker;
