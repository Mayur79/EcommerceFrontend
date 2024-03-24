import React, { useState, useRef, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import google from "../../images/google.png";
const Register = () => {
    //useState is to modify and submit value
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [answer, setAnswer] = useState('');
    const navigate = useNavigate();
    const [user, setUser] = useState([]);


    //form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/v1/auth/register`, { name, email, password, phone, address, answer });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate('/login')

            }
            else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    }

    const handleGoogleRegister = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            toast.success("User registered Successfully", {
                autoClose: 1000,
            });
        },
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(() => {
        if (user) {
            const res = axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },

                })

                .then((res) => {

                    // Send the user data to your Express API route
                    axios.post('/api/v1/auth/storeUserData', { profile: res.data }).then((response) => {
                        console.log('User data stored successfully:', response.data);
                        localStorage.setItem('auth', JSON.stringify(response.data));
                        navigate('/login')
                    });
                })
                .catch((err) => console.log(err));
        }
    }, [user]);
    return (
        <Layout title="Register Ecommerce App">
            <div className="form-container">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder='Enter your name'
                            required />

                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder='Enter your Email'
                            required />

                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder='Enter your password'
                            required />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder='Enter your phone number'
                            required />
                    </div>
                    <div className="mb-3">

                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder='Enter your address'
                            required />
                    </div>
                    <div className="mb-3">

                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder='Enter your Favourite Youtuber name'
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
                </form>
                <button onClick={handleGoogleRegister} className='google-btn'>
                    <img src={google} alt="" className='google-img' />
                    <span>Sign up with Google</span>
                </button>
            </div>
        </Layout>
    )
}

export default Register