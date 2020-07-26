import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import api from '../../services/api';

import Header from '../../components/Header';
import Footer from '../../components/Footer';

import "./styles.css";

import queryString from 'query-string';

interface ProfileProps {
  location: {
    search: string
  }
}

interface UserData {
  name: string;
  score: number;
  api_ids: string;
  followers: string;
  following: string;
}

interface UserResponse {
  error: boolean;
  data?: UserData;
  message?: string;
}
interface APIData {
  id: number;
  apiName: string;
  likes: number;
}

interface APIResponse {
  error: boolean;
  data?: APIData[];
  message?: string;
}

const NotUserProfile: React.FC<{user_id: string}> = ({ user_id }) => {
  return (
    <div>NotUserProfile</div>
  )
}

const UserProfile: React.FC<{ user_id: string }> = ({ user_id }) => {
  const [ userData, setUserData ] = useState<UserData>({
    api_ids: '',
    name: '',
    score: 0,
    followers: '',
    following: '',
  });

  const [ userLikes, setUserLikes ] = useState(0);

  function sum(numbers: number[]) {
    const sum = numbers.reduce((acumulator, actual) => acumulator + actual );

    return sum;
  }

  useEffect(() => {
    async function getUserData() {
      const response = await api.get<UserResponse>(`/users/list?user_id=${user_id}`);

      if ( response.data.data ) {
        setUserData(response.data.data);
      }
      else if ( response.data.message ) {
        console.log(response.data.message);
        return;
      }
    }

    getUserData();
  }, [ user_id ]);

  console.log(typeof userData.api_ids);

  useEffect(() => {
    async function getTotalLikes() {
      const response = await api.get<APIResponse>('/apis/list/ids', { headers: {
        api_ids: userData.api_ids,
      }});

      if ( response.data.data ) {
        const likesArray = response.data.data.map( api => api.likes );

        setUserLikes(sum(likesArray));
      }
      else if ( response.data.message ) {
        console.log( response.data.message );
      }
    }

    getTotalLikes();
  }, [ userData ]);

  return (
    <div className="profile-container">
      <section className="first-section">
        <div className="user-info first-half">
          <h1 className="user-name">
            { userData.name }
          </h1>
        
          {/* <span className="social-medias"></span> */}

          <div className="followage">
            <div className="followers">{userData.followers ? userData.followers.split(',').length : 0} Followers</div>
            <div className="following">{userData.following ? userData.following.split(',').length : 0} Following</div>
          </div>
          <br/>
          <button className="edit-profile">
            Edit Profile
          </button>
        </div>

        <div className="user-info second-half">
          <div className="amount-apis info-box">
            Number of APIs: {userData.api_ids.split(',').length}
          </div>
          
          <div className="total-likes info-box">
            Total of likes: {userLikes}
          </div>

          <div className="score info-box">
            Score: {userData.score}
          </div>
        </div>
      </section>
    </div>
  );
}

const Profile: React.FC<ProfileProps> = ({ location }) => {
  const values = queryString.parse(location.search);

  const history = useHistory();

  const [ userProfile, setUserProfile ] = useState(false);

  useEffect(() => {
    const user_token = localStorage.getItem('user_token');

    if ( !values.user_id ) {
      history.push('/');
    }
    else if ( !user_token ) {
      return;
    }
    else {
      const tokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

      const payload = jwt.verify(user_token, tokenKey) as { id: string };

      if ( values.user_id === payload.id ) {
        setUserProfile(true);
      }
    }
  }, [ values, history ]);

  return (
    <>
      <Header/>

      { userProfile ? <UserProfile user_id={ String(values.user_id) } /> : <NotUserProfile user_id={String(values.user_id)} /> }

      <Footer />
    </>
  )
}

export default Profile;