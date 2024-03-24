import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../../styles/AuthStyles.css';
import { useAuth } from '../../context/auth';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import google from "../../images/google.png";
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const location = useLocation();;
    const dropdownRef = useRef(null);
    const [user, setUser] = useState([]);
    const { isLoggedIn, profile, logIn, logOut } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`/api/v1/auth/login`, { email, password });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                });
                localStorage.setItem('auth', JSON.stringify(res.data));
                navigate(location.state || '/');
            }
            else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            toast.success("User login successfully");
            setAuth({
                ...auth,
                user: codeResponse, // Assuming `codeResponse` contains user data
            });

        },
        onError: (error) => console.log('Login Failed:', error)
    });
    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {

                    axios.post('/api/v1/auth/googleLogin', { profile: res.data }).then((response) => {
                        console.log('User register successfully', response.data);
                        const token = response.data.token;
                        console.log('User Name:', auth?.user?.name);
                        navigate('/')
                        window.location.reload();
                        localStorage.setItem('auth', JSON.stringify(response.data));
                    });
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    return (
        <Layout title="Register Ecommerce App">
            <div className="form-container">
                <h1>LOGIN</h1>
                <form onSubmit={handleSubmit}>
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
                        <button type="button" className="btn btn-primary" onClick={() => { navigate('/forgot-password') }}>Forgot Password</button>

                    </div>


                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
                <button onClick={handleGoogleLogin} className='google-btn'>
                    <img src={google} alt="" className='google-img' />
                    <span>Sign in with Google</span>
                </button>
                {/* <div id="google-signin-button"></div> */}
            </div>
        </Layout>
    )
}

export default Login