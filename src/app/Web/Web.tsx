import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { PageSection, Title, Alert, List, ListItem, Divider, Card, CardTitle, CardBody, Grid, GridItem, Pagination, TextInput, InputGroup, InputGroupItem } from '@patternfly/react-core';
import { VictoryPie, VictoryTooltip } from 'victory';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { useState } from 'react';

// Sample data for web metrics
const webMetricsData = {
  activeUsers: { current: 12547, previous: 11832, unit: '' },
  newUsers: { current: 3892, previous: 3654, unit: '' },
  eventCount: { current: 45673, previous: 42891, unit: '' },
  avgEngagementTime: { current: 2.47, previous: 2.23, unit: 'min' }
};

// Sample data for top pages
const topPagesData = [
  { id: 1, page: "/", title: "Home", pageViews: 45673, uniqueUsers: 32154, bounceRate: 45.2, avgTimeOnPage: "2:34", sessions: 38921 },
  { id: 2, page: "/get-started", title: "Get Started", pageViews: 28934, uniqueUsers: 21567, bounceRate: 32.1, avgTimeOnPage: "4:12", sessions: 25643 },
  { id: 3, page: "/components", title: "Components", pageViews: 24156, uniqueUsers: 18432, bounceRate: 28.7, avgTimeOnPage: "5:45", sessions: 21098 },
  { id: 4, page: "/design-guidelines", title: "Design Guidelines", pageViews: 18765, uniqueUsers: 14523, bounceRate: 35.6, avgTimeOnPage: "3:22", sessions: 16834 },
  { id: 5, page: "/layouts", title: "Layouts", pageViews: 16542, uniqueUsers: 12987, bounceRate: 31.4, avgTimeOnPage: "4:08", sessions: 14765 },
  { id: 6, page: "/charts", title: "Charts", pageViews: 15234, uniqueUsers: 11876, bounceRate: 29.8, avgTimeOnPage: "3:56", sessions: 13421 },
  { id: 7, page: "/tokens", title: "Design Tokens", pageViews: 13987, uniqueUsers: 10654, bounceRate: 33.2, avgTimeOnPage: "2:48", sessions: 12103 },
  { id: 8, page: "/contribute", title: "Contribute", pageViews: 12456, uniqueUsers: 9876, bounceRate: 42.1, avgTimeOnPage: "2:15", sessions: 10987 },
  { id: 9, page: "/patterns", title: "Patterns", pageViews: 11234, uniqueUsers: 8765, bounceRate: 26.4, avgTimeOnPage: "4:33", sessions: 9654 },
  { id: 10, page: "/utilities", title: "Utilities", pageViews: 10987, uniqueUsers: 8432, bounceRate: 30.7, avgTimeOnPage: "3:21", sessions: 9321 },
  { id: 11, page: "/icons", title: "Icons", pageViews: 9876, uniqueUsers: 7654, bounceRate: 34.5, avgTimeOnPage: "2:56", sessions: 8567 },
  { id: 12, page: "/extensions", title: "Extensions", pageViews: 8765, uniqueUsers: 6789, bounceRate: 38.9, avgTimeOnPage: "2:12", sessions: 7654 },
  { id: 13, page: "/demos", title: "Demos", pageViews: 8234, uniqueUsers: 6432, bounceRate: 27.8, avgTimeOnPage: "4:45", sessions: 7123 },
  { id: 14, page: "/developer-resources", title: "Developer Resources", pageViews: 7654, uniqueUsers: 5987, bounceRate: 31.6, avgTimeOnPage: "3:34", sessions: 6789 },
  { id: 15, page: "/accessibility", title: "Accessibility", pageViews: 7123, uniqueUsers: 5654, bounceRate: 29.3, avgTimeOnPage: "4:18", sessions: 6234 },
  { id: 16, page: "/training", title: "Training", pageViews: 6789, uniqueUsers: 5321, bounceRate: 36.7, avgTimeOnPage: "2:45", sessions: 5876 },
  { id: 17, page: "/community", title: "Community", pageViews: 6234, uniqueUsers: 4987, bounceRate: 33.4, avgTimeOnPage: "3:12", sessions: 5432 },
  { id: 18, page: "/blog", title: "Blog", pageViews: 5876, uniqueUsers: 4654, bounceRate: 41.2, avgTimeOnPage: "1:58", sessions: 5098 },
  { id: 19, page: "/release-notes", title: "Release Notes", pageViews: 5432, uniqueUsers: 4321, bounceRate: 44.6, avgTimeOnPage: "1:34", sessions: 4765 },
  { id: 20, page: "/support", title: "Support", pageViews: 4987, uniqueUsers: 3987, bounceRate: 37.8, avgTimeOnPage: "2:28", sessions: 4321 }
];

