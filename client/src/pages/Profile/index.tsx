import React from 'react';

import "./styles.css";

import queryString from 'query-string';

interface ProfileProps {
  location: {
    search: string
  }
}

const Profile: React.FC<ProfileProps> = ({ location }) => {
  const values = queryString.parse(location.search);

  return (
    <>
      <div>Profile</div>
    </>
  )
}

export default Profile;