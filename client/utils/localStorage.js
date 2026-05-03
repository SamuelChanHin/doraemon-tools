export default class LocalStorage {
  static get(key) {
    return window.localStorage.getItem(key);
  }

  static set(key, value) {
    return window.localStorage.setItem(key, value);
  }

  static del(key) {
    return window.localStorage.removeItem(key);
  }
}
