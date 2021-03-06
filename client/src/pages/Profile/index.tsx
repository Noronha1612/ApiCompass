import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import jwt from 'jsonwebtoken';

import api from '../../services/api';

import { Scrollbars } from 'react-custom-scrollbars';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ApiContainer from '../../components/ApiContainer';

import logoBranco from '../../assets/logo-branco.png';
import logoPreto from '../../assets/logo-preto.png';
import logoProfile from '../../assets/bg-profile.png';

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
  liked_apis: string;
}

interface UserResponse {
  error: boolean;
  data?: UserData;
  message?: string;
}
interface APIData {
  id: number;
  apiName: string;
  description: string;
  user_api_id: string;
  views: number;
  likes: number;
  apiCountry: string;
}

interface APIResponse {
  error: boolean;
  data?: APIData[];
  message?: string;
}

const UserProfile: React.FC<{ user_id: string, loggedUser: boolean }> = ({ user_id, loggedUser }) => {
  const [ userData, setUserData ] = useState<UserData>({
    api_ids: '',
    name: '',
    score: 0,
    followers: '',
    following: '',
    liked_apis: ''
  });

  const [ userLikes, setUserLikes ] = useState(0);
  const [ likedApis, setLikedApis ] = useState<APIData[]>([]);
  const [ userApis, setUserApis ] = useState<APIData[]>([])

  function sum(numbers: number[]) {
    if (numbers.length !== 0) {
      const sum = numbers.reduce((acumulator, actual) => acumulator + actual);

      return sum;
    }
    else return 0;
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

  useEffect(() => {
    async function getTotalLikes() {
      const response = await api.get<APIResponse>('/apis/list/ids', { headers: {
        api_ids: userData.api_ids,
      }});

      if ( response.data.data ) {
        setUserApis(response.data.data);

        const likesArray = response.data.data.map( api => api.likes );

        setUserLikes(sum(likesArray));
      }
      else if ( response.data.message ) {
        console.log( response.data.message );
      }
    }

    getTotalLikes();
  }, [ userData ]);

  useEffect(() => {
    async function getLikedApis() {
      const response = await api.get<APIResponse>('/apis/list/ids', { headers: {
        api_ids: userData.liked_apis
      }});

      if ( response.data.data ) {
        setLikedApis(response.data.data);
      }
      else if ( response.data.message ) { 
        console.log(response.data.message)
      }
    }

    getLikedApis();
  }, [ userData ]);

  return (
    <div className="profile-container">
      <section className="first-section-main">
        <img src={logoProfile} alt="logo-profile"/>
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
          {
            loggedUser ?
              (
                <button className="edit-profile">
                  Edit Profile
                </button>
              )
            :
              ( 
                <button className="edit-profile">
                  Follow
                </button>
              )
          }
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

      <section className="second-section-main">
        <section className="first-box">
          <img src={logoBranco} alt="logo-branco-bg" className="bg"/>
          <div className="title-section-profile">Liked APIs</div>
          <span className="amount-apis">{likedApis.length} APIs shown</span>

          <div className="scrollable-div">
            <Scrollbars 
              style={{ width: '100%', height: '100%' }} 
              renderThumbHorizontal={() => <div style={{ backgroundColor: '#0C5B83', borderRadius: 30 }} />} 
              renderThumbVertical={() => <div style={{ backgroundColor: '#0C5B83', borderRadius: 30 }} />} 
            >
              <section className="api-list">
                { likedApis.map(api => (
                  <ApiContainer
                    key={api.id} 
                    api_country={api.apiCountry}
                    description={api.description}
                    id={api.id}
                    likes={api.likes}
                    name={api.apiName}
                    user_id={api.user_api_id}
                    views={api.views}
                  />
                )) }
              </section>
            </Scrollbars>
          </div>
        </section>

        <section className="second-box">
          <img src={logoPreto} alt="logo-branco-bg" className="bg"/>
          <div className="title-section-profile">{loggedUser ? 'Your' : `${userData.name}'s`} APIs</div>
          <span className="amount-apis">{userApis.length} APIs shown</span>

          <div className="scrollable-div">
            <Scrollbars 
              style={{ height: '100%' }}
              renderThumbHorizontal={() => <div style={{ backgroundColor: '#000E20', borderRadius: 30 }} />} 
              renderThumbVertical={() => <div style={{ backgroundColor: '#000E20', borderRadius: 30 }} />} 
            >
              <section className="api-list">
                { userApis.map(api => (
                  <ApiContainer
                    key={api.id} 
                    api_country={api.apiCountry}
                    description={api.description}
                    id={api.id}
                    likes={api.likes}
                    name={api.apiName}
                    user_id={api.user_api_id}
                    views={api.views}
                    user_api={loggedUser}
                  />
                  )) }
                </section>
            </Scrollbars>
          </div>
        </section>
      </section>
    </div>
  );
}

const Profile: React.FC<ProfileProps> = ({ location }) => {
  const values = queryString.parse(location.search) as { user_id: string } ;

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

      <UserProfile 
        user_id={values.user_id} 
        loggedUser={userProfile}
      />

      <Footer />
      </>
  )
}

export default Profile;