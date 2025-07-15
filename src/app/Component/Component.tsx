import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { PageSection, Title, List, ListItem, Card, CardTitle, CardBody, Grid, GridItem, Pagination, TextInput, InputGroup, InputGroupItem } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { useState } from 'react';

import { githubUsageData, figmaUsageData, viewsUsageData, topUsedComponents, detachedComponents } from '../data/analyticsData';

const ComponentOverviewCard: React.FunctionComponent<{
  title: string;
  components: any[];
  type: 'top' | 'detached';
}> = ({ title, components, type }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return '#C9190B';
      case 'Underused': return '#EC7A08';
      default: return '#6A6E73';
    }
  };

  const getTrendColor = (trend: number) => {
    return trend > 0 ? '#3E8635' : '#C9190B';
  };

  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {components.map((component, index) => (
            <div 
              key={index} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: index < components.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}
            >
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                  {component.name}
                </div>
                {type === 'top' && (
                  <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                    {component.category}
                  </div>
                )}
                {type === 'detached' && (
                  <div style={{ fontSize: '0.875rem', color: getStatusColor(component.status) }}>
                    {component.status}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {type === 'top' && (
                  <>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {component.totalUsage.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      color: getTrendColor(component.trend),
                      fontWeight: 'bold'
                    }}>
                      {component.trend > 0 ? '+' : ''}{component.trend}%
                    </div>
                  </>
                )}
                {type === 'detached' && (
                  <>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {component.gap}% gap
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                      {component.usage} used / {component.docViews.toLocaleString()} views
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const ComponentSummaryCards: React.FunctionComponent = () => {
  const totalComponents = 127;
  const activeComponents = 89;
  const criticalComponents = 12;
  const avgAdoptionRate = 45.8;

  return (
    <Grid hasGutter>
      <GridItem xl={3} lg={3} md={6} sm={12}>
        <Card isFullHeight>
          <CardTitle>Total Components</CardTitle>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '15px 10px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0066CC', marginBottom: '8px' }}>
                {totalComponents}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                In PatternFly library
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xl={3} lg={3} md={6} sm={12}>
        <Card isFullHeight>
          <CardTitle>Active Components</CardTitle>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '15px 10px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#009639', marginBottom: '8px' }}>
                {activeComponents}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                Currently in use
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xl={3} lg={3} md={6} sm={12}>
        <Card isFullHeight>
          <CardTitle>Critical Components</CardTitle>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '15px 10px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#C9190B', marginBottom: '8px' }}>
                {criticalComponents}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                Need attention
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xl={3} lg={3} md={6} sm={12}>
        <Card isFullHeight>
          <CardTitle>Avg Adoption Rate</CardTitle>
          <CardBody>
            <div style={{ textAlign: 'center', padding: '15px 10px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8476D1', marginBottom: '8px' }}>
                {avgAdoptionRate}%
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                Views to usage ratio
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

const ComponentTable: React.FunctionComponent<{
  title: string;
  data: any[];
  columns: { [key: string]: string };
  searchFields: string[];
}> = ({ title, data, columns, searchFields }) => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 1, direction: 'desc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy,
    onSort: (_event, index, direction) => {
      setSortBy({ index, direction });
    },
    columnIndex
  });

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return data;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter((item) =>
      searchFields.some(field => 
        item[field]?.toString().toLowerCase().includes(searchLower)
      )
    );
  }, [searchTerm, data, searchFields]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    const columnKeys = Object.keys(columns);
    
    sortedArray.sort((a, b) => {
      const field = columnKeys[index];
      let aValue = a[field];
      let bValue = b[field];
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sortedArray;
  }, [filteredData, sortBy, columns]);

  const paginatedData = React.useMemo(() => {
    const startIndex = (page - 1) * perPage;
    return sortedData.slice(startIndex, startIndex + perPage);
  }, [sortedData, page, perPage]);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const handleSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const getGapColor = (gap: string) => {
    switch (gap) {
      case 'Low': return '#3E8635';
      case 'Medium': return '#F0AB00';
      case 'High': return '#EC7A08';
      case 'Very High': return '#C9190B';
      default: return '#151515';
    }
  };

  const formatValue = (key: string, value: any) => {
    if (typeof value === 'number' && key !== 'avgPerRepo' && key !== 'avgPerDesign' && key !== 'adoptionRate') {
      return value.toLocaleString();
    }
    if (key === 'adoptionRate') {
      return `${value}%`;
    }
    if (key === 'gap') {
      return <span style={{ color: getGapColor(value), fontWeight: 'bold' }}>{value}</span>;
    }
    return value;
  };

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <InputGroup>
            <InputGroupItem>
              <SearchIcon />
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInput
                placeholder="Search components or metrics..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search table"
              />
            </InputGroupItem>
          </InputGroup>
          {searchTerm && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Showing {filteredData.length} of {data.length} results
            </div>
          )}
        </div>
        <Table aria-label={`Sortable ${title.toLowerCase()} table`}>
          <Thead>
            <Tr>
              {Object.values(columns).map((columnName, index) => (
                <Th key={index} sort={getSortParams(index)}>{columnName}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr key={row.id}>
                {Object.keys(columns).map((key, index) => (
                  <Td key={index} dataLabel={columns[key]}>
                    {formatValue(key, row[key])}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredData.length}
          widgetId={`${title.toLowerCase().replace(/\s+/g, '-')}-pagination`}
          perPage={perPage}
          page={page}
          variant="bottom"
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          style={{ marginTop: '1rem' }}
        />
      </CardBody>
    </Card>
  );
};

const Component: React.FunctionComponent = () => (
  <>
    <PageSection>
      <Title headingLevel="h1" size="lg">PatternFly Component Usage</Title>
      <p>Metrics of the components used in various codebases and teams across different platforms.</p>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Component Overview</Title>
      <p>Key metrics and insights about PatternFly component adoption:</p>
      <ComponentSummaryCards />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Top Used & Detached Components</Title>
      <p>Most popular components and those with significant adoption gaps:</p>
      <Grid hasGutter>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <ComponentOverviewCard
            title="Top Used Components"
            components={topUsedComponents}
            type="top"
          />
        </GridItem>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <ComponentOverviewCard
            title="Detached Components"
            components={detachedComponents}
            type="detached"
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">GitHub Component Usage</Title>
      <p>Component usage statistics from GitHub repositories using PatternFly:</p>
      <ComponentTable
        title="GitHub Repository Usage"
        data={githubUsageData}
        columns={{
          component: 'Component',
          repositories: 'Repositories',
          totalUsage: 'Total Usage',
          avgPerRepo: 'Avg per Repo',
          category: 'Category',
          lastUpdated: 'Last Updated'
        }}
        searchFields={['component', 'category', 'repositories', 'totalUsage']}
      />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Figma Component Usage</Title>
      <p>Component usage statistics from Figma design files:</p>
      <ComponentTable
        title="Figma Design Usage"
        data={figmaUsageData}
        columns={{
          component: 'Component',
          designs: 'Designs',
          instances: 'Instances',
          avgPerDesign: 'Avg per Design',
          designerCount: 'Designer Count',
          lastUsed: 'Last Used'
        }}
        searchFields={['component', 'designs', 'instances', 'designerCount']}
      />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Views vs Usage Analysis</Title>
      <p>Comparison of documentation views versus actual component usage:</p>
      <ComponentTable
        title="Documentation Views vs Implementation"
        data={viewsUsageData}
        columns={{
          component: 'Component',
          docViews: 'Doc Views',
          githubUsage: 'GitHub Usage',
          figmaUsage: 'Figma Usage',
          adoptionRate: 'Adoption Rate',
          gap: 'Usage Gap'
        }}
        searchFields={['component', 'docViews', 'githubUsage', 'figmaUsage', 'gap']}
      />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Additional Information</Title>
      <ListBasic />
    </PageSection>
  </>
)

const ListBasic: React.FunctionComponent = () => (
  <List>
    <ListItem>Table of Contents</ListItem>
    <ListItem>From GitHub</ListItem>
    <ListItem>From Figma</ListItem>
    <ListItem>Views vs. Usage</ListItem>
  </List>
);

export { Component }