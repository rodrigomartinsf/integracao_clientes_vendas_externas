const axios = require('axios').default

class ClienteController {

  constructor(CgcCpf, tokenAcesso) {
    this.CgcCpf = CgcCpf
    this.tokenAcesso = tokenAcesso
  }

  getCgcCpf() {
    return this.CgcCpf
  }

  getTokenAcesso() {
    return this.tokenAcesso
  }

  maskCgcCpf() {
    const valor = this.getCgcCpf()
    if (valor <= 11) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4")
  } else {
      return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5")
  }
  }

  async verificaClienteExiste() {
    try {
      const url = `https://api.alkord.com/clientes?token=${this.getTokenAcesso()}&filtros=DOCUMENTO:ig:${this.maskCgcCpf()}`
      const res = await axios.get(url)
      const response = ((res.data.TOTAL_REGISTROS > 0) ?  true : false)
      return response
  } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ClienteController