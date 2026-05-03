export default class Util {
  static async repeatFunc(func, time) {
    func();
    await delay(time);
    repeatFunc(func, time);
  }

  static delay(time) {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res();
      }, time);
    });
  }

  static randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  static numberToString(num) {
    if (num < 10) {
      return '0' + num;
    } else {
      return num;
    }
  }

  static copyText(text) {
    navigator.clipboard.writeText(text);
  }

  static isBase64(value) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(
      value,
    );
  }

  static getQueryString(key) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return params[key];
  }

  static getUrlQueryString(url, key) {
    const params = new Proxy(new URLSearchParams(new URL(url).search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    return params[key];
  }

  static isValidUrl(urlString) {
    try {
      return Boolean(new URL(urlString));
    } catch (e) {
      return false;
    }
  }

  static sleep = (t) => {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(true);
      }, t);
    });
  };
}
