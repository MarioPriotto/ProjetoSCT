// Transformar a janela modal em fixa
// search com todo o conjunto de dados da linha
// "balão" mostrando descrição histórico e contas (hover)
// INC,ALT,EXC - ajustar os valores de SDmes, SDdia, SDano

import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner, Table, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPen, faTrash, faUpDown, faXmarksLines } from '@fortawesome/free-solid-svg-icons'

// npm install --save @fortawesome/fontawesome-free 

// npm install --save @fortawesome/free-solid-svg-icons
// npm install --save @fortawesome/react-fontawesome@latest
// https://fontawesome.com/search?o=r&m=free&s=solid&f=classic

function Lancamentos(props) {

  // API da base de dados principal e objeto
  const apiURL           = "https://ironrest.herokuapp.com/mLancamentos";
  const apiURLhistoricos = "https://ironrest.herokuapp.com/mHistoricos";
  const apiURLcontas     = "https://ironrest.herokuapp.com/mContas";

  // const apiURLsdMES      = "https://ironrest.herokuapp.com/mSDmes";
  // const apiURLsdDIA      = "https://ironrest.herokuapp.com/mSDdia";
  // const apiURLsdANO      = "https://ironrest.herokuapp.com/mSDano";

  // Matriz de dados carregada da base de dados
  const [mLancamentos, setLancamentos] = useState([]);
  // Está carregando dados da Internet?
  const [isLoading, setIsLoading] = useState(true);
  // Variável que guarda a string de busca "pesquisa"
  const [search, setSearch] = useState("");
  // Matriz que guarda os dados do Form (pega os dados INCLUSÃO e ALTERAÇÃO)
  const [form, setForm] = useState({ codigo: 0, data: "", valor: 0, historico: 0, 
    complemento: "", contaCredito: "", contaDebito: "", unidade: props.unidadeAtiva
  });

  // Variável que guarda o Status do FORM ativo (se é INCLUSÃO ou ALTERAÇÃO)
  const [statusAlt, setStatusAlt] = useState(false);

  // Variável que guarda o Status da JANELA MODAL (se está visível ou não)
  const [show, setShow] = useState(false);
  // Função que Fecha a JANELA MODAL e desativa STATUS de eventual FORM de Alteração
  const handleClose = () => { setShow(false); setStatusAlt(false); };
  // Função que Abre a JANELA MODAL
  const handleShow  = () => setShow(true);

  // Matriz para os dados completos das Contas
  const [mContas, setContas] = useState([]);
  // Matriz para os dados completos dos Historicos
  const [mHistoricos, setHistoricos] = useState([]);

  // Três variáveis para apresentação da descrição
  // a partir do código (contas e histórico) - no Formulário (inclusão,alteração)
  const [txtContaDebito,  setTxtContaDebito]  = useState("");
  const [txtContaCredito, setTxtContaCredito] = useState("");
  const [txtHistorico, setTxtHistorico] = useState("");

  // guarda o objeto original do registro que entra em modo alteração
  // const [registroOriginal, setRegistroOriginal] = useState({});

  const [rDescricao, setRdescricao] = useState(false);

  // Faz com que a função de Leitura só aconteça uma vez
  useEffect(() => {
    lerContas()
    lerHistoricos()
    lerLancamentos()
  }, [])

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerContas = () => {
    try {
      const fetchContas = async () => {
          const response = await axios.get(apiURLcontas)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setContas(tempData)
          //setIsLoading(false)
      }
      fetchContas()
    } catch (error) {
      console.log(error)
    }
  }

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerHistoricos = () => {
    try {
      const fetchHistoricos = async () => {
          const response = await axios.get(apiURLhistoricos)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setHistoricos(tempData)
          //setIsLoading(false)
      }
      fetchHistoricos()
    } catch (error) {
      console.log(error)
    }
  }

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerLancamentos = () => {
    try {
      const fetchLancamentos = async () => {
          const response = await axios.get(apiURL)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setLancamentos(tempData)
          setIsLoading(false)
      }
      fetchLancamentos()
    } catch (error) {
      console.log(error)
    }
  }
  
  // Mostra o Formulário de dados (janela modal) e apaga os dados do Formulário
  // == > Preparação para "pegar" novos dados
  const prepararFormNova = () => {
    handleShow();
    setForm({ codigo: 0, data: "", valor: 0, historico: 0, 
      complemento: "", contaCredito: "", contaDebito: "", unidade: props.unidadeAtiva }
    );
    setTxtHistorico(" ");
    setTxtContaCredito(" ");
    setTxtContaDebito(" ");
  }

  // Le, na internet, os dados do Registro informado no Parâmetro (id) 
  // o (id) veio informado no link clicado pelo usuário
  // copia esses dados lidos na internet para as variáveis do formulário
  // ativa a variável que indica tratar-se de ALTERAÇÃO
  // abre a JANELA MODAL e apresenta o Formulário
  const alterarLancamento = (id) => {
    try {
      setIsLoading(true)
      const fetchLancamentos = async () => {
          const response = await axios.get(`${apiURL}/${id}`)
          //setRegistroOriginal(response.data);
          setForm({
            codigo: response.data.codigo, data: response.data.data,
            valor: parseFloat(response.data.valor).toFixed(2), 
            historico: response.data.historico,
            complemento: response.data.complemento, 
            contaCredito: response.data.contaCredito,
            contaDebito: response.data.contaDebito, 
            unidade: response.data.unidade,
            _id: response.data._id
          });

          setStatusAlt(true);
          setIsLoading(false);  

          let indHistorico  = 
            mHistoricos.findIndex(h=>parseInt(h.codigo)===parseInt(response.data.historico));
          let indContaDebito = 
            mContas.findIndex(h=>h.estrutural===response.data.contaDebito);
          let indContaCredito = 
            mContas.findIndex(h=>h.estrutural===response.data.contaCredito);
          indHistorico > -1 ? 
            setTxtHistorico(mHistoricos[indHistorico].descricao) : setTxtHistorico(" ");
          indContaDebito > -1 ? 
            setTxtContaDebito(mContas[indContaDebito].descricao) : setTxtContaDebito(" ");
          indContaCredito > -1 ? 
            setTxtContaCredito(mContas[indContaCredito].descricao) : setTxtContaCredito(" ");

          handleShow()

      }
      fetchLancamentos()
    } catch (error) {
      console.log(error)
    }
  }

  // apaga, na internet, os dados do registro informado no parâmetro (id)
  // o parâmetro (id) vem do link clicado pelo usuário
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  const deletarLancto = (id) => {
    try {
      setIsLoading(true)
      const fetchLancamentos = async () => {
          //const response = await axios.get(`${apiURL}/${id}`)
          //excluirSaldos(response.data);
          await axios.delete(`${apiURL}/${id}`)
          lerLancamentos()
      }
      fetchLancamentos()
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
    if ( e.target.name === 'valor' ) {
      setForm({...form, [e.target.name]: parseFloat(e.target.value).toFixed(2) })
    }

    if ( e.target.name === 'historico' ) {
      let indHistorico = mHistoricos.findIndex(h=>parseInt(h.codigo)===parseInt(e.target.value));
      if ( indHistorico === -1 ) {
        setForm({...form, historico: 0 })
        setTxtHistorico(" Histórico é obrigatório ");
      } else {
        indHistorico > -1 ? setTxtHistorico(mHistoricos[indHistorico].descricao) : setTxtHistorico(" ");
      }
    }

    if ( e.target.name === 'contaDebito' ) {
      let indContaDebito = mContas.findIndex(h=>h.estrutural===e.target.value);
      if ( indContaDebito < 0 ) {
        setTxtContaDebito("Informe uma conta VÁLIDA"); 
        setForm({...form, contaDebito: "0" }); 
        return;
      } else {
        if ( mContas[indContaDebito].nivel !== "9"  ) { setTxtContaDebito("É obrigatório uma conta de NIVEL 9");   setForm({...form, contaDebito: "0" }); return; }
        if ( form.contaDebito === form.contaCredito ) { setTxtContaDebito("As contas DB/CR não podem ser iguais"); setForm({...form, contaDebito: "0" }); return; }
        setTxtContaDebito(mContas[indContaDebito].descricao)
      }
    }

    if ( e.target.name === 'contaCredito' ) {
      let indContaCredito = mContas.findIndex(h=>h.estrutural===e.target.value);
      if ( indContaCredito < 0 ) {
        setTxtContaCredito("Informe uma conta VÁLIDA"); 
        setForm({...form, contaCredito: "0" }); 
        return;
      } else {
        if ( mContas[indContaCredito].nivel !== "9" ) { setTxtContaCredito("É obrigatório uma conta de NIVEL 9");   setForm({...form, contaCredito: "0" }); return; }
        if ( form.contaCredito === form.contaDebito ) { setTxtContaCredito("As contas DB/CR não podem ser iguais"); setForm({...form, contaCredito: "0" }); return; }
        setTxtContaCredito(mContas[indContaCredito].descricao)
      }
    }

  }

  // dispara quando o usuário clica em "GRAVAR" no Formulário (alteração ou inclusão)
  // grava o conteúdo ma matriz "form" na base de dados da internet
  // na sequência, chama rotina que lê todos os dados da internet e reapresenta na tela
  // Fecha a JANELA MODAL do formulário
  const handleSubmit = async (e) => {
    e.preventDefault()
    if ( form.contaCredito === "0" | form.contaDebito === "0" ) return;
    try {
        if ( statusAlt ) { // Alteração
          const clone = { ...form }
          delete clone._id
          clone.valor = parseFloat(clone.valor);
          clone.historico = parseInt(clone.historico);
          await axios.put(`${apiURL}/${form._id}`, clone)
          // incluirSaldos(clone);
          // await axios.get(apiURLcontas); (10 repetições da linha - p/atrasar processamento)
          // incluirSaldos depende dos dados já atualizados do axios.put anterior
          // isso gera conflito de tempo de atualização
          // excluirSaldos(registroOriginal);          
        } else { // Inclusão
          const clone = { ...form }
          clone.valor = parseFloat(clone.valor);
          clone.historico = parseInt(clone.historico);
          clone.codigo = ( parseInt( mLancamentos.reduce( (acu,cur) => 
            cur.codigo > acu ? cur.codigo : acu , 0 ) ) + 1 
          );
          await axios.post(apiURL, clone)
          // incluirSaldos(clone);
        }        
        lerLancamentos()
        handleClose()
    } catch (error) {
        console.log(error)
    }
  }

  // const apiURLsdMES      = "https://ironrest.herokuapp.com/mSDmes";
  // const apiURLsdDIA      = "https://ironrest.herokuapp.com/mSDdia";
  // const apiURLsdANO      = "https://ironrest.herokuapp.com/mSDano";

  // ******************* EXCLUIR LANÇAMENTOS NAS BASES DE DADO DE SALDOS (DD,MM,AA)

  // const excluirSaldos = (registro) => {

  //   let ano = parseInt(registro.data.slice(6));
  //   let mes = registro.data.slice(3,5);
  //   let dia = registro.data.slice(0,2);
  //   let estruturalDB = registro.contaDebito;
  //   let estruturalCR = registro.contaCredito;
  //   let esteValor = registro.valor;

  //   console.log("==========EXCLUSAO: ", ano,mes,dia,estruturalDB, estruturalCR, esteValor);

  //   try { // ***** gravação das totalizações por ano
  //     const fetchSDano = async () => {
  //         const respDB = await axios.get(apiURLsdANO) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" EXCanoDB: ",ano,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo + esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdANO}/${idPeriodo}`, objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdANO) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" EXCanoCR: ",ano,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo - esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdANO}/${idPeriodo}`, objResultado)
  //         }
  //     }
  //     fetchSDano()
  //   } catch (error) { console.log(error) }

  //   try { // ***** gravação das totalizações por ano/mes
  //     const fetchSDanoMes = async () => {
  //         const respDB = await axios.get(apiURLsdMES) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" EXCanomesDB: ",ano,mes,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo + esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, mes: mes, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdMES}/${idPeriodo}`, objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdMES) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" EXCanomesCR: ",ano,mes,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo - esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, mes: mes, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdMES}/${idPeriodo}`, objResultado)
  //         }
  //     }
  //     fetchSDanoMes()
  //   } catch (error) { console.log(error) }

  //   try { // ***** gravação das totalizações por ano/mes/dia
  //     const fetchSDanoMesDia = async () => {
  //         const respDB = await axios.get(apiURLsdDIA) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.dia===dia&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" EXCanomesdiaDB: ",ano,mes,dia,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo + esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdDIA}/${idPeriodo}`, objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdDIA) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.dia===dia&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" EXCanomesdiaCR: ",ano,mes,dia,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo - esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdDIA}/${idPeriodo}`, objResultado)
  //         }
  //     }
  //     fetchSDanoMesDia()
  //   } catch (error) { console.log(error) }

  // }

// ******************* INCLUIR LANÇAMENTOS NAS BASES DE DADO DE SALDOS (DD,MM,AA)  

  // const incluirSaldos = (registro) => {    

  //   let ano = parseInt(registro.data.slice(6));
  //   let mes = registro.data.slice(3,5);
  //   let dia = registro.data.slice(0,2);
  //   let estruturalDB = registro.contaDebito;
  //   let estruturalCR = registro.contaCredito;
  //   let esteValor = registro.valor;

  //   console.log("==========INCLUSAO: ", ano,mes,dia,estruturalDB, estruturalCR, esteValor);    
    
  //   try { // ***** gravação das totalizações por ano
  //     const fetchSDano = async () => {
  //         const respDB = await axios.get(apiURLsdANO) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" anoDB: ",ano,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo - esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdANO}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, saldo: 0 - esteValor, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdANO,  objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdANO) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" anoCR: ",ano,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo + esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdANO}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, saldo: esteValor, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdANO,  objResultado)
  //         }
  //     }
  //     fetchSDano()
  //   } catch (error) { console.log(error) }

  //   try { // ***** gravação das totalizações por ano/mes
  //     const fetchSDanoMes = async () => {
  //         const respDB = await axios.get(apiURLsdMES) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" anomesDB: ",ano,mes,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo - esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, mes: mes, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdMES}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, mes: mes, saldo: 0 - esteValor, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdMES,  objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdMES) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" anomesCR: ",ano,mes,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo + esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, mes: mes, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdMES}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, mes: mes, saldo: esteValor, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdMES,  objResultado)
  //         }
  //     }
  //     fetchSDanoMes()
  //   } catch (error) { console.log(error) }

  //   try { // ***** gravação das totalizações por ano/mes/dia
  //     const fetchSDanoMesDia = async () => {
  //         const respDB = await axios.get(apiURLsdDIA) // AJUSTANDO SALDO DEBITO
  //         let iPeriodoDB = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.dia===dia&c.unidade===props.unidadeAtiva&c.estrutural===estruturalDB )
  //         console.log(" anomesdiaDB: ",ano,mes,dia,props.unidadeAtiva,estruturalDB) 
  //         if ( iPeriodoDB > -1 ) {
  //           let saldoPeriodo  = respDB.data[iPeriodoDB].saldo - esteValor
  //           let idPeriodo     = respDB.data[iPeriodoDB]._id
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: saldoPeriodo, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdDIA}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: 0 - esteValor, estrutural: estruturalDB, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdDIA,  objResultado)
  //         }
  //         const respCR = await axios.get(apiURLsdDIA) // AJUSTANDO SALDO CREDITO
  //         let iPeriodoCR = respDB.data.findIndex(c => c.ano===ano&c.mes===mes&c.dia===dia&c.unidade===props.unidadeAtiva&c.estrutural===estruturalCR )
  //         console.log(" anomesdiaCR: ",ano,mes,dia,props.unidadeAtiva,estruturalCR)
  //         if ( iPeriodoCR > -1 ) {
  //           let saldoPeriodo  = respCR.data[iPeriodoCR].saldo + esteValor
  //           let idPeriodo     = respCR.data[iPeriodoCR]._id
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: saldoPeriodo, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.put(`${apiURLsdDIA}/${idPeriodo}`, objResultado)
  //         } else {
  //           let objResultado = { ano: ano, mes: mes, dia: dia, saldo: esteValor, estrutural: estruturalCR, unidade: props.unidadeAtiva };
  //           await axios.post(apiURLsdDIA,  objResultado)
  //         }
  //     }
  //     fetchSDanoMesDia()
  //   } catch (error) { console.log(error) }

  // }

  const revelaDescricao = () => {
    let inversao = !rDescricao;
    setRdescricao(inversao);
  }

  // prepara na variável "renderLancamentos"  o conteudo lido na base de dados
  // e que foi, previamente, armazenado na matriz correspondente
  // Reparar que a função ".filter" é utilizada para que sejam filtrados
  // somente os registros que forem compatíveis com a string de BUSCA
  // as duas últimas colunas são Botões com Links para ALTERAR e DELETAR
  const renderLancamentos = mLancamentos
  .filter((l) => l.complemento.toLowerCase().includes(search.toLowerCase()))
  .map((l) => {
      return (
          <tr key={l._id}>              
              <td className="p-1 text-center">{l.codigo}</td>
              <td className="p-1 text-center">{l.data}</td>
              
              {/* <td className="p-1 text-end">{l.valor.toFixed(2)}</td> */}
              <td className="p-1 text-end">{
                l.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
              }</td>

              <td className="p-1 text-start">{l.historico}<span style={{fontSize: "12px"}}> {
                  rDescricao ? mHistoricos[mHistoricos.findIndex( c => parseInt(c.codigo) === l.historico)].descricao : " "
                }</span>
              </td>
              <td className="p-1 text-start">{l.complemento}</td>
              <td className="p-1 text-start">{l.contaDebito}<span style={{fontSize: "12px"}}> {
                rDescricao ? mContas[mContas.findIndex( c => c.estrutural === l.contaDebito)].descricao : " "
                }</span>
              </td>
              <td className="p-1 text-start">{l.contaCredito}<span style={{fontSize: "12px"}}> {
                rDescricao ? mContas[mContas.findIndex( c => c.estrutural === l.contaCredito)].descricao : " "
                }</span>
              </td>
              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { alterarLancamento(l._id) } }> 
                  <FontAwesomeIcon style={{color: "blue"}} icon={faPen}/>
                </Button>
              </td>
              <td className="p-1 text-center">
                <Button className="p-0" variant="" onClick={ (event) => { deletarLancto(l._id) } }>
                  <FontAwesomeIcon style={{color: "red"}}  icon={faTrash} />
                </Button>
              </td>
          </tr>
      )
  })

  const classificar = (propr, type) => {
    let xLancto = [...mLancamentos];
    if ( type === 'number') {
      if ( parseInt(xLancto[0][propr]) > parseInt(xLancto[xLancto.length-1][propr]) ) {
        xLancto.sort( (a,b) => 
          parseInt(a[propr]) > parseInt(b[propr]) ? 1 : -1 )
      } else {
        xLancto.sort( (a,b) => 
          parseInt(a[propr]) < parseInt(b[propr]) ? 1 : -1 )
      }
    } 
    if ( type === 'text') {
      if ( xLancto[0][propr].toLowerCase() > xLancto[xLancto.length-1][propr].toLowerCase() ) {
        xLancto.sort( (a,b) => 
          a[propr].toLowerCase() > b[propr].toLowerCase() ? 1 : -1 )
      } else {
        xLancto.sort( (a,b) => 
          a[propr].toLowerCase() < b[propr].toLowerCase() ? 1 : -1 )
      }
    }
    if ( type === 'data') {
      let dataA = xLancto[0][propr].slice(6) + "-" + 
                  xLancto[0][propr].slice(3,5) + "-" + 
                  xLancto[0][propr].slice(0,2);
      let dataB = xLancto[xLancto.length-1][propr].slice(6) + "-" + 
                  xLancto[xLancto.length-1][propr].slice(3,5) + "-" + 
                  xLancto[xLancto.length-1][propr].slice(0,2);
      if ( dataA > dataB ) {
        xLancto.sort( (a,b) => 
            a[propr].slice(6) + "-" + a[propr].slice(3,5) + "-" + a[propr].slice(0,2) > 
            b[propr].slice(6) + "-" + b[propr].slice(3,5) + "-" + b[propr].slice(0,2) ? 
            1 : -1 
        )
      } else {
        xLancto.sort( (a,b) => 
            a[propr].slice(6) + "-" + a[propr].slice(3,5) + "-" + a[propr].slice(0,2) < 
            b[propr].slice(6) + "-" + b[propr].slice(3,5) + "-" + b[propr].slice(0,2) ? 
            1 : -1 
        )
      }
    }
    setLancamentos(xLancto);
  }

  return (

    <div className="Lancamentos">

        <Container>

            {/* Mostra o Formulário que solicita a STRING de BUSCA/PESQUISA */}
            {/* o botão de ADICIONAR um REGISTRO NOVO */}
            {/* o botão de REVELAR detalhes descritivos (conta,histórico) */}
            <Form className="my-4 d-flex" >
              <Button variant="" onClick={ prepararFormNova }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faPlus}/> 
              </Button>
              <Button variant="" onClick={ revelaDescricao }>
                <FontAwesomeIcon style={{color: "blue"}} icon={faXmarksLines}/> 
              </Button>
              <Form.Control
                    type="search" placeholder="Procurar lancamento"
                    value={ search } onChange={ (e) => setSearch(e.target.value) }
              />
            </Form>

            {/* JANELA MODAL que contém o FORMULÁRIO para INCLUSÃO ou ALTERAÇÃO */}
            <Modal show={show} onHide={handleClose} animation={true}>

                <Modal.Header closeButton>
                    <Modal.Title>
                      {/* TEXTO É AJUSTADO CONFORME variável statusALT que indica se é ALTERAÇÃO ou INCLUSÃO */}
                      { statusAlt && <p>Alterar lancamento</p> }
                      { !statusAlt && <p>Novo lancamento</p> }
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>

                        <div className="row">
                          <div className="col-6">
                            <Form.Group className="mb-3 lh-1 fw-bold">
                              <Form.Label>Data:</Form.Label>
                              <Form.Control type="text"
                                placeholder="dd/mm/aa"
                                //ref={textInput}
                                name="data" value={form.data} onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </div>
                          <div className="col-6">
                            <Form.Group className="mb-3 lh-1 fw-bold">
                              <Form.Label>Valor: </Form.Label>
                              <Form.Control type="text"
                                placeholder="0.00"
                                name="valor" value={form.valor} onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Form.Group>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3 lh-1 fw-bold" style={{width: '120px'}}>
                                <Form.Label>Conta DB:</Form.Label>
                                <Form.Control type="text"
                                    name="contaDebito" value={form.contaDebito} onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                          </div>
                          <div className="col-8 mt-3 pt-2 ps-0" style={{fontSize: "12px"}}>
                            <Form.Control readOnly tabindex="-1" type="text" 
                              name="txtContaDebito" value={txtContaDebito} onChange={null} style={{border: "0"}} 
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3 lh-1 fw-bold" style={{width: '120px'}}>
                                <Form.Label>Conta CR:</Form.Label>
                                <Form.Control type="text"
                                    name="contaCredito" value={form.contaCredito} onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                          </div>
                          <div className="col-8 mt-4 pt-2 ps-0" style={{fontSize: "12px"}}>
                            <Form.Control readOnly tabindex="-1" type="text" 
                              name="txtContaCredito" value={txtContaCredito} onChange={null} style={{border: "0"}} 
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-4">
                            <Form.Group className="mb-3 lh-1 fw-bold" style={{width: '120px'}}>
                                <Form.Label>Histórico:</Form.Label>
                                <Form.Control type="text"
                                    name="historico" value={form.historico} onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Group>
                            </div>
                            <div className="col-8 mt-4 pt-2 ps-0" style={{fontSize: "12px"}}>
                              <Form.Control readOnly tabindex="-1" type="text" name="txtHistorico" value={txtHistorico} 
                                onChange={null} style={{border: "0", boxShadow: "0 0 0 0", outline: "0"}} 
                              />
                            </div>
                        </div>

                        <Form.Group className="mb-3 lh-1 fw-bold">
                            <Form.Label>Complemento:</Form.Label>
                            <Form.Control type="text"
                                name="complemento" value={form.complemento} onChange={handleChange}
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
                            <th onClick={ () => classificar('codigo','number') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Código</div>
                                <div className='col-1'> 
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/> 
                                </div>
                              </div>
                            </th>
                            <th onClick={ () => classificar('data','data') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Data</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={ () => classificar('valor','number') } className=" text-center">
                              <div className="d-flex">
                                <div className='col-11'>Valor</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>                                                        
                            <th onClick={ () => classificar('historico','number') }>
                              <div className="d-flex">
                                <div className='col-11'>Histórico</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={ () => classificar('complemento','text') }>
                              <div className="d-flex">
                                <div className='col-11'>Complemento</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={ () => classificar('contaDebito','number') }>
                              <div className="d-flex">
                                <div className='col-11'>Débito</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={ () => classificar('contaCredito','number') }>
                              <div className="d-flex">
                                <div className='col-11'>Crédito</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th className=" text-center">A</th>
                            <th className=" text-center">E</th>
                        </tr>
                    </thead>
                    <tbody>
                        { renderLancamentos } 
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

export default Lancamentos;

// ---------------------------------------------------------------------//
