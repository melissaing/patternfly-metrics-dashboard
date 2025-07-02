import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { PageSection, Title, List, ListItem, Card, CardTitle, CardBody, Grid, GridItem, Pagination, TextInput, InputGroup, InputGroupItem } from '@patternfly/react-core';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { useState } from 'react';

// Sample data for GitHub component usage
const githubUsageData = [
  { id: 1, component: "Button", repositories: 1247, totalUsage: 15673, avgPerRepo: 12.6, category: "Actions", lastUpdated: "2024-01-15" },
  { id: 2, component: "Card", repositories: 892, totalUsage: 8934, avgPerRepo: 10.0, category: "Layouts", lastUpdated: "2024-01-14" },
  { id: 3, component: "Alert", repositories: 734, totalUsage: 4521, avgPerRepo: 6.2, category: "Feedback", lastUpdated: "2024-01-13" },
  { id: 4, component: "Form", repositories: 623, totalUsage: 3847, avgPerRepo: 6.2, category: "Inputs", lastUpdated: "2024-01-12" },
  { id: 5, component: "Table", repositories: 567, totalUsage: 2134, avgPerRepo: 3.8, category: "Data Display", lastUpdated: "2024-01-11" },
  { id: 6, component: "Modal", repositories: 489, totalUsage: 1876, avgPerRepo: 3.8, category: "Overlays", lastUpdated: "2024-01-10" },
  { id: 7, component: "Toolbar", repositories: 432, totalUsage: 1654, avgPerRepo: 3.8, category: "Navigation", lastUpdated: "2024-01-09" },
  { id: 8, component: "Pagination", repositories: 387, totalUsage: 1234, avgPerRepo: 3.2, category: "Navigation", lastUpdated: "2024-01-08" },
  { id: 9, component: "Tabs", repositories: 345, totalUsage: 1089, avgPerRepo: 3.2, category: "Navigation", lastUpdated: "2024-01-07" },
  { id: 10, component: "Breadcrumb", repositories: 298, totalUsage: 876, avgPerRepo: 2.9, category: "Navigation", lastUpdated: "2024-01-06" },
  { id: 11, component: "Progress", repositories: 267, totalUsage: 734, avgPerRepo: 2.7, category: "Feedback", lastUpdated: "2024-01-05" },
  { id: 12, component: "Badge", repositories: 234, totalUsage: 623, avgPerRepo: 2.7, category: "Data Display", lastUpdated: "2024-01-04" },
  { id: 13, component: "Tooltip", repositories: 198, totalUsage: 567, avgPerRepo: 2.9, category: "Overlays", lastUpdated: "2024-01-03" },
  { id: 14, component: "Dropdown", repositories: 189, totalUsage: 489, avgPerRepo: 2.6, category: "Inputs", lastUpdated: "2024-01-02" },
  { id: 15, component: "List", repositories: 156, totalUsage: 432, avgPerRepo: 2.8, category: "Data Display", lastUpdated: "2024-01-01" }
];

// Sample data for Figma component usage
const figmaUsageData = [
  { id: 1, component: "Button", designs: 2134, instances: 18754, avgPerDesign: 8.8, designerCount: 89, lastUsed: "2024-01-15" },
  { id: 2, component: "Card", designs: 1876, instances: 12456, avgPerDesign: 6.6, designerCount: 76, lastUsed: "2024-01-14" },
  { id: 3, component: "Input", designs: 1623, instances: 9876, avgPerDesign: 6.1, designerCount: 67, lastUsed: "2024-01-13" },
  { id: 4, component: "Icon", designs: 1534, instances: 23456, avgPerDesign: 15.3, designerCount: 82, lastUsed: "2024-01-12" },
  { id: 5, component: "Modal", designs: 1234, instances: 4567, avgPerDesign: 3.7, designerCount: 45, lastUsed: "2024-01-11" },
  { id: 6, component: "Navigation", designs: 1098, instances: 3456, avgPerDesign: 3.1, designerCount: 52, lastUsed: "2024-01-10" },
  { id: 7, component: "Alert", designs: 987, instances: 2345, avgPerDesign: 2.4, designerCount: 38, lastUsed: "2024-01-09" },
  { id: 8, component: "Form", designs: 876, instances: 5432, avgPerDesign: 6.2, designerCount: 41, lastUsed: "2024-01-08" },
  { id: 9, component: "Table", designs: 754, instances: 1876, avgPerDesign: 2.5, designerCount: 29, lastUsed: "2024-01-07" },
  { id: 10, component: "Tabs", designs: 689, instances: 2134, avgPerDesign: 3.1, designerCount: 33, lastUsed: "2024-01-06" },
  { id: 11, component: "Badge", designs: 623, instances: 1654, avgPerDesign: 2.7, designerCount: 27, lastUsed: "2024-01-05" },
  { id: 12, component: "Progress", designs: 567, instances: 1234, avgPerDesign: 2.2, designerCount: 24, lastUsed: "2024-01-04" },
  { id: 13, component: "Tooltip", designs: 489, instances: 987, avgPerDesign: 2.0, designerCount: 19, lastUsed: "2024-01-03" },
  { id: 14, component: "Pagination", designs: 432, instances: 876, avgPerDesign: 2.0, designerCount: 18, lastUsed: "2024-01-02" },
  { id: 15, component: "Dropdown", designs: 387, instances: 1345, avgPerDesign: 3.5, designerCount: 22, lastUsed: "2024-01-01" }
];

