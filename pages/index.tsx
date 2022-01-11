import type { NextPage } from 'next';

import { Container } from 'components/Container';
import { AdsList } from 'components/AdsList';

const Home: NextPage = () => {
  return (
    <Container>
      <AdsList />
    </Container>
  );
};

export default Home;
