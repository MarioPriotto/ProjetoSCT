import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavigationBar(props) {

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand>Contabil</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                { props.work.unidade > 0 && props.work.usuario > 0 && 
                    <Nav className="me-auto">
                        <Link className="nav-link" to="/">Login</Link>
                            <Link className="nav-link" to="/contas">Contas</Link>
                            {/* <Link className="nav-link" to="/usuarios">Usuarios</Link>
                            <Link className="nav-link" to="/unidades">Unidades</Link>                        
                            <Link className="nav-link" to="/historicos">Historicos</Link>                        
                            <Link className="nav-link" to="/lancamentos">Lançamentos</Link> */}
                    </Nav>
                }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavigationBar