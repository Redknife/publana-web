import type { NextPage } from 'next';

import { Container } from 'components/Container';
import { PubsList } from 'components/PubsList';

const Home: NextPage = () => {
  return (
    <Container>
      <PubsList />
    </Container>
  );
};

export default Home;
