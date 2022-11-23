import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'
// import Usuarios from "../Usuarios/Usuarios";

// npm install --save @fortawesome/fontawesome-free

// npm install --save @fortawesome/free-solid-svg-icons
// npm install --save @fortawesome/react-fontawesome@latest
// https://fontawesome.com/search?o=r&m=free&s=solid&f=classic

function Unidades(props) {

  // API da base de dados principal e objeto
  const apiURL = "https://ironrest.herokuapp.com/mUnidades";

  // Matriz de dados carregada da base de dados
  const [mUnidades, setUnidades] = useState([]);
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
    lerUnidades()
  }, [])  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerUnidades = () => {
    try {
      const fetchUnidades = async () => {
          const response = await axios.get(apiURL)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setUnidades(tempData)
          setIsLoading(false)
      }
      fetchUnidades()
    } catch (error) {
      console.log(error)
    }
  }

  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const preparaFormNova = () => {
    handleShow();
    setForm({ codigo: "", descricao: "" });
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id)
  // o (id) veio informado no link clicado pelo usuário
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alteraUnidade = (id) => {
    try {
      setIsLoading(true)
      const fetchUnidades = async () => {
          const response = await axios.get(`${apiURL}/${id}`)
          setForm({
            codigo: response.data.codigo, 
            descricao: response.data.descricao, 
            unidade: response.data.unidade,
            _id: response.data._id
          });
          setStatusAlt(true)
          handleShow()
          setIsLoading(false)
      }
      fetchUnidades()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo usuário
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deleteUnidade = (id) => {
    try {
      setIsLoading(true)
      const fetchUnidades = async () => {
          await axios.delete(`${apiURL}/${id}`)
          lerUnidades()
      }
      fetchUnidades()
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
        lerUnidades()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // prepara na variável "renderUnidades"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderUnidades = mUnidades
  .filter((Unidade) => Unidade.descricao.toLowerCase().includes(search.toLowerCase()))
  .map((Unidade) => {
      return (
          <tr key={Unidade._id}>
              <td className="p-1 text-center">{Unidade.codigo}</td>
              <td className="p-1">{Unidade.descricao}</td>
              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { alteraUnidade(Unidade._id) } }>
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>
              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { deleteUnidade(Unidade._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>
          </tr>
      )
  })

  const classifica = (property, type) => {
    let xUnidades = [...mUnidades];
    if ( type === 'number') {
      if ( parseInt(xUnidades[0][property]) > parseInt(xUnidades[xUnidades.length-1][property]) ) {
        xUnidades.sort( (a,b) => parseInt(a[property]) > parseInt(b[property]) ? 1 : -1 )
      } else {
        xUnidades.sort( (a,b) => parseInt(a[property]) < parseInt(b[property]) ? 1 : -1 )
      }
    } else {
      if ( xUnidades[0][property].toLowerCase() > xUnidades[xUnidades.length-1][property].toLowerCase() ) {
        xUnidades.sort( (a,b) => a[property].toLowerCase() > b[property].toLowerCase() ? 1 : -1 )
      } else {
        xUnidades.sort( (a,b) => a[property].toLowerCase() < b[property].toLowerCase() ? 1 : -1 )
      }
    }
    setUnidades(xUnidades);
  }

  return (

    <div className="Unidades">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* Mostra, também, o botão de ADICIONAR um REGISTRO NOVO */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ preparaFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar Unidade"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar Unidade</p> }
                      { !statusAlt && <p>Novo Unidade</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Codigo: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira o código do Unidade"
                                name="codigo" value={form.codigo} onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Descrição: </Form.Label>
                            <Form.Control type="text"
                                placeholder="Insira a Descrição do Unidade"
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
                <Table className="mt-4" bordered hover>
                    <thead>
                        <tr>
                            <th onClick={ () => classifica('codigo','number') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Código</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th onClick={ () => classifica('descricao','text') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Descrição</div>
                                <div className='col-1'> <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> </div>
                              </div>
                            </th>
                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderUnidades } 
                    </tbody>
                </Table>
            }

            <div className="fs-6 fw-bold">
              Usuário: {props.usuarioAtivo}
            </div>

        </Container>
    
    </div>

  );

}

export default Unidades;

// ---------------------------------------------------------------------//
