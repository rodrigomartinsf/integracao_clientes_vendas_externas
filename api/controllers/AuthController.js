const axios = require('axios').default

class AuthController {

  constructor() {
    this.user = process.env.VE_USER
    this.password = process.env.VE_PASSWORD
    this.tokenAcesso = null
    this.tokenRenovacao = null
    this.url = process.env.VE_URL_LOGIN
  }

  getTokenAcesso(){
    return this.tokenAcesso
  }

  getTokenRenovacao(){
    return this.tokenRenovacao
  }

  getUrl(){
    return this.url
  }

  getUser(){
    return this.user
  }

  getPassword(){
    return this.password
  }

  setTokenAcesso(newValue){
    this.tokenAcesso = newValue
  }
  
  setTokenRenovacao(newValue){
    this.tokenRenovacao = newValue
  }

  logon = async () => {
    try {
      const res = await axios.post(this.getUrl(), null, { 
        auth: {
          username: this.getUser(),
          password: this.getPassword()
        }
      })
      this.setTokenAcesso(res.data.token_acesso)
      this.setTokenRenovacao(res.data.token_renovacao)
    } catch (error) {
      console.log('Erro ao Autenticar na API do Vendas Externas')
    }
  }

}

module.exports = AuthController