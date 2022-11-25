import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavigationBar(props) {

    return (
        <Navbar bg="primary" variant="dark" expand="sm">
            <Container>
                <Navbar.Brand>
                    { props.work.usuario > 0 && <> [{props.work.unidade}] - {props.work.descricaoUnidade} </>}
                    { props.work.usuario === 0 && <>Faça Login!!!</>}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    { props.work.unidade > 0 && props.work.usuario > 0 && 
                        <Nav className="me-auto">
                            <Link className="nav-link" to="/">Login</Link>
                                <Link className="nav-link" to="/contas">Contas</Link>
                                { props.work.permissao === "Administrativa" && <Link className="nav-link" to="/usuarios">Usuarios</Link> }
                                { props.work.permissao === "Administrativa" && <Link className="nav-link" to="/unidades">Unidades</Link> }
                                { props.work.permissao === "Administrativa" && <Link className="nav-link" to="/basedados">(BD)</Link> }
                                <Link className="nav-link" to="/historicos">Historicos</Link>                        
                                <Link className="nav-link" to="/lancamentos">Lançamentos</Link>
                                <Link className="nav-link" to="/balancete">Balancete</Link>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar