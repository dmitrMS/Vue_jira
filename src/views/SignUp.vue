
<template>
    <body>
    <h1>{{ title }}</h1>
    <div class="auth">
    <p>login:</p>
    <input type="text">
  </div>
  <div class="auth">
    <p> password:</p>
    <input type="text">
  </div><br>
    <div class="txt">
    <button>Sign up</button><br>
  <router-link to="/components/SignIn.vue">I already have account</router-link>
     </div>
    </body>
  </template>
  
  <script>
  export default {
    // data() {
    //   return {
    //     title: 'Please sing up'
    //   }
    // }
    name: "SignUp"
  }
  </script>
  
  <style>
  html {
    background-color: #7ab7f0d7;
  }
  body {
    margin: 0 0;
    text-align: center;
    font-style: italic;
    line-height: 5;
    transform: translate(0%, 15%);
  }
  input
  {
    background-color: #7ab7f000;
    border: 0px solid;
    border-bottom: 2px solid #000000;
    width: 200px;
    opacity: 100%;
  }
  a
  {
    color: #000000d7;
    font-size: 16pt;
  }
  button
  {
    background-color: #2e78bdd7;
    color: #ffffffd7;
    border: 0px solid;
    width: 200px;
    height: 60px;
    font-size: 16pt;
    font-weight: normal;
    border-radius: 30px;
  }
  h1
  {
    font-weight: normal;
    
  }
  .txt
  {
    line-height: 2;
  }
  .auth
  {
    
    font-size: 16pt;
    line-height: 0;
  }
  </style>
  