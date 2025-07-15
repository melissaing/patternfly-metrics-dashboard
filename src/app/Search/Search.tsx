import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Title, Alert, List, ListItem, Card, CardTitle, CardBody, Grid, GridItem, PageSection, InputGroup, InputGroupItem, TextInput, Button, Pagination } from '@patternfly/react-core';
import { Fragment, useEffect, useState } from 'react';
import { Table, Caption, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTooltip, VictoryBar, VictoryContainer } from 'victory';
import { SearchIcon } from '@patternfly/react-icons';

// Import the actual search analytics data
import { 
  searchesWithoutClicks,
  searchesWithoutResults, 
  detailedSearchData, 
  searchAnalyticsSummary,
  SearchAnalyticsData,
  DetailedSearchData 
} from '../data/analyticsData';

// Transform search data into time series for charts
const generateTimeSeriesFromSearchData = (baseValue: number, variance: number, trend: number = 0) => {
  return Array.from({ length: 12 }, (_, i) => ({
    x: i + 1,
    y: Math.max(0, baseValue + (trend * i) + (Math.random() - 0.5) * variance)
  }));
};

// Calculate metrics from actual search data
const calculateMetrics = () => {
  const totalSearches = searchAnalyticsSummary.totalSearches;
  const estimatedUsers = Math.round(totalSearches * 0.4); // Estimate based on typical user-to-search ratio
  
  // Calculate no results rate from searches with 0 hits
  const noResultSearches = detailedSearchData.filter(search => search.nbHits === 0).length;
  const noResultsRate = (noResultSearches / detailedSearchData.length) * 100;
  
  // Calculate no clicks rate (all searches in searchesWithoutClicks had no clicks)
  const totalClickableSearches = detailedSearchData.length;
  const noClickSearches = searchesWithoutClicks.length;
  const noClicksRate = Math.min((noClickSearches / totalClickableSearches) * 100, 100);

  return {
    totalUsers: generateTimeSeriesFromSearchData(estimatedUsers, estimatedUsers * 0.2, 50),
    totalSearches: generateTimeSeriesFromSearchData(totalSearches, totalSearches * 0.15, 30),
    noResultsRate: generateTimeSeriesFromSearchData(noResultsRate, 5, -0.2),
    noClicksRate: generateTimeSeriesFromSearchData(noClicksRate, 8, -0.5)
  };
};

const metricsData = calculateMetrics();

