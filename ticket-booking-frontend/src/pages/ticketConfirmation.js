import React from 'react';
import { Col, Row } from 'reactstrap';
import TopHeader from './topHeader.js';
import Header from './header.js';
import Footer from './footer.js';


const TicketConfirmation= () => {
    
    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row>
                <Col md={2}></Col>
                <Col md={9} className="">
                <Row style={{ marginTop: "50px" }}>
                <h5 style={{ borderBottom: "3px solid black", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Ticket Confirmation</h5> <br />
                </Row>
                <br />
                    <Row>
                        <h6 style = {{textAlign: 'left'}}>Your Ticket is booked Successfully</h6>
                    </Row>
                </Col>
                <br />
            </Row>
            <Footer />
        </div>
    );
}

export default TicketConfirmation;