
import React from 'react';

import './pages/footer.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './pages/home';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';
import Login from './pages/login';
import Register from './pages/register';
import AddMovie from './pages/addMovie';
import UpdateMovie from './pages/updateMovie';
import DeleteMovie from './pages/deleteMovie';
import BuyTickets from './pages/buyTickets';
import Tickets from './pages/tickets';
import TicketBookings from './pages/ticketBookings';
import Payment from './pages/payment';
import TicketConfirmation from './pages/ticketConfirmation';


function App() {
  return (
    <Router>
        <Switch>
          <Route path="/" exact component={Home} />

          <Route path="/add-movie" exact component={AddMovie} />
          <Route path="/update-movie" exact component={UpdateMovie} />
          <Route path="/delete-movie" exact component={DeleteMovie} />
          <Route path="/buy-tickets" exact component={BuyTickets} />
          <Route path="/tickets" exact component={Tickets} />
          <Route path="/ticket-bookings" exact component={TicketBookings} />
          <Route path="/payments" exact component={Payment} />
          <Route path="/ticket-confirmation" exact component={TicketConfirmation} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="*" component = {Home}/>
        </Switch>
    </Router>
  );
}

export default App;
