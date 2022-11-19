import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

function Contas() {

  // API da base de dados principal e objeto
  const apiURL = "https://ironrest.herokuapp.com/mContas";

  // Matriz de dados carregada da base de dados
  const [mContas, setContas] = useState([]);
  // Está carregando dados da Internet?
  const [isLoading, setIsLoading] = useState(true);
  // Variável que guarda a string de busca "pesquisa"
  const [search, setSearch] = useState("");
  // Matriz que guarda os dados do Form (pega os dados INCLUSÃO e ALTERAÇÃO)
  const [form, setForm] = useState([]);
  // Variável que guarda o Status do FORM ativo (se é INCLUSÃO ou ALTERAÇÃO)
  const [statusAlt, setStatusAlt] = useState(false);

  // Variável que guarda o Status da JANELA MODAL (se está visível ou não)
  const [show, setShow] = useState(false);
  // Função que Fecha a JANELA MODAL e desativa STATUS de eventual FORM de Alteração
  const handleClose = () => { setShow(false); setStatusAlt(false); };
  // Função que Abre a JANELA MODAL
  const handleShow  = () => setShow(true);

  // Faz com que a função de Leitura dos dados só aconteça na primeira vez que o código for executado
  useEffect(() => {
    lerContas()
  }, [])  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerContas = () => {
    try {
      const fetchContas = async () => {
          const response = await axios.get(apiURL)
          setContas(response.data)
          setIsLoading(false)
      }
      fetchContas()
    } catch (error) {
      console.log(error)
    }
  }

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({ reduzido: "", estrutural: "", descricao: "", nivel: 0, unidade: "" });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo usuário
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraConta = (id) => {
    try {
      setIsLoading(true)
      const fetchContas = async () => {
          const response = await axios.get(`${apiURL}/${id}`)
          setForm({
            reduzido: response.data.reduzido, estrutural: response.data.estrutural, 
            descricao: response.data.descricao, nivel: response.data.nivel, 
            _id: response.data._id, unidade: response.data.unidade
          });
          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchContas()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo usuário
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteConta = (id) => {
    try {
      setIsLoading(true)
      const fetchContas = async () => {
          await axios.delete(`${apiURL}/${id}`)
          lerContas()
      }
      fetchContas()
    } catch (error) {
      console.log(error)
    }
  }

  // executa cada vez que uma tecla é pressionada em um formulário (alteração ou inclusão)
  // copia o novo conteúdo do campo respectivo (já com essa nova tecla) para o respectivo
  // campo na matriz "form"
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  // executa a cada vez que um campo do formulário perder o foco
  // objetivos: verificar a validade, ajustar o campo
  const handleBlur = (e) => {
  }

  // dispara quando o usuário clica em "GRAVAR" no Formulário (alteração ou inclusão)
  // grava o conteúdo ma matriz "form" na base de dados da internet
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  // Fecha a JANELA MODAL do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        if ( statusAlt ) {
          const clone = { ...form }
          delete clone._id
          await axios.put(`${apiURL}/${form._id}`, clone)
        } else {
          await axios.post(apiURL, form)
        }        
        lerContas()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderContas"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderContas = mContas
  .filter((conta) => conta.descricao.toLowerCase().includes(search.toLowerCase()))
  .map((conta) => {
      return (
          <tr key={conta._id}>
              <td>{conta.reduzido}</td>
              <td>{conta.estrutural}</td>
              <td>{conta.nivel}</td>
              <td>{conta.descricao}</td>
              <td> <Button variant="primary" onClick={ (event) => { alteraConta(conta._id) } }>Alterar</Button> </td>
              <td> <Button variant="danger" onClick={ (event) => { deleteConta(conta._id) } }>Excluir</Button> </td>
          </tr>
      )
  })  

  return (

    <div className="Contas">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            <Form className="my-4">
                <Form.Control
                    type="search" placeholder="Procurar conta"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
                />
            </Form>

            {/* Mostra o Botão que permite ABRIR o FORMULÁRIO para Adicionar um REGISTRO NOVO */}
            <Button variant="primary" onClick={ preparaFormNova }>
                Nova Conta
            </Button>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar conta</p> }
                      { !statusAlt && <p>Nova conta</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Codigo Reduzido:</Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o código reduzido da conta"
                                name="reduzido" value={form.reduzido} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Codigo Estrutural:</Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o código estrutural da conta"
                                name="estrutural" value={form.estrutural} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Nível:</Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o nível da conta"
                                name="nivel" value={form.nivel} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Descrição:</Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira a descrição da conta"
                                name="descricao" value={form.descricao} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <div className="text-center">
                          <Button style={{width: "70%"}} variant="success" type="submit">GRAVAR</Button>
                        </div>

                    </Form>
                 </Modal.Body>

            </Modal>

            {/* Apresenta OU não o componente que indica "carregando dados..." */}
            {isLoading && <Spinner className="" animation="border" />}

            {/* Se não está carregando os DADOS então já mostra na tela (em formato de tabela) */}
            {/* A origem dos dados é a variável render????? construída acima */}
            {!isLoading &&
                <Table className="mt-4" striped bordered hover>
                    <thead>
                        <tr>
                            <th>C.Reduzido</th>
                            <th>C.Estrutural</th>
                            <th>Nivel</th>                                                        
                            <th>Descrição</th>
                            <th>Alterar</th>
                            <th>Excluir</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderContas } 
                    </tbody>
                </Table>
            }

        </Container>    
    
    </div>

  );

}

export default Contas;

// ---------------------------------------------------------------------//


// const handleChange = (e) => {
//   setForm({...form, [e.target.name]: e.target.value})
// }


