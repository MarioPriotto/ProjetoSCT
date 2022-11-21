import axios from "axios"
import { useState, useEffect } from "react"
import { Form, Button } from "react-bootstrap"
import { useNavigate} from "react-router-dom"

function HomePage(props) {

  const navigate = useNavigate()

  const [ form, SetForm ] = useState({codigoUsuario: props.usuario, codigoUnidade: props.unidade, senha: ""})

  const [ mUsuarios, setUsuarios] = useState([])
  const [ mUnidades, setUnidades] = useState([])

  useEffect(() => {
    lerUsuarios()
    lerUnidades()
  }, [])

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerUsuarios = () => {
    try {
      const fetchUsuarios = async () => {
          const response = await axios.get("https://ironrest.herokuapp.com/mUsuarios")
          setUsuarios(response.data)
      }
      fetchUsuarios()
    } catch (error) {
      console.log(error) 
    }
  }  

  // Le os dados na Internet e armazena em Matriz (de estado)
  const lerUnidades = () => {
    try {
      const fetchUnidades = async () => {
          const response = await axios.get("https://ironrest.herokuapp.com/mUnidades")
          setUnidades(response.data)
      }
      fetchUnidades()
    } catch (error) {
      console.log(error) 
    }
  }  

  const handleSubmit = (e) => {
    e.preventDefault();
    lerUsuarios();
    if ( mUsuarios.some( c=>c.codigo===form.codigoUsuario & c.senha===form.senha ) & 
         mUnidades.some( c=>c.codigo===form.codigoUnidade )
       ) {
       props.validaWork(form.codigoUsuario, 
                        form.codigoUnidade, 
                        mUnidades[mUnidades.findIndex(c=>c.codigo===form.codigoUnidade)].descricao, 
                        mUsuarios[mUsuarios.findIndex(c=>c.codigo===form.codigoUsuario)].permissao
                       );
    }  else {
       props.validaWork(0, 0);
       navigate("/")
    }
  }

  const handleChange = (e) => {
    SetForm({...form, [e.target.name]: e.target.value})
  }

  return (
    <div className="HomePage d-flex justify-content-center">

      <div className="m-5 d-flex justify-content-center" style={{width: '200px'}}>

           <Form onSubmit={handleSubmit} className="text-center">

               <Form.Group className="mb-3">
                   <Form.Label>Codigo do Usuário:</Form.Label>
                   <Form.Control type="text"
                       name="codigoUsuario" value={form.codigoUsuario}
                       onChange={handleChange}
                   />
               </Form.Group>

               <Form.Group className="mb-3">
                   <Form.Label>Codigo da Unidade</Form.Label>
                   <Form.Control type="text"
                       name="codigoUnidade" value={form.codigoUnidade}
                       onChange={handleChange}
                   />
               </Form.Group>

               <Form.Group className="mb-3">
                   <Form.Label>Senha</Form.Label>
                   <Form.Control type="password"
                       name="senha" value={form.senha}
                       onChange={handleChange}
                   />
               </Form.Group>

               <Button variant="success" type="submit">SELECIONAR</Button>
               
           </Form>

      </div>

    </div>
  );
}

export default HomePage;
