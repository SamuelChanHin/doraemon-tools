import HttpRequest from './apiClient.js';

export default class Doraemon {
  static async getDoraemonTools(params) {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/tool`, { params });
  }

  static async getDoraemonToolById(id) {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/tool/${id}`);
  }

  static async getDoraemonToolCount() {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/tool/count`);
  }

  static async getDoraemonToolByRandom() {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/tool/random`);
  }

  static async getDoraemonMovies(params) {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/movie`, { params });
  }

  static async getDoraemonMovieById(id) {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/movie/${id}`);
  }

  static async getDoraemonMovieCount() {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/movie/count`);
  }

  static async getDoraemonMovieByRandom() {
    const httpRequest = new HttpRequest();
    return await httpRequest.apiClient.get(`/doraemon/movie/random`);
  }
}
