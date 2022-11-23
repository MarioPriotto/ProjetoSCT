import Contas from "./components/Contas/Contas";
import Usuarios from "./components/Usuarios/Usuarios";
import Historicos from "./components/Historicos/Historicos";
import Unidades from "./components/Unidades/Unidades";
import Lancamentos from "./components/Lancamentos/Lancamentos";
import HomePage from './components/HomePage/HomePage';
import NavigationBar from './components/NavigationBar/NavigationBar';
import BaseDados from './components/BaseDados/BaseDados';
import Balancete from './components/Balancete/Balancete';

import { Routes, Route } from 'react-router-dom';
import { useState } from "react";

import { Container } from "react-bootstrap";

function App() {

  const [work, setWork] = useState({usuario: 0, unidade: 0, descricaoUnidade: "", permissao: ""});

  const validaWork = (usuario, unidade, descricaoUnidade, permissao) => {
    setWork( { usuario: usuario, unidade: unidade, descricaoUnidade: descricaoUnidade, permissao: permissao } );
  }

  return (

    <div className="App">

      <NavigationBar work={work} />

      <Routes>
      
        {/* { work.usuario > 0 && work.unidade > 0 &&  */}

            <Route path="/contas" element={<Contas unidadeAtiva={work.unidade} usuarioAtivo={work.usuario} />} />
            {/* { work.permissao === 'Administrativa' &&  */}

            { work.permissao === 'Administrativa' && <Route path="/usuarios" element={<Usuarios/>}/> }
            { work.permissao === 'Administrativa' && <Route path="/basedados" element={<BaseDados/>}/> }

            {/* } */}
            <Route path="/unidades" element={<Unidades/>} />
            <Route path="/historicos" element={<Historicos unidadeAtiva={work.unidade} usuarioAtivo={work.usuario} />} />
            <Route path="/lancamentos" element={<Lancamentos unidadeAtiva={work.unidade} usuarioAtivo={work.usuario} />} />
            <Route path="/balancete" element={<Balancete unidadeAtiva={work.unidade} usuarioAtivo={work.usuario} />} />

        {/* } */}

        <Route path="/" element={<HomePage validaWork={validaWork} usuario={work.usuario} unidade={work.unidade}/>} />

      </Routes>

    </div>

  );

}

export default App;
