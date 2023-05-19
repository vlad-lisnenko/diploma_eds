import React, {FC} from 'react';
import {Link} from 'react-router-dom';

export const NotFound: FC = () => {
  return (
    <div className="common__flex-center">
      <div>
        <h1>404 Not found</h1>
        <div className="common__flex-center common__padding-1em">
          <Link to="/"><h3>Go to main page</h3></Link>
        </div>
      </div>
    </div>
  );
};