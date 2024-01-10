import React, { useState } from 'react';
import { Button, Col, Form, Input, Label, NavLink, Row } from 'reactstrap';
import TopHeader from './topHeader';
import Header from './header';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';

const Login = () => {

    const [state, setState] = useState({
        email: '',
        password: '',
        userType: '',
    });

    const history = useHistory();

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    const login = () => {
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

        var config = {
            method: "get",
            url: "http://localhost:5000/api/users/" + state.email,
        }

        axios(config)
            .then(function (response) {
                if (response.status == 200) {
                    if (response.data.password === state.password && state.userType === response.data.userType) {
                        localStorage.setItem("name", response.data.name);
                        localStorage.setItem("email", response.data.email);
                        localStorage.setItem("userType", response.data.userType);
                        history.push('/');

                    } else {
                        alert("Invalid Input. Please verify")
                        return
                    }

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
            <Row style={{ marginTop: "50px" }}>
                <h5 style={{ borderBottom: "3px solid black", textAlign: "center", marginBottom: "20px", fontWeight: "700", fontSize: "20px" }}>Login</h5>
                <Col md={3}></Col>
                <Col md={9} className="justify-content-center">
                    <Form>
                        <Row className='mt-4'>
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
                                <Button onClick={login} color="primary">Login</Button><br />
                                <NavLink style={{ color: "blue" }} href="/register">New User? Register Here</NavLink>

                            </Col>
                        </Row>
                    </Form>
                </Col>
                <Col md={3}></Col>
            </Row>
        </div>
    );
}

export default Login;