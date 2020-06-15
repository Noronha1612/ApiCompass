import React, { useState, useEffect } from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';

import './styles.css';
import api from '../../services/api';

interface ApiContainerProps {
  id: number;
  name: string;
  description: string;
  mainUrl: string;
  documentationUrl: string | null;
  user_id: string;
  views: number;
  likes: number;
  api_country: string;
}

const ApiContainer: React.FC<ApiContainerProps> = (props) => {
  const {
    id,
    name,
    description,
    mainUrl,
    documentationUrl,
    user_id,
    views,
    likes,
    api_country
  } = props;

  const [ creatorData, setCreatorData ] = useState<{name: string}>({name: ''});

  useEffect(() => {
    async function getCreatorData() {
      const response = await api.get<{name: string}>(`/users/list/?user_id=${user_id}`);

      setCreatorData(response.data);
    }

    getCreatorData();
  }, [ user_id ]);

  return (
    <section key={id} className="api-container" >
      <section className="section section-1">
        <div className="title">
          <h3>API Name</h3>
          <h1 style={{ maxWidth: 24 * name.length }} >{name}</h1>
        </div>

        <div className="likesandviews">
          <div className="likes">
            <FiHeart color="#e55039" size={20} />
            <span>{likes}</span>
          </div>
          <div className="views">
            <FiEye color="#079992" size={20} />
            <span>{views}</span>
          </div>
        </div>

        <div className="title creator-name">
          <h3>Creator's name</h3>
          <h1>{creatorData.name}</h1>
        </div>
      </section>

      <section className="section section-2">
        <div className="title">
          <h3>Description</h3>
          <p>{description}</p>
        </div>
        <div className="title">
          <h3>API Country</h3>
          <h1>{api_country}</h1>
        </div>
      </section>
    </section>
  );
}

export default ApiContainer;