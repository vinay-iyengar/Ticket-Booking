import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import SideBar from './sideBar';
import Dashboard from './dashboard';
import Footer from './footer';

const Home = () => {

    const [userType, setUserType] = useState('');

    useEffect(() => {
        let email = localStorage.getItem("email")
        if (email !== null) {
            setUserType(localStorage.getItem("userType"))
        }
    }, []);

    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row>
                <Col md={2}></Col>
                <Col md={9}><Dashboard /></Col>
            </Row>
            <Footer />
        </div>
    );
}

export default Home;