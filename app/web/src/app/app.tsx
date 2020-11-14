import { gql, useMutation } from '@apollo/client';
import * as React from 'react';

const LOGIN = gql`
  mutation LogIn($input: LoginInputDto!) {
    login(input: $input) {
      id
      accessToken
    }
  }
`;

export const App: React.FC = () => {
  const [doIt, { data, loading }] = useMutation(LOGIN);
  return (
    <div>
      Hello, {loading}, {JSON.stringify(data)}
      <button
        type="button"
        onClick={() =>
          doIt({
            variables: { input: { password: 'password', name: 'john2' } },
          })
        }
      >
        Do It
      </button>
    </div>
  );
};

export default App;
