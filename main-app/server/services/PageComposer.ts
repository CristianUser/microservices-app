/* eslint-disable class-methods-use-this */
import { glob } from 'glob';
import { promisify } from 'util';
import path from 'path';
import { IConfig } from '../config';
import { BaseService } from './Base';

const globAsync = promisify(glob);

export default class PageComposer extends BaseService {
  constructor({ serviceRegistryUrl, serviceVersionIdentifier }: IConfig) {
    super({ serviceRegistryUrl, serviceVersionIdentifier });
  }

  async getPages() {
    const jsonFiles = await globAsync('server/forms/**/page.json');
    const pages = await Promise.all(
      jsonFiles.map(async (filepath) => {
        const jsonContent = await import(path.resolve(filepath)).then((file) => file.default);
        const uiSchema = await import(
          path.resolve(filepath.replace('page.json', 'uischema.json'))
        ).then((file) => file.default);

        jsonContent.props.uiSchema = uiSchema;
        return jsonContent;
      })
    );

    return pages;
  }
}
