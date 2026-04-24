import React from 'react';
import { getPortfolioItems } from './actions';
import ClientPageWrapper from './ClientPageWrapper';

export default async function Home() {
  const portfolioItems = await getPortfolioItems();

  return (
    <ClientPageWrapper portfolioItems={portfolioItems} />
  );
}
