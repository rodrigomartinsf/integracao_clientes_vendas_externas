const AuthController = require('./AuthController')
const ClienteController = require('./ClienteController')
const db = require('../models')

class AppController {

  constructor() {
    this.tokenAcesso = null
    this.start()
  }

  getTokenAcesso() {
    return this.tokenAcesso
  }

  setTokenAcesso(newValue) {
    this.tokenAcesso = newValue
  }

  async start() {
    const auth = new AuthController()
    await auth.logon()
    const tokenAcesso = auth.getTokenAcesso()
    this.setTokenAcesso(tokenAcesso)
    this.getClientesFromDatabase()
  }

  async getClientesFromDatabase() {
    const clientesFromDb = await db.clientes.findAll()
    //Percorre a lista de clientes do banco de dados
    for (let i = 0; i < clientesFromDb.length; i++) {
      //Para cada cliente encontrado no banco de dados verificamos se ele ja existe no vendas externas
      let tokenAcesso = this.getTokenAcesso()
      const clienteFromApi = new ClienteController(clientesFromDb[i].cgc_cpf, tokenAcesso)
      const clienteExiste = await clienteFromApi.verificaClienteExiste()

      //Busca os dados do tipo de negociação do cliente
      const tipoNegociacao = await db.tipo_negociacao.findOne({
        where: {
          id_forma_pagamento_sankhya: clientesFromDb[i].prazo
        }
      })
      
      //Busca os a Rota do cliente
      const rota = await db.rotas.findOne({
        where: {
          id_rota_sankhya: clientesFromDb[i].rota
        }
      })
      console.log(clientesFromDb[i].nome_parceiro, clienteExiste, tipoNegociacao.forma_pag_desc, rota.rota_desc)
    }
  }

}

module.exports = AppController