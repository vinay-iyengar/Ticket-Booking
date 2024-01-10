import { faFilm, faHeadset, faHome, faLaptop, faMusic, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('');


    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    }

    const history = useHistory();

    let email = localStorage.getItem("email")

    useEffect(() => {
        if (email !== null) {
            setIsLoggedIn(true)
            setName(localStorage.getItem("name"))
            setUserType(localStorage.getItem("userType"))
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        sessionStorage.clear();
    }

    const loginValidation = (e) => {
        if (email == null) {
            alert("Please login to view the tickets")
        } else {
            history.push('/tickets');
        }
    }

    return (
        <Navbar dark expand="md" className="mx-auto" style={{backgroundColor: "#002966"}}>
            <NavbarToggler onClick={toggleNavbar} />
            <Collapse isOpen={isOpen} navbar>
                {isLoggedIn && userType === "ADMIN"?
                    <Nav className="justify-content-center" style={{ flex: 1 }} navbar>
                        <NavItem>
                            <NavLink href="/ticket-bookings">Ticket Bookings</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/add-movie">Add Movie</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/update-movie">Update Movie</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/delete-movie">Delete Movie</NavLink>
                        </NavItem>
                    </Nav> :
                    <Nav className="justify-content-center" style={{ flex: 1 }} navbar>
                        <NavItem>
                            <NavLink href="/"><FontAwesomeIcon icon={faHome}></FontAwesomeIcon>&nbsp; Home</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/buy-tickets"><FontAwesomeIcon icon={faFilm}></FontAwesomeIcon>&nbsp;Buy Tickets</NavLink>
                        </NavItem>
                    </Nav> }
                <Nav className="justify-content-end" navbar>
                    {userType === "ADMIN" ? null :
                        <NavItem>
                            <NavLink style={{ cursor: "pointer" }} onClick={() => loginValidation()} >Tickets</NavLink>
                        </NavItem>}

                    {isLoggedIn ? <>
                        <NavItem>
                            <NavLink href="/home">Hi, {name}</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={() => logout()} href="/login">Logout</NavLink>
                        </NavItem>
                    </> :
                        <NavItem>
                            <NavLink href="/login">Login</NavLink>
                        </NavItem>
                    }
                </Nav>
            </Collapse>
        </Navbar >
    );
}

export default Header;