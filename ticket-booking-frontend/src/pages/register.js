import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, Label, NavLink, Row } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import axios from 'axios';

const Register = () => {

    const [state, setState] = useState({
        name: '',
        email: '',
        password: '',
        userType: '',
    });

    const register = () => {
        if (state.name === '') {
            alert("Enter Name");
            document.getElementById("name").focus();
            return;
        }

        if (state.email === '') {
            alert("Enter Email");
            document.getElementById("email").focus();
            return;
        }

        if (state.password === '') {
            alert("Enter Password");
            document.getElementById("password").focus();
            return;
        }

        if (state.userType === '') {
            alert("Select User Type");
            document.getElementById("userType").focus();
            return;
        }

        var jsonData = JSON.stringify({
            name: state.name,
            email: state.email,
            password: state.password,
            userType: state.userType,
        })

        var config = {
            method: "post",
            url: "http://localhost:5000/api/users",
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
                        name: "",
                        email: "",
                        password: "",
                        userType: "",
                    })
                    alert("Registered Succesfully")
                }
            })
            .catch(function (error) {
                alert(error.response.data.message + ": User already exists");
                console.log(error.response)
            })
    }

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="App">
            <TopHeader />
            <Header />
            <Row style={{ marginTop: "50px" }}>
                <h5 style={{ borderBottom: "3px solid black", textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Register</h5>
                <Col md={3}></Col>
                <Col md={9} className="justify-content-center">
                    <Form>
                        <Row className='mt-2'>
                            <Col sm={3}>
                                <Label for="name">Name</Label>
                            </Col>
                            <Col sm={5}>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Name"
                                    type="username"
                                    value={state.name}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col sm={3}>
                                <Label for="username">Email</Label>
                            </Col>
                            <Col sm={5}>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    type="email"
                                    value={state.email}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col sm={3}>
                                <Label for="password">Password</Label>
                            </Col>
                            <Col sm={5}>
                                <Input
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={state.password}
                                    onChange={handleChange}
                                />
                            </Col>
                        </Row>
                        <Row className='mt-2'>
                            <Col sm={3}>
                                <Label for="userType">UserType</Label>
                            </Col>
                            <Col sm={5}>
                                <Input
                                    id="userType"
                                    name="userType"
                                    type="select"
                                    value={state.userType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select</option>
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Admin</option>
                                </Input>
                            </Col>
                        </Row>
                        <br />
                        <Row className='mt-2'>
                            <Col sm={3}></Col>
                            <Col sm={5}>
                                <Button onClick={register} color="primary">Register</Button><br />
                                <NavLink style={{ color: "blue" }} href="/login">Already a User? Login Here</NavLink>

                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col md={3}></Col>
            </Row>
        </div>
    );
}

export default Register;