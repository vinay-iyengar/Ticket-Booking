import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, Row } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import SideBar from './sideBar.js';
import Footer from './footer.js';
import axios from 'axios';

const DeleteMovie = () => {

    const [state, setState] = useState({
        movieName: '',
        totalTickets: '',
        showTime: '',
        description: '',
        price: '',
        id: '',
        movies: []
    });

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
                        totalTickets: response.data.tickets,
                        showTime: response.data.showTime,
                        description: response.data.description,
                        price: response.data.price,
                        id: response.data.id,
                    })
                }
            })
            .catch(function (error) {
                console.log(error.response)
            })
    }

    const deleteMovie = () => {
        if (window.confirm('Are you sure you want to delete the product?')) {
            var config = {
                method: "delete",
                url: "http://localhost:5000/api/movie/" + state.id,
            }

            axios(config)
                .then(function (response) {
                    if (response.status == 200) {
                        alert("Deleted Successfully")
                    }
                })
                .catch(function (error) {
                    console.log(error.response)
                })
            } else {}
    }

    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row>
                <Col md={2}></Col>
                <Col md={9} className="">
                    <Row style={{ marginTop: "45px" }}>
                        <h5 style={{ borderBottom: "3px solid black", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Delete Movie</h5>
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
                                    <Button onClick={deleteMovie} color="danger">Delete</Button><br />
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

export default DeleteMovie;