import React, { useState } from 'react';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import Footer from './footer.js';
import axios from 'axios';

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

const AddMovie = () => {

    const [state, setState] = useState({
        movieName: '',
        totalTickets: '',
        showTime: '',
        description: '',
        price: ''
    });

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const addMovie = () => {

        if (state.movieName === '') {
            alert("Enter Movie Name");
            document.getElementById('movieName').focus();
            return;
        }

        if (state.totalTickets === '') {
            alert("Enter Total Number of Tickets");
            document.getElementById('totalTickets').focus();
            return;
        }

        if (state.showTime === '') {
            alert("Select Show Time");
            document.getElementById('showTime').focus();
            return;
        }

        if (state.price === '') {
            alert("Enter Price");
            document.getElementById('price').focus();
            return;
        }

        let currentDate = new Date();
        let formattedCurrentDate = formatDate(currentDate)

        var jsonData = JSON.stringify({
            name: state.movieName,
            tickets: state.totalTickets,
            showTime: state.showTime,
            date: formattedCurrentDate.toString(),
            ticketsSold: 0,
            price: state.price,
            description: state.description
        })

        var config = {
            method: "post",
            url: "http://localhost:5000/api/movie",
            headers: {
                "Content-Type": "application/json",
            },
            data: jsonData,
        }

        axios(config)
            .then(function (response) {
                if (response.status == 201) {
                    setState({
                        ...state,
                        movieName: '',
                        totalTickets: '',
                        showTime: '',
                        description: '',
                        price: ''
                    })
                    alert("Added Succesfully")
                }
            })
            .catch(function (error) {
                alert(error.response.data.message);
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
                        <h5 style={{ borderBottom: "3px solid black", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Add Movie</h5>
                        <Form>
                            <Row className='mt-4'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Movie Name</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="movieName"
                                        name="movieName"
                                        placeholder="Movie Name"
                                        type="text"
                                        value={state.movieName}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Total Tickets</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="totalTickets"
                                        name="totalTickets"
                                        placeholder="Total Tickets"
                                        type="number"
                                        value={state.totalTickets}
                                        onChange={handleChange}
                                    />
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
                                        value={state.showTime}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Price</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="price"
                                        name="price"
                                        placeholder="Price"
                                        type="number"
                                        value={state.price}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className='mt-2'>
                                <Col sm={3} style={{ textAlign: "left" }}><Label>Description</Label></Col>
                                <Col sm={5}>
                                    <Input
                                        id="description"
                                        name="description"
                                        placeholder="Description"
                                        type="text"
                                        value={state.description}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <br />
                            <Row className='mt-2'>
                                <Col sm={3}></Col>
                                <Col sm={5}>
                                    <Button onClick={addMovie} color="primary">Submit</Button><br />
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

export default AddMovie;