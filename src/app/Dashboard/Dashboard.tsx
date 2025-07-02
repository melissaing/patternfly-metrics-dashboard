import * as React from 'react';
import { PageSection, Title, FileUpload,
  DropEvent, List, ListItem, Button,
  ToggleGroup, ToggleGroupItem, ToggleGroupItemProps,
  Card, CardTitle, CardBody, CardFooter, Gallery,
  GalleryItem, Content } from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';
import Papa from 'papaparse'
import { useState, Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ChartLineIcon, CubesIcon, BoxIcon, SearchIcon } from '@patternfly/react-icons';
import { Table, Caption, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { rows, columns } from '@patternfly/react-table/dist/esm/demos/sampleData';

function Data() {
  const [data, setData] = useState([]);

  React.useEffect(() => {
    fetch("https://api.github.com/users").
    then(res => res.json())
    .then(setData);
  }, []);

  if(data) {
    return (
      <pre>{JSON.stringify(data)}</pre>
    )
  }
  return <p>No Data</p>
}

const metricsPages = [
  {
    title: 'Component Metrics',
    description:
      'Track component usage, performance, and interaction patterns across your application.',
    icon: <CubesIcon />,
    path: '/component',
    features: [
      'Component Usage',
      'Render Performance',
      'Props Analysis',
      'Error Rates',
    ],
  },
  {
    title: 'Product Metrics',
    description:
      'Analyze product performance, user adoption, and business key performance indicators.',
    icon: <BoxIcon />,
    path: '/product',
    features: [
      'User Adoption',
      'Feature Usage',
      'Revenue Metrics',
      'Customer Satisfaction',
    ],
  },
  {
    title: 'Search Metrics',
    description:
      'Monitor search functionality, query performance, and user search behavior.',
    icon: <SearchIcon />,
    path: '/search',
    features: [
      'Top Searches',
      'Searches with No Results',
      'Searches without Clicks',
      'Top Results',
    ],
  },
  {
    title: 'Web Metrics',
    description:
      'Monitor web application performance, user engagement, and traffic analytics.',
    icon: <ChartLineIcon />,
    path: '/web',
    features: [
      'Page Load Times',
      'User Sessions',
      'User Demographics',
      'Conversion Tracking',
    ],
  }
];


const Dashboard: React.FunctionComponent = () => (
  <>
  <PageSection>
    <Title headingLevel="h1">PatternFly Metrics Dashboard</Title>
    <p>This is a dashboard for PatternFly and other related metrics, developed by the PatternFly Enablement team. Data is collected from the PatternFly website and the PatternFly GitHub repositories.</p>
    <strong>This dashboard is a work in progress and will be updated over time.</strong>
  </PageSection>
  <PageSection>
    <Title headingLevel="h2">Available Metrics</Title>
    <p>Currently, there are four categories of metrics available to view:</p>
    <PageSection hasBodyWrapper>
        <Gallery hasGutter minWidths={{ default: '300px' }}>
          {metricsPages.map((page) => (
            <GalleryItem key={page.path}>
              <Card isFullHeight isSelectable>
                <CardTitle>
                  <div className="pf-v6-u-display-flex pf-v6-u-align-items-center pf-v6-u-mb-sm">
                    <div className="pf-v6-u-mr-md pf-v6-u-color-blue-400">
                      {page.icon}
                    </div>
                    {page.title}
                  </div>
                </CardTitle>
                <CardBody>
                  <Content component="p" className="pf-v6-u-mb-md">
                    {page.description}
                  </Content>
                  <Content component="h4" className="pf-v6-u-mb-sm">
                    Key Features:
                  </Content>
                  <List isPlain isBordered>
                    {page.features.map((feature, index) => (
                      <ListItem key={index}>{feature}</ListItem>
                    ))}
                  </List>
                </CardBody>
                <CardFooter>
                  <Link to={page.path}>
                    <Button
                      variant="primary"
                      icon={<ArrowRightIcon />}
                      iconPosition="end"
                    >
                      View {page.title}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
  </PageSection>
  </>
)

const SimpleTextFileUpload: React.FunctionComponent = () => {
  const [value, setValue] = useState('');
  const [filename, setFilename] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileInputChange = (_, file: File) => {
    setFilename(file.name);
  };

  const handleTextChange = (_event: React.ChangeEvent<HTMLTextAreaElement>, value: string) => {
    setValue(value);
  };

  const handleDataChange = (_event: DropEvent, value: string) => {
    setValue(value);
  };

  const handleClear = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setFilename('');
    setValue('');
  };

  const handleFileReadStarted = (_event: DropEvent, _fileHandle: File) => {
    setIsLoading(true);
  };

  const handleFileReadFinished = (_event: DropEvent, _fileHandle: File) => {
    setIsLoading(false);
  };

  let res = Papa.parse(value, {comments: "#"});
  console.log(res);

  const dataContext = React.createContext(res)

  return (
    <FileUpload
      id="text-file-simple"
      type="text"
      value={value}
      filename={filename}
      filenamePlaceholder="Drag and drop a file or upload one"
      onFileInputChange={handleFileInputChange}
      onDataChange={handleDataChange}
      onTextChange={handleTextChange}
      onReadStarted={handleFileReadStarted}
      onReadFinished={handleFileReadFinished}
      onClearClick={handleClear}
      isLoading={isLoading}
      allowEditingUploadedText={false}
      browseButtonText="Upload"
    />
  );
};

interface Repository {
  name: string;
  branches: string | null;
}

type ExampleType = 'default' | 'compact' | 'compactBorderless';

const TableBasic: React.FunctionComponent = () => {
  // In real usage, this data would come from some external source like an API via props.
  const repositories: Repository[] = [
    { name: 'one', branches: 'two' },
    { name: 'one - 2', branches: null },
    { name: 'one - 3', branches: 'two - 3' }
  ];

  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
  };

  // This state is just for the ToggleGroup in this example and isn't necessary for Table usage.
  const [exampleChoice, setExampleChoice] = useState<ExampleType>('default');
  const onExampleTypeChange: ToggleGroupItemProps['onChange'] = (event, _isSelected) => {
    const id = event.currentTarget.id;
    setExampleChoice(id as ExampleType);
  };

  return (
    <Fragment>
      <ToggleGroup aria-label="Default with single selectable">
        <ToggleGroupItem
          text="Default"
          buttonId="default"
          isSelected={exampleChoice === 'default'}
          onChange={onExampleTypeChange}
        />
        <ToggleGroupItem
          text="Compact"
          buttonId="compact"
          isSelected={exampleChoice === 'compact'}
          onChange={onExampleTypeChange}
        />
        <ToggleGroupItem
          text="Compact borderless"
          buttonId="compactBorderless"
          isSelected={exampleChoice === 'compactBorderless'}
          onChange={onExampleTypeChange}
        />
      </ToggleGroup>
      <Table
        aria-label="Simple table"
        variant={exampleChoice !== 'default' ? 'compact' : undefined}
        borders={exampleChoice !== 'compactBorderless'}
      >
        <Caption>Simple table using composable components</Caption>
        <Thead>
          <Tr>
            <Th>{columns[0]}</Th>
            <Th>{columns[1]}</Th>
            <Th>{columns[2]}</Th>
            <Th>{columns[3]}</Th>
            <Th>{columns[4]}</Th>
            <Th>{columns[5]}</Th>
            <Th>{columns[6]}</Th>
            <Th>{columns[7]}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.name}>
              <Td dataLabel={columns[0]}>{row.name}</Td>
              <Td dataLabel={columns[1]}>{row.threads}</Td>
              <Td dataLabel={columns[2]}>{row.applications}</Td>
              <Td dataLabel={columns[3]}>{row.workspaces}</Td>
              <Td dataLabel={columns[4]}>{row.status}</Td>
              <Td dataLabel={columns[5]}>{row.location}</Td>
              <Td dataLabel={columns[6]}>{row.lastModified}</Td>
              <Td dataLabel={columns[7]}>{row.url}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Fragment>
  );
};


export { Dashboard };