// Sample data for Views vs Usage comparison
const viewsUsageData = [
  { id: 1, component: "Button", docViews: 45673, githubUsage: 15673, figmaUsage: 18754, adoptionRate: 89.2, gap: "Low" },
  { id: 2, component: "Card", docViews: 32154, githubUsage: 8934, figmaUsage: 12456, adoptionRate: 66.7, gap: "Medium" },
  { id: 3, component: "Form", docViews: 28934, githubUsage: 3847, figmaUsage: 5432, adoptionRate: 32.1, gap: "High" },
  { id: 4, component: "Table", docViews: 24156, githubUsage: 2134, figmaUsage: 1876, adoptionRate: 16.6, gap: "Very High" },
  { id: 5, component: "Modal", docViews: 18765, githubUsage: 1876, figmaUsage: 4567, adoptionRate: 34.3, gap: "High" },
  { id: 6, component: "Alert", docViews: 16542, githubUsage: 4521, figmaUsage: 2345, adoptionRate: 41.5, gap: "Medium" },
  { id: 7, component: "Navigation", docViews: 15234, githubUsage: 1654, figmaUsage: 3456, adoptionRate: 33.5, gap: "High" },
  { id: 8, component: "Input", docViews: 13987, githubUsage: 2345, figmaUsage: 9876, adoptionRate: 87.4, gap: "Low" },
  { id: 9, component: "Tabs", docViews: 12456, githubUsage: 1089, figmaUsage: 2134, adoptionRate: 25.9, gap: "High" },
  { id: 10, component: "Pagination", docViews: 11234, githubUsage: 1234, figmaUsage: 876, adoptionRate: 18.8, gap: "Very High" },
  { id: 11, component: "Progress", docViews: 10987, githubUsage: 734, figmaUsage: 1234, adoptionRate: 17.9, gap: "Very High" },
  { id: 12, component: "Breadcrumb", docViews: 9876, githubUsage: 876, figmaUsage: 567, adoptionRate: 14.6, gap: "Very High" },
  { id: 13, component: "Badge", docViews: 8765, githubUsage: 623, figmaUsage: 1654, adoptionRate: 26.0, gap: "High" },
  { id: 14, component: "Tooltip", docViews: 7654, githubUsage: 567, figmaUsage: 987, adoptionRate: 20.3, gap: "High" },
  { id: 15, component: "Dropdown", docViews: 6789, githubUsage: 489, figmaUsage: 1345, adoptionRate: 27.0, gap: "High" }
];

// Sample data for top used components
const topUsedComponents = [
  { name: "Button", totalUsage: 34427, trend: 8.2, category: "Actions" },
  { name: "Card", totalUsage: 21390, trend: 5.4, category: "Layouts" },
  { name: "Input", totalUsage: 12221, trend: 12.8, category: "Inputs" },
  { name: "Alert", totalUsage: 6866, trend: -2.1, category: "Feedback" }
];

// Sample data for detached components 
const detachedComponents = [
  { name: "DataList", docViews: 8934, usage: 156, gap: 94.3, status: "Underused" },
  { name: "Wizard", docViews: 6754, usage: 89, gap: 96.7, status: "Critical" },
  { name: "TreeView", docViews: 4521, usage: 23, gap: 99.5, status: "Critical" },
  { name: "Calendar", docViews: 3456, usage: 67, gap: 98.1, status: "Critical" }
];

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