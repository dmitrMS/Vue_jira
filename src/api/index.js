export class Api {
    constructor() {}
  
    async sign_in(value) {
      localStorage.removeItem('jwt');
      localStorage.setItem('jwt', value);
      return localStorage.getItem('jwt');
    }
     
    async logout() {
      localStorage.removeItem('jwt');
    }
  
    async connect() {
      return localStorage.getItem('jwt');
    }
  }