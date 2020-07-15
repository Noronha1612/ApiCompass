import React, { useEffect, useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import ReturnArrow from '../../../components/ReturnArrow';

import api from '../../../services/api';

import logo from '../../../assets/logo.png';
import logoPreto from '../../../assets/logo-preto.png';

import "../forgotPass.css";
import "./styles.css";

interface ResponseApiChangePassword {
    logged: boolean | null;
    error: boolean | null;
    message: string | null;
    user_id: string | null;
    statusCode: number;
}

const ChangePassword = () => {
    const history = useHistory();

    const [ newPassword, setNewPassword ] = useState('');
    const [ confNewPassword, setConfNewPassword ] = useState('');

    const [ status, setStatus ] = useState(<h1 className="statusgray">Enter data</h1>);

    async function handleSubmit(event: FormEvent) {
        try {
            event.preventDefault();

            const data = {
                newPassword,
                confNewPassword
            }

            const jwtAuthToken = localStorage.getItem('jwtAuthToken');

            if ( jwtAuthToken === null ) {
                history.push('/user/forgotPassword');
                return;
            }

            const jwtTokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

            const payload = jwt.verify(jwtAuthToken, jwtTokenKey) as { userEmail: string };

            const response = await api.put<ResponseApiChangePassword>('/users/changePassword', data, { headers: { user_email: payload.userEmail } });
            
            history.push('/user/login');
        }
        catch(err) {
            const {
                message,
                statusCode,
            } = err.response.data;

            if ( statusCode === 400) {
                // User error has occurred

                setStatus(<h1 className="statusred" style={{ fontSize: 16 }}>{message}</h1>);

                return;
            }
            else if ( statusCode === 500 ) {
                // Server error has occured

                setStatus(<h1 className="statusred">Internal Server Error: 500</h1>);

                return;
            }
        }
    }

    useEffect(() => {
        const jwtAuthToken = localStorage.getItem('jwtAuthToken');

        if ( !jwtAuthToken ) {
            history.push('/user/forgotPassword');
            return;
        }

        const jwtTokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

        const payload = jwt.verify(jwtAuthToken, jwtTokenKey) as { exp: number };

        if ( payload.exp < Date.now() ) {
            localStorage.removeItem('jwtAuthToken');

            history.push('/user/forgotPassword');
            return;
        }
    }, []);

    return (
        <div className="form-container">
            
            <ReturnArrow />

            <img src={logo} alt="logo-background" className="background-logo" />

            <div className="changePassword box-container">
                <form action="" onSubmit={ handleSubmit } >
                    <img src={logoPreto} alt="logo-preto"/>

                    { status }

                    <input type="password" placeholder="New Password" value={newPassword} onChange={ e => setNewPassword(e.target.value) } />

                    <input type="password" placeholder="Confirm Password" value={confNewPassword} onChange={ e => setConfNewPassword(e.target.value) } />

                    <button type="submit">Change</button>
                </form>
            </div>
        </div>
    )
}

export default ChangePassword;
