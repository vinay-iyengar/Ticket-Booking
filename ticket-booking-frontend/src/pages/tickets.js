import React, { useEffect, useState } from 'react';
import { Col, Row, Table } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import Footer from './footer.js';
import axios from 'axios';

const Tickets = () => {
    const [state, setState] = useState({
        bookings: [],
        redirectToCancelPage: false
    })

    useEffect(() => {
        let email = localStorage.getItem("email");
        var config = {
            method: "get",
            url: "http://localhost:5000/api/bookings/" + email
        }

        axios(config)
            .then(function (response) {
                if (response.status == 200) {
                    setState({
                        ...state,
                        bookings: response.data
                    })
                }
            })
            .catch(function (error) {
                console.log(error.response)
            })

    }, []);

    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row>
            <Col md={2}></Col>
                <Col md={9}>
                    <Row style={{ marginTop: "45px" }}>
                        <h4 style={{ textAlign: "left", fontWeight: "700", fontSize: "25px", color: "darkblue" }}>Tickets</h4> <br />
                        <br />
                        <Table striped>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Movie Name</th>
                                    <th>Total Tickets</th>
                                    <th>Total Price</th>
                                    <th>Show Time</th>

                                </tr>
                            </thead>
                            <tbody>
                                {state.bookings.map((rowData, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{rowData.movieName}</td>
                                        <td>{rowData.totalTickets}</td>
                                        <td>{rowData.totalPrice}</td>
                                        <td>{rowData.showTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Row>
                </Col>
            </Row>
            <br /><br />
            <Footer />
        </div>
    );
}

export default Tickets;