// Sample data for user demographics by geography
const geographicData = [
  { id: 1, country: "United States", users: 18543, sessions: 24567, bounceRate: 42.3, region: "North America", percentage: 34.2 },
  { id: 2, country: "Germany", users: 8234, sessions: 10876, bounceRate: 38.7, region: "Europe", percentage: 15.2 },
  { id: 3, country: "United Kingdom", users: 6789, sessions: 8932, bounceRate: 35.4, region: "Europe", percentage: 12.5 },
  { id: 4, country: "Canada", users: 4521, sessions: 5834, bounceRate: 40.1, region: "North America", percentage: 8.3 },
  { id: 5, country: "India", users: 3456, sessions: 4234, bounceRate: 45.6, region: "Asia", percentage: 6.4 },
  { id: 6, country: "France", users: 2876, sessions: 3654, bounceRate: 37.2, region: "Europe", percentage: 5.3 },
  { id: 7, country: "Australia", users: 2134, sessions: 2876, bounceRate: 33.8, region: "Oceania", percentage: 3.9 },
  { id: 8, country: "Netherlands", users: 1876, sessions: 2345, bounceRate: 36.9, region: "Europe", percentage: 3.5 },
  { id: 9, country: "Japan", users: 1654, sessions: 2098, bounceRate: 41.7, region: "Asia", percentage: 3.1 },
  { id: 10, country: "Brazil", users: 1432, sessions: 1876, bounceRate: 48.2, region: "South America", percentage: 2.6 },
  { id: 11, country: "Sweden", users: 1234, sessions: 1543, bounceRate: 34.5, region: "Europe", percentage: 2.3 },
  { id: 12, country: "Spain", users: 1098, sessions: 1387, bounceRate: 39.8, region: "Europe", percentage: 2.0 },
  { id: 13, country: "Italy", users: 987, sessions: 1234, bounceRate: 43.1, region: "Europe", percentage: 1.8 },
  { id: 14, country: "South Korea", users: 876, sessions: 1098, bounceRate: 37.6, region: "Asia", percentage: 1.6 },
  { id: 15, country: "Other", users: 743, sessions: 934, bounceRate: 44.9, region: "Various", percentage: 1.4 }
];

