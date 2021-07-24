/* eslint-disable no-param-reassign */
import _ from 'lodash';
import path from 'path';
import { IConfig } from '../config';
import { BaseService } from './Base';

export interface GetDocsResult<T> {
  rows: T[];
  count: number;
}

export interface MappedDoc {
  title: string;
  const: any;
}

export interface TemplateMatch {
  path: string;
  token: string;
}

function mapResults(result: GetDocsResult<any>): MappedDoc[] {
  return result.rows.map((row) => ({
    title: row.name,
    const: row.id
  }));
}

function findReferences(schema: any) {
  const TOKEN_REGEX = /^\{\{resolve:[a-zA-Z0-9_.\-/]+:.+\}\}$/;
  const references: TemplateMatch[] = [];
  const checkKeys = (input: any, lastPath = '') => {
    Object.entries(input).forEach(([key, value]) => {
      const currentPath = _.compact([lastPath, key]).join('.');

      if (typeof value === 'string') {
        if (TOKEN_REGEX.test(value)) {
          references.push({ path: currentPath, token: value });
        }
      } else if (typeof value === 'object') {
        checkKeys(value, currentPath);
      }
    });
  };

  checkKeys(schema);

  return references;
}

function loadFile(filePath: string) {
  return import(path.resolve(`server${filePath}`)).then((file) => _.cloneDeep(file?.default));
}

export default class FormComposer extends BaseService {
  private cache: Record<string, any>;

  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier });
    this.cache = {};
  }

  async getDocs(
    serviceName: string,
    routePrefix: string,
    filter?: Record<string, any>
  ): Promise<GetDocsResult<any>> {
    const service = await this.getService(serviceName);
    const cacheKey = [serviceName, routePrefix, JSON.stringify(filter)].join();

    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }
    // eslint-disable-next-line no-return-assign
    return (this.cache[cacheKey] = this.callService({
      method: 'get',
      url: this.buildUrl(service, routePrefix),
      params: { match: { status: 'active', ...filter }, limit: -1 }
    }));
  }

  getMappedDocs(
    serviceName: string,
    routePrefix: string,
    filter?: Record<string, any>
  ): Promise<MappedDoc[]> {
    const fallback = (mappedResults: MappedDoc[]) =>
      mappedResults.length ? mappedResults : [{ const: '', title: '' }];
    return this.getDocs(serviceName, routePrefix, filter).then(mapResults).then(fallback);
  }

  resolveToken(token: string, query: URLSearchParams) {
    const [, service, entity] = token.replace('{{', '').replace('}}', '').split(':');
    const [endpoint, filterCfg] = entity.split('?');
    const filters = filterCfg?.split(',') || [];
    const matchFilter: any = filters.reduce<any>((prev, filter: string) => {
      const value = query.get(filter);

      if (value) {
        prev[filter] = value;
      }
      return prev;
    }, {});

    return this.getMappedDocs(service, `/${endpoint}`, matchFilter);
  }

  resolveReferences(references: TemplateMatch[], schema: any, query: URLSearchParams) {
    return Promise.all(
      references.map((match) =>
        this.resolveToken(match.token, query).then((values) => {
          _.set(schema, match.path, values);
        })
      )
    );
  }

  async buildSchema(url: string) {
    const [schema, queryString] = url.split('?');
    const query = new URLSearchParams(queryString);
    const schemaFile = await loadFile(schema);
    const foundReferences = findReferences(schemaFile);

    await this.resolveReferences(foundReferences, schemaFile, query);
    this.cache = {};

    return schemaFile;
  }
}
