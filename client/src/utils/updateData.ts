import jwt from 'jsonwebtoken';

import api from '../services/api';

interface UpdatedUserData {
    error: boolean;
    data: {
        id: string;
        name: string;
        email: string;
        api_ids: string;
        liked_apis: string;
    } | null;
    message: string | null
}

export default async function updateData() {
    const loggedUserToken = localStorage.getItem('user_token');

    if ( !loggedUserToken ) {
        return;
    }

    const tokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

    const payload = jwt.verify( loggedUserToken, tokenKey ) as { id: string };

    const { data: updatedUserData } = await api.get<UpdatedUserData>(`/users/list?user_id=${payload.id}`);

    if ( updatedUserData.error || !updatedUserData.data ) {
        return;
    }

    const {
        id,
        name,
        email,
        api_ids,
        liked_apis,
    } = updatedUserData.data;

    const payloadNewToken = {
        id,
        name,
        email,
        api_ids,
        liked_apis,
        logged: true
    }

    const response = await api.post<{ token: string }>('/services/generateToken', { payload: payloadNewToken });

    const { token } = response.data;

    localStorage.removeItem('user_token');
    localStorage.setItem('user_token', token);
}