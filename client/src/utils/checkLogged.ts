import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export default function useCheckLogged(dependencies: []) {
    const history = useHistory();

    useEffect(() => {
        if ( localStorage.getItem('user_token') ) {
            history.push('/');
        }
    }, [ history ]);
}
