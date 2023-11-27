import { useEffect, useRef, useState} from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setAuth} = useAuth()
    const userRef = useRef();
    const navigate = useNavigate()

    useEffect(() => {
        //@ts-ignore
        userRef.current.focus();
    }, []);

    const handleSubmit = async () => {
        console.log(username);
        console.log(password);
        try {
            const response = await axios.post('http://localhost:3000/login',
                { user: username, password },
                {
                    withCredentials: true
                });

            console.log(JSON.stringify(response?.data));

            if (response.data.success) {
                setAuth({ user: username, password});
                setUsername('');
                setPassword('');
                navigate('/');
            } else {
                console.log('Login failed:', response.data.message);
            }

            
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='bg-slate-800 h-screen w-screen flex justify-center items-center'>
            <div className='bg-slate-400 flex flex-col gap-8'>
                <h1 className='text-7xl m-3'>Sign In</h1>
                <div className='text-4xl p-4'>
                    <label htmlFor="username" className='block m-1'>Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        //@ts-ignore
                        ref={userRef}
                        placeholder='Enter username'
                        required
                        autoComplete='off'
                        className='text-slate-900 placeholder:text-slate-500 rounded-md outline-none p-3'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        />
                </div>
                <div className='text-4xl p-4'>
                    <label htmlFor="password" className='block m-1'>Password:</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Enter password'
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='text-slate-900 placeholder:text-slate-500 rounded-md outline-none p-3'
                    />
                </div>
                <button className='text-4xl pt-4 pb-4  bg-white m-4' onClick={() => handleSubmit()}>Login</button>
                <p className='text-xl p-4'>Already Have an Account? <Link to='/register' className='underline'>Register</Link></p>
            </div>
        </div>
  )
}

export default Login