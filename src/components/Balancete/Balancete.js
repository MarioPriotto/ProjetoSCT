import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";

function Balancete(props) {

  const apiURL = "https://ironrest.herokuapp.com/mContas";

  const apiURLsdMES      = "https://ironrest.herokuapp.com/mSDmes";
  const apiURLsdDIA      = "https://ironrest.herokuapp.com/mSDdia";
  const apiURLsdANO      = "https://ironrest.herokuapp.com/mSDano";

  const [mContas, setContas] = useState([]);
  const [mSDano,  setSDano]  = useState([]);
  const [mSDmes,  setSDmes]  = useState([]);
  const [mSDdia,  setSDdia]  = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // Faz com que a função de Leitura dos dados só aconteça na primeira vez que o código for executado
  useEffect(() => {
    lerContas()
    lerSDano()
    lerSDmes()
    lerSDdia()
  }, []) 
  
  // Leitura de contas
  const lerContas = () => {
    try {
      const fetchContas = async () => {
          const response = await axios.get(apiURL)
          let tempData = ([...response.data]).filter(c=>c.unidade===props.unidadeAtiva)
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

  const classificarmContas = () => {
    let xContas = [...mContas];
    xContas.sort( (a,b) => a.estrutural > b.estrutural ? 1 : -1 )
    setContas(xContas);      
  }

  return (

    <div className="Balancete">

        <Container>

            {isLoading && <Spinner className="" animation="border" />}

            {!isLoading &&
                <>TEXTO</>   
            }

            <div className="fs-6 fw-bold">
              Usuário: {props.usuarioAtivo}
            </div>

        </Container>
    
    </div>

  );

}

export default Balancete;

// ---------------------------------------------------------------------//
