import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import { MdFavoriteBorder, MdFavorite } from 'react-icons/md';
import jwt from 'jsonwebtoken';

import './styles.css';

import api from '../../services/api';

import updateData from '../../utils/updateData';

interface ApiContainerProps {
  id: number;
  name: string;
  description: string;
  user_id: string;
  views: number;
  likes: number;
  api_country: string;
  user_api?: boolean;
}

const ApiContainer: React.FC<ApiContainerProps> = (props) => {
  const history = useHistory();

  const {
    id,
    name,
    description,
    user_id,
    views,
    likes,
    api_country
  } = props;

  const [ creatorData, setCreatorData ] = useState<{ name: string }>({name: ''});

  const [ isApiLiked, setIsApiLiked ] = useState(false);

  const [ currentLikes, setCurrentLikes ] = useState(likes);

  async function handleDislike(logged: boolean) {
    if ( logged ) {
      await api.put('/apis/decrementLikes', null, { headers: {
        user_id,
        api_id: id
      }});

      setCurrentLikes(currentLikes - 1);
      setIsApiLiked(false);
      updateData();
    }
    else {
      history.push('/user/login');
    }
  }

  async function handleLike(logged: boolean) {
    if ( logged ) {
      const loggedUserToken = localStorage.getItem('user_token') as string;

      const tokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

      const { id: user_id } = jwt.verify( loggedUserToken, tokenKey ) as { id: string };

      await api.put('/apis/incrementLikes', null, { headers: {
        user_id,
        api_id: id
      }});

      setCurrentLikes(currentLikes + 1);
      setIsApiLiked(true);
      updateData();
    }
    else {
      history.push('/user/login');
    }
  }

  function handleClickApiName() {

  }

  function handleClickCreatorName() {
    history.push(`/user/profile/?user_id=${user_id}`)
  }

  useEffect(() => {
    async function getCreatorData() {
      const response = await api.get<{name: string}>(`/users/getName/${user_id}`);

      setCreatorData(response.data);
    }

    getCreatorData();
  }, [ user_id ]);

  useEffect(() => {
    const loggedUserToken = localStorage.getItem('user_token');

    if ( !loggedUserToken ) return;

    const tokenKey = process.env.REACT_APP_TOKEN_SECRET_KEY as string;

    const payload = jwt.verify( loggedUserToken, tokenKey ) as { liked_apis: string };

    const likedApis = typeof payload.liked_apis === 'string' ?
      payload.liked_apis.split(',') :
      payload.liked_apis;

    if ( !likedApis.includes(String(id)) ) {
      return;
    }

    setIsApiLiked(true);
  }, [ id ]);

  return (
    <section key={id} className="api-container">

      <div className="first-section section" >

        <div className="api-name clickable" onClick={ handleClickApiName }>
          <div className="title">
            API Name:
          </div>
          <p>
            { name }
          </p>
        </div>

        {
          props.user_api ? 
          (<div className="creator-name clickable">
            <div className="title">
              Edit Profile
            </div>
          </div>)
            :
          (<div className="creator-name clickable" onClick={ handleClickCreatorName }>
          <div className="title">
            Creator's name:
          </div>
          <p>
            { creatorData.name }
          </p>
        </div>)
        }

      </div>

      <div className="second-section section">
        <div className="description">
          { description.length > 115 ?
          `${description.slice(0, 115)}...` :
          description }
        </div>

        <section>
          <div className="api-country">
            <div className="title">Country: </div>
            <p>
              { api_country }
            </p>
          </div>

          <div className="viewsAndLikes">
            <span>

              {
                !isApiLiked?
                  <MdFavoriteBorder color='#d63031' size={23} style={{ cursor: 'pointer' }} onClick={ () => handleLike(!!localStorage.getItem('user_token')) } />
                :
                  <MdFavorite color='#d63031' size={23} style={{ cursor: 'pointer' }} onClick={ () => handleDislike(!!localStorage.getItem('user_token')) } />
              }
              
              { currentLikes }
            </span>
            <span>
              <FiEye color='#00b894' size={23} />
              { views }
            </span>
          </div>
        </section>
      </div>

    </section>
  );
}

export default ApiContainer;