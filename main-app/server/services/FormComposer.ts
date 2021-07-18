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
  const TOKEN_REGEX = /^\{\{resolve:[a-zA-Z0-9_.\-/]+:[a-zA-Z0-9_.\-/]+\}\}$/;
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
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier });
  }

  async getDocs(serviceName: string, routePrefix: string): Promise<GetDocsResult<any>> {
    const service = await this.getService(serviceName);
    return this.callService({
      method: 'get',
      url: this.buildUrl(service, routePrefix),
      params: { match: { status: 'active' }, limit: -1 }
    });
  }

  getMappedDocs(serviceName: string, routePrefix: string): Promise<MappedDoc[]> {
    const fallback = (mappedResults: MappedDoc[]) =>
      mappedResults.length ? mappedResults : [{ const: '', title: '' }];
    return this.getDocs(serviceName, routePrefix).then(mapResults).then(fallback);
  }

  resolveToken(token: string) {
    const [, service, endpoint] = token.replace('{{', '').replace('}}', '').split(':');

    return this.getMappedDocs(service, `/${endpoint}`);
  }

  resolveReferences(references: TemplateMatch[], schema: any) {
    return Promise.all(
      references.map((match) =>
        this.resolveToken(match.token).then((values) => {
          _.set(schema, match.path, values);
        })
      )
    );
  }

  async buildSchema(schema: string) {
    const schemaFile = await loadFile(schema);
    const foundReferences = findReferences(schemaFile);
    await this.resolveReferences(foundReferences, schemaFile);

    return schemaFile;
  }
}
