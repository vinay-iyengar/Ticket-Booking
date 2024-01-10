import React from 'react';
import { Col, Row } from 'reactstrap';

const TopHeader = () => {
  return (
    <div>
        <Row className='m-4'>
            <Col md = {12}>
                <h2 style={{color: "black", textAlign: "center"}}>Theatre Ticket Booking</h2>
            </Col>
        </Row>
    </div>
  );
}

export default TopHeader;