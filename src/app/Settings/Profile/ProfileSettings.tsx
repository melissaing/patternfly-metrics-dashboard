import * as React from 'react';
import { PageSection, Title } from '@patternfly/react-core';
import { useDocumentTitle } from '@app/utils/useDocumentTitle';

const ProfileSettings: React.FunctionComponent = () => {
  useDocumentTitle("Profile Settings");

  return (
    <PageSection hasBodyWrapper={false}>
      <Title headingLevel="h1" size="lg">
        Profile Settings
      </Title>
    </PageSection>
  );

}

export { ProfileSettings };
