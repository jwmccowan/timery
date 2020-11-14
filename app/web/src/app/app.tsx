import * as React from 'react';
import { Anchor, Button, Main, Pre, ToggleButton } from '@resist/components';

import './app.scss';

export const App: React.FC = () => (
  <>
    <header>
      <img src="../static/r_logo.png" alt="Resist" />
      <h1>Resist</h1>
    </header>
    <Main>
      <h2>Welcome</h2>
      <Button anchor onPress={console.log}>
        Hello
      </Button>
      <ToggleButton onPress={console.log}>Toggle</ToggleButton>
      <p>
        Resist is a game of deceipt and treachery. You will have fun wondering which of your friends is a good liar, and
        who is a bad spy.
      </p>
      <p>
        The rules are simple enough, but be sure to give them a quick read if you&apos;re new. We&apos;ll walk you
        through them as well if you click the button or whatever.
      </p>
      <h2>Rules</h2>
      <p>Here are the rules. I&apos;ll write them out clearly and goodly.</p>
      <Pre>
        <p>
          <Anchor to="whatever1">Rule 1</Anchor> - Do the thing
        </p>
        <p>
          <Anchor to="whatever2">Rule 2</Anchor> - Do it again
        </p>
        <p>
          <Anchor to="whatever3">Rule 3</Anchor> - Do the thing again
        </p>
      </Pre>
    </Main>
  </>
);

export default App;