const GeographicMap: React.FunctionComponent = () => {
  // Group data by regions for the map visualization
  const regionData = React.useMemo(() => {
    const regions = geographicData.reduce((acc, country) => {
      if (!acc[country.region]) {
        acc[country.region] = { users: 0, countries: 0, percentage: 0 };
      }
      acc[country.region].users += country.users;
      acc[country.region].countries += 1;
      acc[country.region].percentage += country.percentage;
      return acc;
    }, {} as Record<string, { users: number; countries: number; percentage: number }>);

    return Object.entries(regions).map(([region, data]) => ({
      region,
      users: data.users,
      countries: data.countries,
      percentage: Math.round(data.percentage * 10) / 10
    }));
  }, []);

  const getRegionColor = (percentage: number) => {
    if (percentage >= 40) return '#0066CC'; // High traffic - blue
    if (percentage >= 20) return '#009639'; // Medium-high traffic - green  
    if (percentage >= 10) return '#F0AB00'; // Medium traffic - yellow
    if (percentage >= 5) return '#EC7A08';  // Low-medium traffic - orange
    return '#6A6E73'; // Low traffic - gray
  };

  return (
    <Card>
      <CardTitle>User Demographics by Region</CardTitle>
      <CardBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Simple regional breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {regionData.map((region) => (
              <div 
                key={region.region}
                style={{ 
                  border: '2px solid #f0f0f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  backgroundColor: '#fafafa',
                  borderColor: getRegionColor(region.percentage)
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                  {region.region}
                </div>
                <div style={{ color: '#6a6e73', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {region.countries} countries
                </div>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: getRegionColor(region.percentage),
                  marginBottom: '0.25rem'
                }}>
                  {region.users.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                  {region.percentage}% of total users
                </div>
              </div>
            ))}
          </div>
          
          {/* World map representation using simple visualization */}
          <div style={{ 
            marginTop: '2rem',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <Title headingLevel="h4" style={{ marginBottom: '1rem' }}>Global User Distribution</Title>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '1rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {geographicData.slice(0, 8).map((country) => (
                <div 
                  key={country.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: getRegionColor(country.percentage),
                    color: 'white',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    opacity: Math.max(0.7, country.percentage / 40) // Scale opacity based on traffic
                  }}
                >
                  <div>{country.country}</div>
                  <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    {country.percentage}%
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Color intensity represents traffic volume
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const GeographicTable: React.FunctionComponent = () => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 1, direction: 'desc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const columnNames = {
    country: 'Country',
    users: 'Users',
    sessions: 'Sessions',
    bounceRate: 'Bounce Rate (%)',
    region: 'Region',
    percentage: 'Traffic %'
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy,
    onSort: (_event, index, direction) => {
      setSortBy({ index, direction });
    },
    columnIndex
  });

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return geographicData;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return geographicData.filter((item) =>
      item.country.toLowerCase().includes(searchLower) ||
      item.region.toLowerCase().includes(searchLower) ||
      item.users.toString().includes(searchLower) ||
      item.sessions.toString().includes(searchLower)
    );
  }, [searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue, bValue;
      
      switch (index) {
        case 0:
          aValue = a.country;
          bValue = b.country;
          break;
        case 1:
          aValue = a.users;
          bValue = b.users;
          break;
        case 2:
          aValue = a.sessions;
          bValue = b.sessions;
          break;
        case 3:
          aValue = a.bounceRate;
          bValue = b.bounceRate;
          break;
        case 4:
          aValue = a.region;
          bValue = b.region;
          break;
        case 5:
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sortedArray;
  }, [filteredData, sortBy]);

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

  const getBounceRateColor = (rate: number) => {
    if (rate < 35) return '#3E8635';
    if (rate < 42) return '#F0AB00';
    if (rate < 47) return '#EC7A08';
    return '#C9190B';
  };

  return (
    <Card>
      <CardTitle>Geographic User Data</CardTitle>
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <InputGroup>
            <InputGroupItem>
              <SearchIcon />
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInput
                placeholder="Search countries or regions..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search geographic table"
              />
            </InputGroupItem>
          </InputGroup>
          {searchTerm && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Showing {filteredData.length} of {geographicData.length} results
            </div>
          )}
        </div>
        <Table aria-label="Sortable geographic data table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.country}</Th>
              <Th sort={getSortParams(1)}>{columnNames.users}</Th>
              <Th sort={getSortParams(2)}>{columnNames.sessions}</Th>
              <Th sort={getSortParams(3)}>{columnNames.bounceRate}</Th>
              <Th sort={getSortParams(4)}>{columnNames.region}</Th>
              <Th sort={getSortParams(5)}>{columnNames.percentage}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel={columnNames.country}>{row.country}</Td>
                <Td dataLabel={columnNames.users}>{row.users.toLocaleString()}</Td>
                <Td dataLabel={columnNames.sessions}>{row.sessions.toLocaleString()}</Td>
                <Td dataLabel={columnNames.bounceRate}>
                  <span style={{ color: getBounceRateColor(row.bounceRate), fontWeight: 'bold' }}>
                    {row.bounceRate}%
                  </span>
                </Td>
                <Td dataLabel={columnNames.region}>{row.region}</Td>
                <Td dataLabel={columnNames.percentage}>{row.percentage}%</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredData.length}
          widgetId="geographic-table-pagination"
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

const TopPagesTable: React.FunctionComponent = () => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 1, direction: 'desc' }); // Default sort by page views descending
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const columnNames = {
    page: 'Page',
    pageViews: 'Page Views',
    uniqueUsers: 'Unique Users',
    sessions: 'Sessions',
    bounceRate: 'Bounce Rate (%)',
    avgTimeOnPage: 'Avg Time on Page'
  };

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy,
    onSort: (_event, index, direction) => {
      setSortBy({ index, direction });
    },
    columnIndex
  });

  const filteredData = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return topPagesData;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return topPagesData.filter((item) =>
      item.page.toLowerCase().includes(searchLower) ||
      item.title.toLowerCase().includes(searchLower) ||
      item.pageViews.toString().includes(searchLower) ||
      item.uniqueUsers.toString().includes(searchLower) ||
      item.bounceRate.toString().includes(searchLower) ||
      item.avgTimeOnPage.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue, bValue;
      
      switch (index) {
        case 0:
          aValue = a.page;
          bValue = b.page;
          break;
        case 1:
          aValue = a.pageViews;
          bValue = b.pageViews;
          break;
        case 2:
          aValue = a.uniqueUsers;
          bValue = b.uniqueUsers;
          break;
        case 3:
          aValue = a.sessions;
          bValue = b.sessions;
          break;
        case 4:
          aValue = a.bounceRate;
          bValue = b.bounceRate;
          break;
        case 5:
          // Convert time to seconds for sorting
          const timeToSeconds = (time: string) => {
            const [minutes, seconds] = time.split(':').map(Number);
            return minutes * 60 + seconds;
          };
          aValue = timeToSeconds(a.avgTimeOnPage);
          bValue = timeToSeconds(b.avgTimeOnPage);
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sortedArray;
  }, [filteredData, sortBy]);

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
    setPage(1); // Reset to first page when searching
  };

  const getBounceRateColor = (rate: number) => {
    if (rate < 30) return '#3E8635'; // Good (green)
    if (rate < 40) return '#F0AB00'; // OK (yellow)
    if (rate < 50) return '#EC7A08'; // Poor (orange)
    return '#C9190B'; // Bad (red)
  };

  return (
    <Card>
      <CardTitle>Top Website Pages</CardTitle>
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <InputGroup>
            <InputGroupItem>
              <SearchIcon />
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInput
                placeholder="Search pages, titles, or metrics..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search table"
              />
            </InputGroupItem>
          </InputGroup>
          {searchTerm && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Showing {filteredData.length} of {topPagesData.length} results
            </div>
          )}
        </div>
        <Table aria-label="Sortable top pages table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.page}</Th>
              <Th sort={getSortParams(1)}>{columnNames.pageViews}</Th>
              <Th sort={getSortParams(2)}>{columnNames.uniqueUsers}</Th>
              <Th sort={getSortParams(3)}>{columnNames.sessions}</Th>
              <Th sort={getSortParams(4)}>{columnNames.bounceRate}</Th>
              <Th sort={getSortParams(5)}>{columnNames.avgTimeOnPage}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel={columnNames.page}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{row.page}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>{row.title}</div>
                  </div>
                </Td>
                <Td dataLabel={columnNames.pageViews}>{row.pageViews.toLocaleString()}</Td>
                <Td dataLabel={columnNames.uniqueUsers}>{row.uniqueUsers.toLocaleString()}</Td>
                <Td dataLabel={columnNames.sessions}>{row.sessions.toLocaleString()}</Td>
                <Td dataLabel={columnNames.bounceRate}>
                  <span style={{ color: getBounceRateColor(row.bounceRate), fontWeight: 'bold' }}>
                    {row.bounceRate}%
                  </span>
                </Td>
                <Td dataLabel={columnNames.avgTimeOnPage}>{row.avgTimeOnPage}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredData.length}
          widgetId="top-pages-table-pagination"
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

