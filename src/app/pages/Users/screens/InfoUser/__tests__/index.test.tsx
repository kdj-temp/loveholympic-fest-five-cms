import * as React from 'react';
import { render } from '@testing-library/react';

import { InfoUser } from '..';

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));

describe('<InfoUser  />', () => {
  it('should match snapshot', () => {
    const loadingIndicator = render(<InfoUser data={null} />);
    expect(loadingIndicator.container.firstChild).toMatchSnapshot();
  });
});