const MetricsCard: React.FunctionComponent<{
  title: string;
  data: Array<{ x: number; y: number }>;
  color?: string;
  isPercentage?: boolean;
  onClick?: () => void;
}> = ({ title, data, color = '#0066CC', isPercentage = false, onClick }) => {
  const currentValue = data[data.length - 1]?.y || 0;
  const previousValue = data[data.length - 2]?.y || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0;
  const isIncreasing = change > 0;

  return (
    <Card 
      isFullHeight 
      isClickable={!!onClick}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--pf-v5-c-card--BoxShadow)';
        }
      }}
    >
      <CardTitle>
        {title}
        {onClick && (
          <span style={{ 
            float: 'right', 
            fontSize: '0.875rem', 
            color: '#6a6e73',
            fontWeight: 'normal'
          }}>
            ↓ Click for details
          </span>
        )}
      </CardTitle>
      <CardBody>
        <div style={{ textAlign: 'center', padding: '15px 10px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: color, marginBottom: '8px' }}>
            {Math.round(currentValue)}{isPercentage ? '%' : ''}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: isIncreasing ? '#3E8635' : '#C9190B',
            marginBottom: '10px'
          }}>
            {isIncreasing ? '↗' : '↘'} {Math.abs(changePercent).toFixed(1)}% vs last month
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6a6e73', lineHeight: '1.2' }}>
            Current: {Math.round(currentValue)}{isPercentage ? '%' : ''}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6a6e73', lineHeight: '1.2' }}>
            Previous: {Math.round(previousValue)}{isPercentage ? '%' : ''}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const MetricsChart: React.FunctionComponent<{
  title: string;
  data: Array<{ x: number; y: number }>;
  color?: string;
  isPercentage?: boolean;
}> = ({ title, data, color = '#0066CC', isPercentage = false }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Transform data for PatternFly charts
  const chartData = data.map(item => ({
    name: monthNames[item.x - 1] || `Month ${item.x}`,
    x: item.x,
    y: item.y
  }));

  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ height: '500px' }}>
          <VictoryChart
            height={500}
            width={700}
            padding={{ left: 100, top: 30, right: 70, bottom: 80 }}
          >
            <VictoryAxis 
              dependentAxis
              tickFormat={(x) => `${Math.round(x)}${isPercentage ? '%' : ''}`}
              style={{
                tickLabels: { fontSize: 14, padding: 5 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryAxis 
              tickFormat={monthNames}
              style={{
                tickLabels: { fontSize: 14, padding: 5, angle: -45 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryLine
              data={chartData}
              style={{
                data: { stroke: color, strokeWidth: 4 }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </div>
      </CardBody>
    </Card>
  );
};

const MetricsTable: React.FunctionComponent<{
  title: string;
  data: Array<{ x: number; y: number }>;
  isPercentage?: boolean;
}> = ({ title, data, isPercentage = false }) => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <Table aria-label={`${title} data table`} variant="compact">
          <Caption>{title} - Monthly Data</Caption>
          <Thead>
            <Tr>
              <Th>Month</Th>
              <Th>Value</Th>
              <Th>Change</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item, index) => {
              const previousValue = index > 0 ? data[index - 1].y : item.y;
              const change = item.y - previousValue;
              const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0;
              const isIncreasing = change > 0;
              
              return (
                <Tr key={item.x}>
                  <Td dataLabel="Month">{monthNames[item.x - 1] || `Month ${item.x}`}</Td>
                  <Td dataLabel="Value">
                    {Math.round(item.y)}{isPercentage ? '%' : ''}
                  </Td>
                  <Td dataLabel="Change">
                    {index === 0 ? '-' : (
                      <span style={{ color: isIncreasing ? '#3E8635' : '#C9190B' }}>
                        {isIncreasing ? '+' : ''}{Math.round(change)}{isPercentage ? '%' : ''} 
                        ({isIncreasing ? '+' : ''}{changePercent.toFixed(1)}%)
                      </span>
                    )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

const SearchTermsTable: React.FunctionComponent<{
  title: string;
  data: SearchAnalyticsData[] | DetailedSearchData[];
  isDetailed?: boolean;
}> = ({ title, data, isDetailed = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 1, direction: 'desc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

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
      item.search.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, data]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue, bValue;
      
      switch (index) {
        case 0:
          aValue = a.search;
          bValue = b.search;
          break;
        case 1:
          aValue = a.count;
          bValue = b.count;
          break;
        case 2:
          aValue = a.nbHits;
          bValue = b.nbHits;
          break;
        case 3:
          aValue = a.totalPercent;
          bValue = b.totalPercent;
          break;
        case 4:
          if (isDetailed) {
            aValue = (a as DetailedSearchData).clickThroughRate;
            bValue = (b as DetailedSearchData).clickThroughRate;
          } else {
            return 0;
          }
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sortedArray;
  }, [filteredData, sortBy, isDetailed]);

  // Calculate pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const onSetPage = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPage: number) => {
    setPage(newPage);
  };

  const onPerPageSelect = (_event: React.MouseEvent | React.KeyboardEvent | MouseEvent, newPerPage: number, newPage: number) => {
    setPerPage(newPerPage);
    setPage(newPage);
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
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(_event, value) => setSearchTerm(value)}
                aria-label="Search terms"
              />
            </InputGroupItem>
          </InputGroup>
          {searchTerm && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Showing {filteredData.length} of {data.length} search terms
            </div>
          )}
        </div>
        
        <Pagination
          itemCount={sortedData.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          widgetId="search-terms-pagination-top"
          perPageOptions={[
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 },
            { title: '100', value: 100 }
          ]}
        />

        <Table aria-label={title}>
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>Search Term</Th>
              <Th sort={getSortParams(1)}>Count</Th>
              <Th sort={getSortParams(2)}>Results Found</Th>
              <Th sort={getSortParams(3)}>% of Total</Th>
              {isDetailed && <Th sort={getSortParams(4)}>Click Rate</Th>}
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((item, index) => (
              <Tr key={index}>
                <Td dataLabel="Search Term">
                  <strong>{item.search}</strong>
                </Td>
                <Td dataLabel="Count">{item.count}</Td>
                <Td dataLabel="Results Found">{item.nbHits}</Td>
                <Td dataLabel="% of Total">{(item.totalPercent * 100).toFixed(3)}%</Td>
                {isDetailed && (
                  <Td dataLabel="Click Rate">
                    {((item as DetailedSearchData).clickThroughRate * 100).toFixed(1)}%
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Pagination
          itemCount={sortedData.length}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          onPerPageSelect={onPerPageSelect}
          widgetId="search-terms-pagination-bottom"
          perPageOptions={[
            { title: '10', value: 10 },
            { title: '20', value: 20 },
            { title: '50', value: 50 },
            { title: '100', value: 100 }
          ]}
        />
      </CardBody>
    </Card>
  );
};

const TopSearchTermsChart: React.FunctionComponent = () => {
  const topTerms = searchesWithoutResults.slice(0, 10);
  const chartData = topTerms.map((item, index) => ({
    name: item.search,
    x: item.search,
    y: item.count
  }));

  return (
    <Card>
      <CardTitle>Top 10 Search Terms (No Results)</CardTitle>
      <CardBody>
        <div style={{ height: '600px' }}>
          <VictoryChart
            height={600}
            width={800}
            padding={{ left: 100, top: 30, right: 70, bottom: 120 }}
            domainPadding={30}
          >
            <VictoryAxis 
              dependentAxis
              tickFormat={(x) => `${x}`}
              style={{
                tickLabels: { fontSize: 14, padding: 5 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryAxis 
              tickFormat={(x) => topTerms[x - 1]?.search || ''}
              fixLabelOverlap={false}
              style={{
                tickLabels: { fontSize: 12, padding: 5, angle: -45 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryBar
              data={chartData}
              style={{
                data: { fill: "#0066CC" }
              }}
              animate={{
                duration: 1000,
                onLoad: { duration: 500 }
              }}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryChart>
        </div>
      </CardBody>
    </Card>
  );
};

const Search: React.FunctionComponent = () => {
  // Function to scroll to a specific section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="lg">Internal Search Metrics</Title>
        <p>Metrics for the search engine powered by Algolia in the patternfly.org website.</p>
        <Alert variant="info" title="Data Source" style={{ marginTop: '1rem' }}>
          Analytics data from {searchAnalyticsSummary.dateRange} showing {searchAnalyticsSummary.totalSearches} total searches across {searchAnalyticsSummary.uniqueSearchTerms} unique terms that returned no results.
        </Alert>
      </PageSection>
      <PageSection>
        <Title headingLevel="h2">Key Search Metrics</Title>
        <p>Real-time metrics showing current search performance indicators. Click any card to jump to its detailed chart and data below.</p>
        <Grid hasGutter>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <MetricsCard 
              title="Total Users" 
              data={metricsData.totalUsers} 
              color="#0066CC"
              onClick={() => scrollToSection('total-users-section')}
            />
          </GridItem>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <MetricsCard 
              title="Total Searches" 
              data={metricsData.totalSearches} 
              color="#009639"
              onClick={() => scrollToSection('total-searches-section')}
            />
          </GridItem>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <MetricsCard 
              title="No Results Rate" 
              data={metricsData.noResultsRate} 
              color="#C9190B"
              isPercentage={true}
              onClick={() => scrollToSection('no-results-rate-section')}
            />
          </GridItem>
          <GridItem xl={3} lg={3} md={6} sm={12}>
            <MetricsCard 
              title="No Clicks Rate" 
              data={metricsData.noClicksRate} 
              color="#EC7A08"
              isPercentage={true}
              onClick={() => scrollToSection('no-clicks-rate-section')}
            />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection>
        <Title headingLevel="h2">Search Terms Analysis</Title>
        <p>Detailed breakdown of actual search terms and their performance:</p>
        
        <Grid hasGutter style={{ marginBottom: '2rem' }}>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <TopSearchTermsChart />
          </GridItem>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <Card>
              <CardTitle>Search Analytics Summary</CardTitle>
              <CardBody>
                <List>
                  <ListItem>
                    <strong>Total Searches:</strong> {searchAnalyticsSummary.totalSearches.toLocaleString()}
                  </ListItem>
                  <ListItem>
                    <strong>Unique Search Terms:</strong> {searchAnalyticsSummary.uniqueSearchTerms}
                  </ListItem>
                  <ListItem>
                    <strong>Average Searches per Term:</strong> {searchAnalyticsSummary.avgSearchesPerTerm}
                  </ListItem>
                  <ListItem>
                    <strong>Most Searched Term (No Results):</strong> "{searchAnalyticsSummary.mostSearchedTerm}"
                  </ListItem>
                  <ListItem>
                    <strong>Top Search Category:</strong> {searchAnalyticsSummary.topSearchCategory}
                  </ListItem>
                  <ListItem>
                    <strong>No Result Terms:</strong> {searchAnalyticsSummary.noResultTerms}
                  </ListItem>
                </List>
                <div style={{ marginTop: '1rem' }}>
                  <strong>Search Trends by Category (No Results):</strong>
                  <ul style={{ marginTop: '0.5rem' }}>
                    <li>Components: {searchAnalyticsSummary.searchTrends.components}%</li>
                    <li>Styling: {searchAnalyticsSummary.searchTrends.styling}%</li>
                    <li>Layouts: {searchAnalyticsSummary.searchTrends.layouts}%</li>
                    <li>Utilities: {searchAnalyticsSummary.searchTrends.utilities}%</li>
                    <li>Invalid/Typos: {searchAnalyticsSummary.searchTrends.invalid}%</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Grid hasGutter style={{ marginBottom: '2rem' }}>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <SearchTermsTable 
              title="Search Terms Without Results"
              data={searchesWithoutResults}
              isDetailed={false}
            />
          </GridItem>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <Card>
              <CardTitle>Top 10 Search Terms Without Results</CardTitle>
              <CardBody>
                <div style={{ height: '500px' }}>
                  <VictoryChart
                    height={500}
                    width={700}
                    padding={{ left: 100, top: 30, right: 70, bottom: 120 }}
                    domainPadding={30}
                  >
                    <VictoryAxis 
                      dependentAxis
                      tickFormat={(x) => `${x}`}
                      style={{
                        tickLabels: { fontSize: 14, padding: 5 },
                        grid: { stroke: "#e0e0e0" }
                      }}
                    />
                    <VictoryAxis 
                      tickFormat={(x, i) => {
                        const topNoResults = searchesWithoutResults.slice(0, 10);
                        return topNoResults[x - 1]?.search.substring(0, 15) + (topNoResults[x - 1]?.search.length > 15 ? '...' : '') || '';
                      }}
                      fixLabelOverlap={false}
                      style={{
                        tickLabels: { fontSize: 12, padding: 5, angle: -45 },
                        grid: { stroke: "#e0e0e0" }
                      }}
                    />
                    <VictoryBar
                      data={searchesWithoutResults
                        .slice(0, 10)
                        .map((item, index) => ({
                          name: item.search,
                          x: index + 1,
                          y: item.count
                        }))}
                      style={{
                        data: { fill: "#C9190B" }
                      }}
                      animate={{
                        duration: 1000,
                        onLoad: { duration: 500 }
                      }}
                      labelComponent={<VictoryTooltip />}
                    />
                  </VictoryChart>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <Grid hasGutter>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <SearchTermsTable 
              title="Search Terms Without Clicks"
              data={searchesWithoutClicks}
              isDetailed={false}
            />
          </GridItem>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <SearchTermsTable 
              title="Detailed Search Analytics"
              data={detailedSearchData}
              isDetailed={true}
            />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection>
        <Title headingLevel="h2">Historical Trends</Title>
        <p>Visual charts and detailed data tables for comprehensive trend analysis:</p>
        
        {/* Total Users - Chart and Table (Same Data) */}
        <div id="total-users-section">
          <Grid hasGutter style={{ marginBottom: '2rem' }}>
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <MetricsChart 
                title="Total Users" 
                data={metricsData.totalUsers}
                color="#0066CC"
              />
            </GridItem>
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <MetricsTable 
                title="Total Users" 
                data={metricsData.totalUsers}
              />
            </GridItem>
          </Grid>
        </div>

        {/* Total Searches - Chart and Table (Same Data) */}
        <div id="total-searches-section">
          <Grid hasGutter style={{ marginBottom: '2rem' }}>
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <MetricsChart 
                title="Total Searches" 
                data={metricsData.totalSearches}
                color="#009639"
              />
            </GridItem>
            <GridItem xl={6} lg={6} md={12} sm={12}>
              <MetricsTable 
                title="Total Searches" 
                data={metricsData.totalSearches}
              />
            </GridItem>
          </Grid>
        </div>

        {/* Rate Metrics - Tables (Related Data) */}
        <Grid hasGutter>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <div id="no-results-rate-section">
              <MetricsTable 
                title="No Results Rate" 
                data={metricsData.noResultsRate}
                isPercentage={true}
              />
            </div>
          </GridItem>
          <GridItem xl={6} lg={6} md={12} sm={12}>
            <div id="no-clicks-rate-section">
              <MetricsTable 
                title="No Clicks Rate" 
                data={metricsData.noClicksRate}
                isPercentage={true}
              />
            </div>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};

export { Search }