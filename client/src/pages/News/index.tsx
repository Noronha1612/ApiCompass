import React from 'react';

import Header from '../../components/Header';

import "./styles.css";

const News: React.FC = () => {
  return (
    <>
      <Header />

      <div className="news-container">
        News
      </div>
    </>
  )
}

export default News;