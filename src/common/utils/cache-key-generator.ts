/**
 * eg.
 * input
 * {
 *  skip:1,
 *  take:10,
 *  orderBy:"createdAt",
 *  id:1
 * }
 *
 * output
 * "id=1&orderBy=createdAt&skip=1&take=10"
 */

function unorderObjectToOrderString(obj) {
  let strResult = '';
  Object.keys(obj)
    .sort()
    .forEach((key, index, arr) => {
      strResult += `${key}=${obj[key]}`;
      if (index !== arr.length - 1) {
        strResult += '&';
      }
    });
  return strResult;
}

export type Option = {
  query?: Record<string, string>;
  body?: Record<string, string>;
  language?: 'en' | 'tc';
};

export function cacheKeyGenerator(pathname: string, option: Option) {
  let query = unorderObjectToOrderString(option.query);
  let body = unorderObjectToOrderString(option.body);
  const language = option.language ? `#${option.language}` : '';

  query = query ? `?${query}` : '';
  body = body ? `//${body}` : '';

  return pathname + query + body + language;
}
