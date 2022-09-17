const axios = require('axios').default

class ClienteServiceController {

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

  async update(novoCliente) {
    const url = `https://api.alkord.com/pessoas/${novoCliente.getCodigoVendasExternas()}?token=${this.getTokenAcesso()}`
    let data = {}
    data['NOME'] = novoCliente.getRazaoSocial()
    data['APELIDO']         = novoCliente.getNomeParceiro().substr(0,30)
    data['TIPO_PESSOA']     = novoCliente.getTipoPessoa()
    data['RELACIONAMENTOS'] = {'RELACIONAMENTO': novoCliente.getIdTabelaPreco()}
    data['SITUACAO']        = novoCliente.getAtivo() == 'S' ?  'A' : 'I'
    data['RESTRICAO']       = ''
    data['DOCUMENTO']       = novoCliente.getCgcCpf()
    data['DOCUMENTO2']      = novoCliente.getInscricaoEstadual() == undefined ? 'ISENTO' : novoCliente.getInscricaoEstadual()
    data['INTERNET']        = ''
    data['ESTADO_CIVIL']    = 'S' 
    data['NASCIMENTO_CONSTITUICAO'] = novoCliente.getDataNascimento() == undefined ? '2022-01-01' : novoCliente.getDataNascimento()
    data['COMERCIAL_VENDA'] = {'REPRESENTANTE': novoCliente.getRotaId(), 
                               'MEIO_PAGAMENTO': novoCliente.getIdFormaPagamento(), 
                               'CONDICAO_PAGAMENTO': novoCliente.getIdCondicaoPagamento(), 
                               'SITUACAO_CADASTRO': novoCliente.getAtivo() == 'S' ?  1 : 3, 
                               'PERFIL': novoCliente.getBloquear() == 'N' ?  1 : 2,
                               'PERFIL_RESTRICAO': 1 }
    data['ENDERECOS']       = [{'TIPO': 'R', 
                               'PRINCIPAL': 'S', 
                               'CEP': novoCliente.getCep(), 
                               'ENDERECO': novoCliente.getEndereco(), 
                               'NUMERO': novoCliente.getNumero(),
                               'COMPLEMENTO': novoCliente.getComplemento(), 
                               'BAIRRO': novoCliente.getBairro(), 
                               'CIDADE': {'NOME': 'Manaus'}, 
                               'ESTADO': {'SIGLA': 'AM'}, 
                               'PAIS': {'NOME': 'BRASIL'}, 
                               'CAIXA_POSTAL': '', 
                               'DESCRICAO': '', 
                               'CONTATO_ALTERNATIVO': '',
                               'POSICIONAMENTO_LATITUDE': novoCliente.getLatitude() == null ? '' : novoCliente.getLatitude(), 
                               'POSICIONAMENTO_LONGITUDE': novoCliente.getLongitude() == null ? '' : novoCliente.getLongitude(), 
                             }]

    try {
      const res = await axios.put(url, data)
      console.log('Cliente atualizado')
    } catch (error) {
       console.log(error)
    }                        
  }

  async insert(novoCliente) {
    const url = `https://api.alkord.com/clientes?token=${this.getTokenAcesso()}`
    let data = {}
    data['NOME'] = novoCliente.getRazaoSocial()
    data['APELIDO']         = novoCliente.getNomeParceiro().substr(0,30)
    data['TIPO_PESSOA']     = novoCliente.getTipoPessoa()
    data['RELACIONAMENTOS'] = {'RELACIONAMENTO': novoCliente.getIdTabelaPreco()}
    data['SITUACAO']        = novoCliente.getAtivo() == 'S' ?  'A' : 'I'
    data['RESTRICAO']       = ''
    data['DOCUMENTO']       = novoCliente.getCgcCpf()
    data['DOCUMENTO2']      = novoCliente.getInscricaoEstadual() == undefined ? 'ISENTO' : novoCliente.getInscricaoEstadual()
    data['INTERNET']        = ''
    data['ESTADO_CIVIL']    = 'S' 
    data['NASCIMENTO_CONSTITUICAO'] = novoCliente.getDataNascimento() == undefined ? '2022-01-01' : novoCliente.getDataNascimento()
    data['COMERCIAL_VENDA'] = {'REPRESENTANTE': novoCliente.getRotaId(), 
                               'MEIO_PAGAMENTO': novoCliente.getIdFormaPagamento(), 
                               'CONDICAO_PAGAMENTO': novoCliente.getIdCondicaoPagamento(), 
                               'SITUACAO_CADASTRO': novoCliente.getAtivo() == 'S' ?  1 : 3, 
                               'PERFIL': novoCliente.getBloquear() == 'N' ?  1 : 2,
                               'PERFIL_RESTRICAO': 1 }
    data['ENDERECOS']       = [{'TIPO': 'R', 
                               'PRINCIPAL': 'S', 
                               'CEP': novoCliente.getCep(), 
                               'ENDERECO': novoCliente.getEndereco(), 
                               'NUMERO': novoCliente.getNumero(),
                               'COMPLEMENTO': novoCliente.getComplemento(), 
                               'BAIRRO': novoCliente.getBairro(), 
                               'CIDADE': {'NOME': 'Manaus'}, 
                               'ESTADO': {'SIGLA': 'AM'}, 
                               'PAIS': {'NOME': 'BRASIL'}, 
                               'CAIXA_POSTAL': '', 
                               'DESCRICAO': '', 
                               'CONTATO_ALTERNATIVO': '',
                               'POSICIONAMENTO_LATITUDE': novoCliente.getLatitude() == null ? '' : novoCliente.getLatitude(), 
                               'POSICIONAMENTO_LONGITUDE': novoCliente.getLongitude() == null ? '' : novoCliente.getLongitude(), 
                             }]

    try {
      const res = await axios.post(url, data)
      //console.log(res.data.REFERENCIAS.CODIGO)
      return res.data.REFERENCIAS.CODIGO
    } catch (error) {
      console.log(error)
    }                   
  }
}

module.exports = ClienteServiceController