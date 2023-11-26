import {Route,Routes } from 'react-router-dom'
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { PrivateRoutes } from './utils/PrivateRoutes';


const App = () => {
    return (
      <>
          <Routes>
            <Route element={<PrivateRoutes />}>
                <Route path='/' element={<Home/>}/>
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
      </>
    );
  };


export default App;