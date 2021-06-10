/* eslint-disable class-methods-use-this */
import axios from 'axios';
import url from 'url';
import crypto from 'crypto';
import fs from 'fs';
import util from 'util';

const fsexists = util.promisify(fs.exists);

import CircuitBreaker from '../lib/CircuitBreaker';

const circuitBreaker = new CircuitBreaker();

export class SpeakersService {
  serviceRegistryUrl: string;
  serviceVersionIdentifier: string;
  cache: any
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: any) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersionIdentifier = serviceVersionIdentifier;
    this.cache = {};
  }

  async getNames() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/names`,
    });
  }

  async getListShort() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list-short`,
    });
  }

  async getList() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/list`,
    });
  }

  async getAllArtwork() {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork`,
    });
  }

  async getSpeaker(shortname: string) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/speaker/${shortname}`,
    });
  }

  async getArtworkForSpeaker(shortname: string) {
    const { ip, port } = await this.getService('speakers-service');
    return this.callService({
      method: 'get',
      url: `http://${ip}:${port}/artwork/${shortname}`,
    });
  }

  async callService(requestOptions: any) {
    return circuitBreaker.callService(requestOptions);
  }

  async getService(servicename: string) {
    const response = await axios.get(`${this.serviceRegistryUrl}/find/${servicename}/${this.serviceVersionIdentifier}`);
    return response.data;
  }
}

export default SpeakersService;
