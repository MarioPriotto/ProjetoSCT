import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Container, Spinner, Table } from "react-bootstrap";

function Balancete(props) {

  const apiURL = "https://ironrest.herokuapp.com/mContas";

  const apiURLsdMES      = "https://ironrest.herokuapp.com/mSDmes";
  const apiURLsdDIA      = "https://ironrest.herokuapp.com/mSDdia";
  const apiURLsdANO      = "https://ironrest.herokuapp.com/mSDano"; 

  const apiURLlancto     = "https://ironrest.herokuapp.com/mLancamentos";

  const [mContas, setContas] = useState([]);
  const [mSDano,  setSDano]  = useState([]);
  const [mSDmes,  setSDmes]  = useState([]);
  const [mSDdia,  setSDdia]  = useState([]);

  const [mLancamentos, setLancamentos] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    lerContas()
    lerSDano()
    lerSDmes()
    lerSDdia()
    lerLancamentos()
  }, []) 

  const processar01 = (e) => {  
    e.preventDefault();

    console.log("chegou em prepararContas01...", mContas.length );

    console.log("2*******************************");

    let xContas = mContas.map( (c) => { return c }  );

    xContas.sort( (a,b) => { return a.estrutural < b.estrutural ? 1 : -1 } ) 

    xContas.forEach( c => c.workSD = 0 ); 

    xContas.forEach( (c) => { 
      if ( c.nivel === "9" ) {
        c.workSD = retSaldoConta(c.estrutural); 
        if ( c.workSD  !== 0 ) { 
          console.log(c.estrutural, c.nivel, c.descricao, c.workSD) 
        }
      }
    });

    console.log("1*******************************");
    xContas.forEach( (d,ind,arr) => {
      // console.log("passando aqui pela conta: ",ind,d.estrutural,d.nivel,d.descricao,d.workSD);

      if ( d.workSD !== 0 ) {
      
        for (let i=parseInt(d.nivel)-1;i>0;i--) {
          console.log("procurando pelo nivel: ",ind,d.estrutural,d.nivel,"->",i,"<-",d.workSD,d.descricao);

          for ( let j=ind+1;j<xContas.length;j++) {
            if ( xContas[j].nivel === i ) {
              console.log("==========encontrou onde acumular: ",ind,d.nivel,i,xContas[j].estrutural, xContas[j].nivel, xContas[j].descricao)
              // acumula aqui 
              // saltar para o PROXIMO LET J
            }
            if ( xContas[j].nivel < i ) {
              // acumula aqui NO j.nivel
              // força o j a ser i-1
            }
          }        

          // NAO USAR let indice = xContas.findIndex( (d) => d.nivel === i & d.estrutural < c.estrutural )
          // NAO USAR xContas.workSD[indice] = xContas.workSD[indice] + c.workSD;
        }

      }

    });

    xContas.sort( (a,b) => { return a.estrutural > b.estrutural ? 1 : -1 } ) 

    setContas(xContas); 

    console.log("Final do prepararContas01: ", mContas.length, xContas.length);

  }

  const retSaldoConta = (codigoEstrutural) => { 

    // let s3dia = mSDdia
    // .filter( (c) => c.unidade === props.unidadeAtiva & c.estrutural === codigoEstrutural )
    // .reduce( (ac,current) => { return ac + current.saldo
    // },0);
    // //console.log("veio buscar saldo: ", codigoEstrutural, s3dia)

     let tLancto = mLancamentos
     .filter( (c) => c.unidade === props.unidadeAtiva & (c.contaCredito === codigoEstrutural | c.contaDebito === codigoEstrutural) )
     .reduce( (ac,current) => { return ( codigoEstrutural === current.contaCredito ? ac + current.valor : ac - current.valor )
     },0);

    return tLancto;
  }
  
  // Leitura de contas
  const lerContas = () => {
    try {
      const fetchContas = async () => {
          const response = await axios.get(apiURL)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          tempData.forEach( (c) => { c.workSD = 0} )
          setContas(tempData)
          setIsLoading(false)
      }
      fetchContas()
    } catch (error) {
      console.log(error)
    }
  }

  // Leitura de SDANO
  const lerSDano = () => {
    try {
      const fetchSDANO = async () => {
          const response = await axios.get(apiURLsdANO)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setSDano(tempData)
          setIsLoading(false)
      }
      fetchSDANO()
    } catch (error) {
      console.log(error)
    }
  }
  // Leitura de SDMES
  const lerSDmes = () => {
    try {
      const fetchSDMES = async () => {
          const response = await axios.get(apiURLsdMES)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setSDmes(tempData)
          setIsLoading(false)
      }
      fetchSDMES()
    } catch (error) {
      console.log(error)
    }
  }
  // Leitura de SDMES
  const lerSDdia = () => {
    try {
      const fetchSDDIA = async () => {
          const response = await axios.get(apiURLsdDIA)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setSDdia(tempData)
          setIsLoading(false)
      }
      fetchSDDIA()
    } catch (error) {
      console.log(error)
    }
  }

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerLancamentos = () => {
    try {
      const fetchLancamentos = async () => {
          const response = await axios.get(apiURLlancto)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
          setLancamentos(tempData)
          setIsLoading(false)
      }
      fetchLancamentos()
    } catch (error) {
      console.log(error)
    }
  }

  const espacos = (qtd) => {
    return ( "         ".slice(10-qtd)   )
  }

  const renderContas = mContas.map((conta) => {
      return (
          <tr key={conta._id}>
              <td className="p-1 text-center">{conta.reduzido}</td>
              <td className="p-1 text-center">{conta.estrutural}</td>
              <td className="p-1 text-center">{conta.nivel}</td>
              <td className="p-1" style={{fontFamily: "monospace" }}><pre className="m-0 p-0">{espacos(parseInt(conta.nivel))}{conta.descricao}</pre></td>
              <td className="p-1 text-end">{ 
                conta.workSD.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
              }</td>
          </tr>
      )
  })

  const rDH = () => {
    var data = new Date();
    //var dia     = data.getDate();           // 1-31
    //var dia_sem = data.getDay();            // 0-6 (zero=domingo)
    //var mes     = data.getMonth();          // 0-11 (zero=janeiro)
    //var ano2    = data.getYear();           // 2 dígitos
    //var ano4    = data.getFullYear();       // 4 dígitos
    var hora    = data.getHours();          // 0-23
    var min     = data.getMinutes();        // 0-59
    var seg     = data.getSeconds();        // 0-59
    var mseg    = data.getMilliseconds();   // 0-999
    //var tz      = data.getTimezoneOffset(); // em minutos
    //var str_data = dia + '/' + (mes+1) + '/' + ano4;
    var str_hora = hora + ':' + min + ':' + seg + "-" + mseg;
    //return (str_data + ' ' + str_hora);
    return (str_hora);
  }

  return (

    <div className="Balancete">

        <Container>
        
            <Form>
              <div className="text-center">
                <Button className="m-3" onClick={processar01} style={{width: "40%"}} variant="success" type="submit">BALANCETE ATUAL</Button>
                <Button className="m-3" onClick={processar01} style={{width: "40%"}} variant="success" type="submit">BALANCETE RETROATIVO</Button>
              </div>
            </Form>
            
            {isLoading && <Spinner className="" animation="border" />}

            
            {!isLoading && <>



              <Table className="mt-4" bordered hover>
                    <thead>
                        <tr>
                            <th>Reduzido</th>
                            <th>Estrutural</th>
                            <th>Nivel</th>
                            <th>Descrição</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>

                    {renderContas}

              </Table>

            </>}

            
            <div className="fs-6 fw-bold">
              Usuário: {props.usuarioAtivo}
            </div>

        </Container>
    
    </div>

  );

}

export default Balancete;

// ---------------------------------------------------------------------//
