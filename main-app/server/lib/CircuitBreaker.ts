/* eslint-disable max-classes-per-file */
import axios, { AxiosRequestConfig } from 'axios';

export class ServiceCallError extends Error {
  public response: any;

  constructor(err: any) {
    super('ServiceCallError');
    this.response = err.response.data;
  }
}

export class CircuitBreaker {
  private states: any;

  private failureThreshold: number;

  private cooldownPeriod: number;

  private requestTimeout: number;

  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 1;
  }

  public async callService(requestOptions: AxiosRequestConfig) {
    const endpoint = `${requestOptions.method}:${requestOptions.url}`;

    if (!this.canRequest(endpoint)) {
      throw new Error('CircuitBreaker: OPEN - Cannot request');
    }

    // eslint-disable-next-line no-param-reassign
    requestOptions.timeout = this.requestTimeout * 1000;

    try {
      const response = await axios(requestOptions);
      this.onSuccess(endpoint);
      return response.data;
    } catch (err) {
      this.onFailure(endpoint);
      throw new ServiceCallError(err);
    }
  }

  private onSuccess(endpoint: string) {
    this.initState(endpoint);
  }

  private onFailure(endpoint: string) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = 'OPEN';
      state.nextTry = Date.now() / 1000 + this.cooldownPeriod;
      console.log(`ALERT! Circuit for ${endpoint} is in state 'OPEN'`);
    }
  }

  private canRequest(endpoint: string) {
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

  private initState(endpoint: string) {
    this.states[endpoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: 'CLOSED',
      nextTry: 0
    };
  }
}

export default CircuitBreaker;
