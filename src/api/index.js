export class Api {
  constructor() {
    // this.jwt=jwt;
  }

  async sign_in(value) {
    localStorage.removeItem('jwt');
    localStorage.setItem('jwt', value);
  }

  async connect(value) {
    return localStorage.getItem('jwt', value);
  }
}
