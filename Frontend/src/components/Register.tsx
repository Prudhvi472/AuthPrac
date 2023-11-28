import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email,setEmail] = useState('')
    const {setAuth} = useAuth()
    const userRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate()

    useEffect(() => {
        userRef.current?.focus()
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3000/protected', {
              withCredentials: true,
            });
    
            if (response.data.success) {
              // Assuming you have a username available
              const username = response.data.user;
    
              // Perform actions based on successful authentication
              // For example, update state, clear form fields, and navigate to another page
              setAuth({ user: username });
              setUsername('');
              setPassword('');
              navigate('/');
            }
    
          } catch (error) {
            // Handle errors, e.g., log them or show a message to the user
            console.error("Error fetching data:", error);
          }
        };
    
        fetchData();
      }, [navigate]);

    const handleSubmit = async () => {
        console.log(username);
        console.log(password);
        console.log(email);
        try{

            const response = await axios.post('http://localhost:3000/register',
            {user:username , password},
            {
                withCredentials:true
            });
            console.log(JSON.stringify(response?.data));
            if (response.data.success) {
                setUsername('');
                setPassword('');
                setEmail('')
                navigate('/login');
            } else {
                console.log('Login failed:', response.data.message);
            }
        }
        catch(error)
        {
            console.log(error);
        }
    };

  return (
    <div className='bg-slate-800 h-screen w-screen flex justify-center items-center'>
            <div className='bg-slate-400 flex flex-col gap-8'>
                <h1 className='text-7xl m-3'>Sign In</h1>
                <div className='text-4xl p-4'>
                    <label htmlFor="email" className='block m-1'>Email:</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder='Enter username'
                        required
                        autoComplete='off'
                        className='text-slate-900 placeholder:text-slate-500 rounded-md outline-none p-3'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                </div>
                <div className='text-4xl p-4'>
                    <label htmlFor="username" className='block m-1'>Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
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
                <p className='text-xl p-4'>Already Have an Account? <Link to='/login' className='underline'>login</Link></p>
            </div>
        </div>
  )
}

export default Register