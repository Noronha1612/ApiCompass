import React from 'react';

import "./styles.css";

import queryString from 'query-string';

interface SearchProps {
  location: {
    search: string
  }
}

const Search: React.FC<SearchProps> = ({ location }) => {
  const values = queryString.parse(location.search);

  console.log(values)

  return (
    <>
      <div>Search</div>
    </>
  )
}

export default Search;