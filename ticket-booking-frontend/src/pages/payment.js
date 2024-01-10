import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, Row, Table } from 'reactstrap';
import TopHeader from './topHeader.js';
import Header from './header.js';
import SideBar from './sideBar.js';
import Footer from './footer.js';
import axios from 'axios';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min.js';

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}


const Payment= (props) => {

    const [state, setState] = useState({
        movieName: '',
        showTime: '',
        numberOfTickets: '',
        userName: '',
        totalPrice: '',
        paymentMethod: '',
        redirectToTicketConfirmation: false
    });


    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        setState({
            ...state,
            movieName: props.location.data.movieName,
            showTime: props.location.data.showTime,
            numberOfTickets: props.location.data.numberOfTickets,
            userName: props.location.data.userName,
            totalPrice: props.location.data.totalPrice,
        })
    }, []);

    const confirmPayment= () => {

        if(state.paymentMethod == '') {
            alert("Select Payment Method")
            document.getElementById("paymentMethod").focus();
            return
        }

        let currentDate = new Date();
        let formattedCurrentDate = formatDate(currentDate)

        var jsonData = JSON.stringify({
            userName: state.userName,
            movieName: state.movieName,
            totalTickets: state.numberOfTickets,
            totalPrice: state.totalPrice,
            showTime: state.showTime,
            date: formattedCurrentDate.toString(),
            status: "Active"
        })

        var config = {
            method: "post",
            url: "http://localhost:5000/api/bookings",
            headers: {
                "Content-Type": "application/json",
            },
            data: jsonData,
        }

        axios(config)
            .then(function (response) {
                if (response.status == 201) {
                    console.log(response.data)

                    var jsonData1 = JSON.stringify({
                        bookingId: response.data.bookingId,
                        amount: state.totalPrice,
                        method: state.paymentMethod,
                        status: "SUCCESS",
                    })
            
                    var config1 = {
                        method: "post",
                        url: "http://localhost:5000/api/payments",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: jsonData1,
                    }

                    axios(config1)
                    .then(function (response1) {
                        if (response1.status == 201) {
                            setState({
                                ...state,
                                redirectToTicketConfirmation: true
                            })
                        }
                    })
                    .catch(function (error1) {
                        // alert(error.response.data.message);
                        console.log(error1.response)
                    })

                }
            })
            .catch(function (error) {
                // alert(error.response.data.message);
                console.log(error.response)
            })
    }

    
    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row>
                <Col md={2}></Col>
                <Col md={9} className="">
                    <Row style={{ marginTop: "45px" }}>
                        <h5 style={{ borderBottom: "3px solid black", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Payment</h5>
                        {state.redirectToTicketConfirmation ? <Redirect to={{ pathname: '/ticket-confirmation' }} /> : null}
                        <Table striped>
                            <tbody>
                                <tr>
                                    <td>Movie Name</td>
                                    <td>{state.movieName}</td>
                                </tr>
                                <tr>
                                    <td>Show Time</td>
                                    <td>{state.showTime}</td>
                                </tr>
                                <tr>
                                    <td>Number of Tickets</td>
                                    <td>{state.numberOfTickets}</td>
                                </tr>
                                <tr>
                                    <td>Total Price</td>
                                    <td>${state.totalPrice}</td>
                                </tr>
                            </tbody>
                        </Table>
                        <br />

                        <Row className='mt-4'>
                            <Col sm={3} style={{ textAlign: "left" }}><Label>Payment Method</Label></Col>
                            <Col sm={5}>
                                <Input
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    type="select"
                                    value={state.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Debit Card">Debit Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Netbanking">Netbanking</option>
                                </Input>
                            </Col>
                        </Row>
                       
                            <br />
                            <br />
                            <Row className='mt-2'>
                                <Col sm={3}></Col>
                                <Col sm={5}>
                                    <Button onClick={confirmPayment} color="primary">Confirm</Button><br />
                                </Col>
                            </Row>
                    </Row>
                </Col>
                <br />
            </Row>
            {/* <Footer /> */}
        </div>
    );
}

export default Payment;