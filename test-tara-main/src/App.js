import Main from './Main';
import "./styles.css";
import Register from './Pages/Register';
import Login from './Pages/Login';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import PasswordChange from './Pages/PasswordChange';
import ContactPage from './Pages/ContactPage';
import Admin from './Pages/Admin';
import Chart from './chart/chart';
import MyAccount from './Pages/MyAccount';
import EditData_AP from './Pages/EditData_AP1';
import FirstPage from './Pages/FirstPage';
import Attack_Path from './Pages/App';

function App() {

  React.useEffect(() => {
    // Change the title of the web page
    document.title = 'Si-TaRA';
  }, []);

  return (
    <Router>
      <Routes>
          <Route exact path='/register' element={<Register />}></Route>
          <Route path='/home' element={<FirstPage />} />
          <Route path='/' element={<Login/>} />
          <Route path='/passwordChange' element={ <PasswordChange/> } />
          <Route path='/Contacts' element={ <ContactPage/> } />
          <Route path='/AdminLogin' element={<Admin/>} />
          <Route path='/charts' element={<Chart/>} />
          <Route path='/myAccount' element={<MyAccount/>} />
          <Route path='/EditData' element={ <EditData_AP/> } />
          <Route path='/main' element={ <Main/> } />
          <Route path='/attackPath' element={ <Attack_Path/> } />
      </Routes>
    </Router>
  );
}
export default App;
