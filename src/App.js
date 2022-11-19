import Contas from "./components/Contas/Contas";
// import Usuarios from "./components/Usuarios/Usuarios";
// import Historicos from "./components/Historicos/Historicos";
// import Unidades from "./components/Unidades/Unidades";
// import Lancamentos from "./components/Lancamentos/Lancamentos";
import HomePage from './components/HomePage/HomePage';
import NavigationBar from './components/NavigationBar/NavigationBar';

import { Routes, Route } from 'react-router-dom';
import { useState } from "react";

function App() {
  
  const [work, setWork] = useState({usuario: 0, unidade: 0});

  const validaWork = (usuario, unidade) => {
    setWork( { usuario: usuario, unidade: unidade } );
  }

  return (

    <div className="App">

      <NavigationBar work={work} />

      <Routes>
      
        <Route path="/contas" element={<Contas/>} />
        {/* <Route path="/usuarios" element={<Usuarios/>} />
        <Route path="/historicos" element={<Historicos/>} />
        <Route path="/unidades" element={<Unidades/>} />
        <Route path="/lancamentos" element={<Lancamentos/>} /> */}

        <Route path="/" element={<HomePage validaWork={validaWork} usuario={work.usuario} unidade={work.unidade}/>} />
        
      </Routes>

    </div>

  );

}

export default App;
