export default class HttpRequest {
  apiClient;

  constructor() {
    this.apiClient = axios.create({
      timeout: 1000,
    });
  }
}
