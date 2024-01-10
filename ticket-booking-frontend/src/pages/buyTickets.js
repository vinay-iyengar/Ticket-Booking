import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
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


const BuyTickets= () => {

    const [state, setState] = useState({
        movieName: '',
        showTime: '',
        numberOfTickets: '',
        id: '',
        price: '',
        movies: [],
        userName: '',
        totalPrice: '',
        redirectToPayment: false
    });

    const movieOnChange = (e) => {
        var config = {
            method: "get",
            url: "http://localhost:5000/api/movie/" + e.target.value,
        }

        axios(config)
            .then(function (response) {
                if (response.status == 200) {
                    setState({
                        ...state,
                        movieName: response.data.name,
                        showTime: response.data.showTime,
                        price: response.data.price,
                        id: response.data.id,
                    })
                }
            })
            .catch(function (error) {
                console.log(error.response)
            })
    }


    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        const newData = []
        var config = {
            method: "get",
            url: "http://localhost:5000/api/movie/"
        }

        axios(config)
            .then(function (response) {
                if (response.status == 200) {
                    setState({
                        ...state,
                        movies: response.data
                    })
                }
            })
            .catch(function (error) {
                console.log(error.response)
            })
    }, []);

    const buyTickets= () => {
        let email = localStorage.getItem("email");
        if (email == null) {
            alert("Please login to buy the tickets")
            return
        }

        if(state.id == '') {
            alert("Select Movie")
            document.getElementById("id").focus();
            return
        }

        if(state.numberOfTickets == '') {
            alert("Enter number of tickets")
            document.getElementById("numberOfTickets").focus();
            return
        }

        if(state.numberOfTickets < 0) {
            alert("Number of tickets should be greater than 0")
            document.getElementById("numberOfTickets").focus();
            return
        }

        setState({
            ...state,
            redirectToPayment: true,
            userName: email,
            totalPrice: Number(state.price) * Number(state.numberOfTickets),
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
                    {state.redirectToPayment ? <Redirect to={{ pathname: '/payments', data: { 
                        userName: state.userName,
                        movieName: state.movieName,
                        numberOfTickets: state.numberOfTickets,
                        totalPrice: state.totalPrice,
                        showTime: state.showTime,
                        } }} /> : null}
                        <h5 style={{ borderBottom: "3px solid black", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Buy Tickets</h5>
                        <Form>
                            <Row className='mt-2'>
                                <Col sm={3}><Label>Movies</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="id"
                                        name="id"
                                        type="select"
                                        value={state.id}
                                        onChange={movieOnChange}
                                    >
                                        <option value="">Select Movie</option>
                                        {state.movies.map((row, index) => {
                                            return (
                                                <option key={index} value={row.id}>{row.name}</option>
                                            );
                                        })};

                                    </Input>
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Show Time</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="showTime"
                                        name="showTime"
                                        placeholder="Show Time"
                                        type="time"
                                        disabled
                                        value={state.showTime}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Number of Tickets</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="numberOfTickets"
                                        name="numberOfTickets"
                                        placeholder="Number of Tickets"
                                        type="number"
                                        value={state.numberOfTickets}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <br />
                            <Row className='mt-2'>
                                <Col sm={3}></Col>
                                <Col sm={5}>
                                    <Button onClick={buyTickets} color="primary">Proceed to Payment</Button><br />
                                </Col>
                            </Row>
                        </Form>
                    </Row>
                </Col>
                <br />
            </Row>
            <Footer />
        </div>
    );
}

export default BuyTickets;