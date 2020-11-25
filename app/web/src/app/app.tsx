import { gql, useLazyQuery, useMutation } from '@apollo/client';
import * as React from 'react';

const LOGIN = gql`
  mutation LogIn($input: LoginInputDto!) {
    login(input: $input) {
      id
      accessToken
    }
  }
`;

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

export const App: React.FC = () => {
  const [doIt, { data, loading }] = useMutation(LOGIN);
  const [doIt2, { data: userData }] = useLazyQuery(GET_USERS);

  const login = React.useCallback(
    async (name: string, password: string) => {
      const {
        data: {
          login: { accessToken },
        },
      } = await doIt({ variables: { input: { name, password } } });
      localStorage.setItem('token', accessToken);
    },
    [doIt],
  );

  return (
    <div>
      Hello, {loading}, {JSON.stringify(data)}
      <button
        type="button"
        onClick={() => {
          login('john', 'password');
        }}
      >
        Do It
      </button>
      <button type="button" onClick={() => doIt2()}>
        GetUsers
      </button>
      {JSON.stringify(userData)}
    </div>
  );
};

export default App;
