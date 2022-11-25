import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Container, Spinner, Table } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpDown } from '@fortawesome/free-solid-svg-icons'

function Balancete(props) {

  const apiURL           = "https://ironrest.herokuapp.com/mContas";
  const apiURLlancto     = "https://ironrest.herokuapp.com/mLancamentos";

  const [mContas, setContas] = useState([]);
  const [mLancamentos, setLancamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [onlyZero, setOnlyZero] = useState(false);

  useEffect(() => {
    lerContas()
    lerLancamentos()
  }, []) 

  const processar01 = (e) => {  
    e.preventDefault();

    let xContas = mContas.map( (c) => { return c }  );
    xContas.sort( (a,b) => { return a.estrutural < b.estrutural ? 1 : -1 } ) 
    xContas.forEach( c => c.workSD = 0 ); 

    xContas.forEach( (c) => { 
      if ( c.nivel === "9" ) {
        c.workSD = retSaldoConta(c.estrutural); 
      }
    });

    xContas.forEach( (d,ind,arr) => {
      if ( d.workSD !== 0 & parseInt(d.nivel) === 9) {
        for (let i=parseInt(d.nivel)-1;i>0;i--) {
          for ( let j=ind+1;j<xContas.length;j++) {
            if ( parseInt(xContas[j].nivel) === i ) {
              xContas[j].workSD += d.workSD;
              break;
            }
            if ( parseInt(xContas[j].nivel) < i ) {
              i = parseInt(xContas[j].nivel);
              xContas[j].workSD += d.workSD;
              break;
            }
          }        
        }
      }
    });

    xContas.sort( (a,b) => { return a.estrutural > b.estrutural ? 1 : -1 } ) 
    setContas(xContas); 
  }

  const retSaldoConta = (codigoEstrutural) => { 
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
    return ("         ".slice(10-qtd))
  }

  const renderContas = mContas.map((conta) => {

      return ( 
          onlyZero === false | conta.workSD !== 0 ? 
          
          
          <><tr key={conta._id}>
              <td className="p-1 text-center">{conta.reduzido}</td>
              <td className="p-1 text-center">{conta.estrutural}</td>
              <td className="p-1 text-center">{conta.nivel}</td>
              <td className="p-1" style={{fontFamily: "monospace" }}><pre className="m-0 p-0">{espacos(parseInt(conta.nivel))}{conta.descricao}</pre></td>
              <td className="p-1 text-end">{ 
                conta.workSD.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
              }</td>
          </tr> </>

          
          : " "
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

  const classificar = (propr, type) => {
    let xContas = [...mContas];
    if ( type === 'number') {
      if ( parseInt(xContas[0][propr]) > parseInt(xContas[xContas.length-1][propr]) ) {
        xContas.sort( (a,b) => 
          parseInt(a[propr]) > parseInt(b[propr]) ? 1 : -1 )
      } else {
        xContas.sort( (a,b) => 
          parseInt(a[propr]) < parseInt(b[propr]) ? 1 : -1 )
      }
    } 
    if ( type === 'text') {
      if ( xContas[0][propr].toLowerCase() > xContas[xContas.length-1][propr].toLowerCase() ) {
        xContas.sort( (a,b) => 
          a[propr].toLowerCase() > b[propr].toLowerCase() ? 1 : -1 )
      } else {
        xContas.sort( (a,b) => 
          a[propr].toLowerCase() < b[propr].toLowerCase() ? 1 : -1 )
      }
    }
    if ( type === 'data') {
      let dataA = 
            xContas[0][propr].slice(6) + "-" + 
            xContas[0][propr].slice(3,5) + "-" + 
            xContas[0][propr].slice(0,2);
      let dataB = 
          xContas[xContas.length-1][propr].slice(6) + "-" + 
          xContas[xContas.length-1][propr].slice(3,5) + "-" + 
          xContas[xContas.length-1][propr].slice(0,2);
      if ( dataA > dataB ) {
        xContas.sort( (a,b) => 
            a[propr].slice(6) + "-" + a[propr].slice(3,5) + "-" + a[propr].slice(0,2) > 
            b[propr].slice(6) + "-" + b[propr].slice(3,5) + "-" + b[propr].slice(0,2) ? 
            1 : -1 
        )
      } else {
        xContas.sort( (a,b) => 
            a[propr].slice(6) + "-" + a[propr].slice(3,5) + "-" + a[propr].slice(0,2) < 
            b[propr].slice(6) + "-" + b[propr].slice(3,5) + "-" + b[propr].slice(0,2) ? 
            1 : -1 
        )
      }
    }
    setContas(xContas);
  }

  const setarOnlyZero = (e) => { 
    e.preventDefault();
    let inverso = !onlyZero;
    setOnlyZero(inverso) 
  }

  return (

    <div className="Balancete">

        <Container>
        
            <Form>
              <div className="text-center">
                <Button className="m-3" onClick={processar01}   style={{width: "30%"}} variant="success" type="submit">ATUAL</Button>
                <Button className="m-3" onClick={processar01}   style={{width: "30%"}} variant="success" type="submit">RETROATIVO</Button>
                <Button className="m-3" onClick={setarOnlyZero} style={{width: "30%"}} variant="success" type="submit">FILTRAR "0"</Button>
              </div>
            </Form>
            
            {isLoading && <Spinner className="" animation="border" />}
            
            {!isLoading && <>

              <Table className="mt-4" bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => classificar('reduzido','number')}>
                            <div className="d-flex">
                                <div className='col-11'>Reduzido</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={() => classificar('estrutural','number')}>
                            <div className="d-flex">
                                <div className='col-11'>Estrutural</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={() => classificar('nivel','number')}>
                            <div className="d-flex">
                                <div className='col-11'>Nivel</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th onClick={() => classificar('descricao','text')}>
                            <div className="d-flex">
                                <div className='col-11'>Descrição</div>
                                <div className='col-1'>
                                  <FontAwesomeIcon style={{color: "blue"}} icon={faUpDown}/>
                                </div>
                              </div>
                            </th>
                            <th>Saldo</th>
                        </tr>
                    </thead>                    
                    <tbody>
                      {renderContas}
                    </tbody>
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
