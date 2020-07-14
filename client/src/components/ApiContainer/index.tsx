import React, { useState, useEffect } from 'react';
import { FiHeart, FiEye } from 'react-icons/fi';

import './styles.css';
import api from '../../services/api';

interface ApiContainerProps {
  id: number;
  name: string;
  description: string;
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
    user_id,
    views,
    likes,
    api_country
  } = props;

  const [ creatorData, setCreatorData ] = useState<{name: string}>({name: ''});

  useEffect(() => {
    async function getCreatorData() {
      const response = await api.get<{name: string}>(`/users/getName/${user_id}`);

      setCreatorData(response.data);
    }

    getCreatorData();
  }, [ user_id ]);

  return (
    <section key={id} className="api-container">

      <div className="first-section section" >

        <div className="api-name">
          <div className="title">
            API Name:
          </div>
          <p>
            { name }
          </p>
        </div>

        <div className="creator-name">
          <div className="title">
            Creator's name:
          </div>
          <p>
            { creatorData.name }
          </p>
        </div>

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
              <FiHeart color='#d63031' size={23} />
              { likes }
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