const WebMetricsCard: React.FunctionComponent<{
  title: string;
  current: number;
  previous: number;
  unit: string;
  color?: string;
}> = ({ title, current, previous, unit, color = '#0066CC' }) => {
  const change = current - previous;
  const changePercent = previous !== 0 ? ((change / previous) * 100) : 0;
  const isIncreasing = change > 0;

  const formatValue = (value: number) => {
    if (title === 'Average Engagement Time') {
      return value.toFixed(2);
    }
    return Math.round(value).toLocaleString();
  };

  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ textAlign: 'center', padding: '15px 10px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, marginBottom: '8px' }}>
            {formatValue(current)}{unit}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: isIncreasing ? '#3E8635' : '#C9190B',
            marginBottom: '10px'
          }}>
            {isIncreasing ? '↗' : '↘'} {Math.abs(changePercent).toFixed(1)}% vs last month
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6a6e73', lineHeight: '1.2' }}>
            Current: {formatValue(current)}{unit}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6a6e73', lineHeight: '1.2' }}>
            Previous: {formatValue(previous)}{unit}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const Web: React.FunctionComponent = () => (
  <>
    <PageSection>
      <Title headingLevel="h1" size="lg">Web Analytics</Title>
      <p>Metrics of user attributes and behavior from Google Analytics.</p>
      <Alert variant='info' title='Notice'>
        <p>The PatternFly.org website is not monetized and will not have any data related to revenue or other related metrics.</p>
      </Alert>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Key Web Metrics</Title>
      <p>Real-time web analytics showing current performance indicators:</p>
      <Grid hasGutter>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <WebMetricsCard 
            title="Active Users" 
            current={webMetricsData.activeUsers.current}
            previous={webMetricsData.activeUsers.previous}
            unit={webMetricsData.activeUsers.unit}
            color="#0066CC"
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <WebMetricsCard 
            title="New Users" 
            current={webMetricsData.newUsers.current}
            previous={webMetricsData.newUsers.previous}
            unit={webMetricsData.newUsers.unit}
            color="#009639"
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <WebMetricsCard 
            title="Event Count" 
            current={webMetricsData.eventCount.current}
            previous={webMetricsData.eventCount.previous}
            unit={webMetricsData.eventCount.unit}
            color="#EC7A08"
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <WebMetricsCard 
            title="Average Engagement Time" 
            current={webMetricsData.avgEngagementTime.current}
            previous={webMetricsData.avgEngagementTime.previous}
            unit={webMetricsData.avgEngagementTime.unit}
            color="#8476D1"
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Geographic User Demographics</Title>
      <p>Where users are accessing PatternFly from around the world:</p>
      <Grid hasGutter>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <GeographicMap />
        </GridItem>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <GeographicTable />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">User Information</Title>
      <ListBasic />
      <Divider />
      <p>Operating Systems, click the dropdown for a breakdown of versions for each operating system</p>
      <BasicWithRightAlignedLegend />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Top Website Pages</Title>
      <p>Most popular pages ranked by traffic and engagement metrics:</p>
      <TopPagesTable />
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Acquisition, Engagement, and Retention</Title>
      <p>Metrics of the life cycle of users entering, staying, and returning to the website from Google Analytics.</p>
    </PageSection>
  </>
)

