import _ from 'lodash';
import { DataTextProp } from './interfaces';

export function resolveDataText(text: DataTextProp, data: any) {
  return text.dynamic ? _.get(data, text.value, text.value) : text.value || text;
}

export function resolvePath(path: string, data: any) {
  const TOKEN_REGEX = /\{[a-zA-Z0-9_.\-/]+\}/;
  const value = path.match(TOKEN_REGEX)?.[0].replace('{', '').replace('}', '');

  return value ? path.replace(TOKEN_REGEX, _.get(data, value, path)) : path;
}
