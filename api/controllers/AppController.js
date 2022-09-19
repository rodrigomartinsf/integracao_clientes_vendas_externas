const AuthServiceController = require('./AuthServiceController')
const ClienteServiceController = require('./ClienteServiceController')
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
    const auth = new AuthServiceController()
    await auth.logon()
    const tokenAcesso = auth.getTokenAcesso()
    this.setTokenAcesso(tokenAcesso)
    const clientesFromDb = await this.getClientesFromDatabase()
    this.sendClientesToApi(clientesFromDb)
  }

  async getClientesFromDatabase() {
    const clientesFromDb = await db.clientes.findAll()
    return clientesFromDb
  }

  async sendClientesToApi(clientesFromDb) {
    try {
      //Percorre a lista de clientes do banco de dados
      for (let i = 0; i < clientesFromDb.length; i++) {
        //Para cada cliente encontrado no banco de dados verificamos se ele ja existe no vendas externas
        let tokenAcesso = this.getTokenAcesso()
        const clienteFromApi = new ClienteServiceController(clientesFromDb[i].cgc_cpf, tokenAcesso)
        const clienteExiste = await clienteFromApi.verificaClienteExiste()
        const novoCliente = new ClienteController(clientesFromDb[i].codigo_parceiro, clientesFromDb[i].razao_social, clientesFromDb[i].nome_parceiro, clientesFromDb[i].tipo_pessoa, 
          clientesFromDb[i].cgc_cpf, clientesFromDb[i].inscricao_estadual, clientesFromDb[i].data_nascimento, clientesFromDb[i].rotaId, 
          clientesFromDb[i].prazo, clientesFromDb[i].cep, clientesFromDb[i].complemento, clientesFromDb[i].bairro, clientesFromDb[i].cidade, 
          clientesFromDb[i].tabela_preco, clientesFromDb[i].bloquear, clientesFromDb[i].ativo, clientesFromDb[i].endereco, clientesFromDb[i].numero, 
          clientesFromDb[i].latitude, clientesFromDb[i].longitude, clientesFromDb[i].codigo_ve)

        //Atualiza dados
        const rotaVendasExternas = await db.rotas.findOne({where: {id_rota_sankhya: novoCliente.getRotaId()}})
        const tipoNegociacaoVendasExternas = await db.tipo_negociacao.findOne({where: {id_forma_pagamento_sankhya: novoCliente.getPrazo()}})
        const tabelaPrecoVendasExternas = await db.tabela_preco.findOne({where: {id_tabela_preco_sankhya: novoCliente.getTabelaPreco()}})
        novoCliente.setRotaVendasExternas(rotaVendasExternas.id_rota_ve)
        novoCliente.setIdFormaPagamento(tipoNegociacaoVendasExternas.id_forma_pagamento_ve)
        novoCliente.setIdCondicaoPagamento(tipoNegociacaoVendasExternas.id_condicao_pagamento_ve)
        novoCliente.setIdTabelaPreco(tabelaPrecoVendasExternas.id_tabela_preco_ve)

        //Verifica se o cliente existe
        if(clienteExiste){
          // Atualiza
          console.log('ATUALIZANDO', novoCliente.getNomeParceiro())
          clienteFromApi.update(novoCliente)
        }
        else{
          console.log('CADASTRANDO', novoCliente.getNomeParceiro())
          //Cadastra
          const idClienteCadastrado = await clienteFromApi.insert(novoCliente)
          novoCliente.setCodigoVendasExternas(idClienteCadastrado)
          await db.clientes.update(novoCliente, {where: {codigo_parceiro: novoCliente.getCodigoParceiro()}})
        }
      }
    } catch (error) {
      console.log(error)
    }
    
  }

}

module.exports = AppController