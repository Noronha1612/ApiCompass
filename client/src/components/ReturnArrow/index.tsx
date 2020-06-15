import React from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import './styles.css';

const ReturnArrow = () => {
  return (
    <Link to="/" className="arrow-container">
      <FiArrowLeft className="icon" />
    </Link>
  )
}

export default ReturnArrow;