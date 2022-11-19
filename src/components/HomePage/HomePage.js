import { useState } from "react";
import { Form, Button } from "react-bootstrap"

function HomePage(props) {

  const [ form, SetForm ] = useState({codigoUsuario: props.usuario, codigoUnidade: props.unidade})

  const handleSubmit = (e) => {
    e.preventDefault();
    props.validaWork(form.codigoUsuario, form.codigoUnidade);
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
                       placeholder="Informe o usuário"
                       name="codigoUsuario" value={form.codigoUsuario}
                       onChange={handleChange}
                   />
               </Form.Group>

               <Form.Group className="mb-3">
                   <Form.Label>Codigo da Unidade</Form.Label>
                   <Form.Control type="text"
                       placeholder="Informa a unidade"
                       name="codigoUnidade" value={form.codigoUnidade}
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