const ListBasic: React.FunctionComponent = () => (
  <List>
    <ListItem>Table of Contents</ListItem>
    <ListItem>Demographics</ListItem>
    <ListItem>Audiences</ListItem>
    <ListItem>Tech: operating system versions - stacked bar, device category, browser, screen resolution</ListItem>
    <ListItem>Acquisition: Users and Sessions</ListItem>
    <ListItem>Engagement: Events and Pages </ListItem>
    <ListItem>Retention</ListItem>
  </List>
);

const BasicWithRightAlignedLegend: React.FunctionComponent = () => (
  <div style={{ height: '230px', width: '350px' }}>
    <VictoryPie
      data={[{ x: 'Windows', y: 5565 }, { x: 'Macintosh', y: 4548 }, { x: 'Linux', y: 751 }, 
        { x: 'Android', y: 618 }, { x: 'iOS', y: 510 }, { x: 'Other', y: 155}
      ]}
      height={230}
      width={350}
      padding={{
        bottom: 20,
        left: 20,
        right: 160, // Adjust to fit legend
        top: 20
      }}
      labelComponent={<VictoryTooltip />}
      colorScale={["#0066CC", "#009639", "#EC7A08", "#8476D1", "#C9190B", "#6A6E73"]}
      style={{
        labels: { fontSize: 12, fill: "black" }
      }}
    />
  </div>
)

export { Web }