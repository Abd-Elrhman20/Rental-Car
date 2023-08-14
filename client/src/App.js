import './App.css';
import { Route, BrowserRouter, Redirect } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import BookingCar from './pages/BookingCar.jsx'
import 'antd/dist/antd.css';
import UserBookings from './pages/UserBookings.jsx';
import AddCar from './pages/AddCar.jsx';
import AdminHome from './pages/AdminHome.jsx';
import EditCar from './pages/EditCar.jsx';

function App() {

  return (
    <div className="App">

      <BrowserRouter>

        <ProtectedRoute path='/' exact component={Home} />
        <Route path='/login' exact component={Login} />
        <Route path='/register' exact component={Register} />
        <ProtectedRoute path='/booking/:carid' exact component={BookingCar} />
        <ProtectedRoute path='/userbookings' exact component={UserBookings} />
        <ProtectedRoute path='/addcar' exact component={AddCar} />
        <ProtectedRoute path='/editcar/:carid' exact component={EditCar} />
        <ProtectedRoute path='/admin' exact component={AdminHome} />

      </BrowserRouter>

    </div>
  );
}



export default App;


export function ProtectedRoute(props) {


  if (localStorage.getItem('user')) {
    return <Route {...props} />
  }
  else {
    return <Redirect to='/login' />
  }

}
