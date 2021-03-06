import React from 'react';

import { renderWithProvider } from '../../../../../test/jest';
import AggregatorLogo from './aggregator-logo';

const createProps = (customProps = {}) => {
  return {
    color: '#000',
    icon:
      'data:image/png;base64,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',
    ...customProps,
  };
};

describe('AggregatorLogo', () => {
  it('renders the component with initial props', () => {
    const { container } = renderWithProvider(
      <AggregatorLogo {...createProps()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
