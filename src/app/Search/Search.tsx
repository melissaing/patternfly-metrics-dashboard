import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Title, Alert, List, ListItem, Card, CardTitle, CardBody, Grid, GridItem, PageSection } from '@patternfly/react-core';
import { Fragment, useEffect, useState } from 'react';
import { Table, Caption, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { VictoryLine, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

// Sample data for metrics charts
const generateSampleData = (baseValue: number, variance: number, points: number = 12) => {
  return Array.from({ length: points }, (_, i) => ({
    x: i + 1,
    y: Math.max(0, baseValue + (Math.random() - 0.5) * variance)
  }));
};

const metricsData = {
  totalUsers: generateSampleData(15000, 3000),
  totalSearches: generateSampleData(8500, 2000),
  noResultsRate: generateSampleData(12, 8).map(d => ({ ...d, y: Math.min(d.y, 25) })), // Keep percentage realistic
  noClicksRate: generateSampleData(18, 10).map(d => ({ ...d, y: Math.min(d.y, 35) })) // Keep percentage realistic
};

const MetricsCard: React.FunctionComponent<{
  title: string;
  data: Array<{ x: number; y: number }>;
  color?: string;
  isPercentage?: boolean;
}> = ({ title, data, color = '#0066CC', isPercentage = false }) => {
  const currentValue = data[data.length - 1]?.y || 0;
  const previousValue = data[data.length - 2]?.y || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100) : 0;
  const isIncreasing = change > 0;

  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
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
  
  // Transform data to include month names for tooltips
  const chartData = data.map(item => ({
    x: item.x,
    y: item.y,
    label: `${monthNames[item.x - 1] || `Month ${item.x}`}: ${Math.round(item.y)}${isPercentage ? '%' : ''}`
  }));

  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ height: '300px' }}>
          <VictoryChart
            height={300}
            width={400}
            padding={{ left: 80, top: 20, right: 50, bottom: 60 }}
          >
            <VictoryAxis 
              dependentAxis
              tickFormat={(x) => `${Math.round(x)}${isPercentage ? '%' : ''}`}
              style={{
                tickLabels: { fontSize: 12, padding: 5 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryAxis 
              tickFormat={monthNames}
              style={{
                tickLabels: { fontSize: 12, padding: 5, angle: -45 },
                grid: { stroke: "#e0e0e0" }
              }}
            />
            <VictoryLine
              data={chartData}
              style={{
                data: { stroke: color, strokeWidth: 3 }
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

const Search: React.FunctionComponent = () => (
  <>
    <PageSection>
      <Title headingLevel="h1" size="lg">Internal Search Metrics</Title>
      <p>Metrics for the search engine powered by Algolia in the patternfly.org website.</p>
      <strong>Note:</strong> These metrics come from within the website, not search results leading users to the website.
      Those can be found under the Web Metrics section.
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Key Search Metrics</Title>
      <p>Real-time metrics showing current search performance indicators:</p>
      <Grid hasGutter>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <MetricsCard 
            title="Total Users" 
            data={metricsData.totalUsers} 
            color="#0066CC"
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <MetricsCard 
            title="Total Searches" 
            data={metricsData.totalSearches} 
            color="#009639"
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <MetricsCard 
            title="No Results Rate" 
            data={metricsData.noResultsRate} 
            color="#C9190B"
            isPercentage={true}
          />
        </GridItem>
        <GridItem xl={3} lg={3} md={6} sm={12}>
          <MetricsCard 
            title="No Clicks Rate" 
            data={metricsData.noClicksRate} 
            color="#EC7A08"
            isPercentage={true}
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Detailed Metrics Analysis</Title>
      <p>Visual charts paired with detailed data tables for comprehensive analysis:</p>
      
      {/* Total Users - Chart and Table */}
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

      {/* Total Searches - Chart and Table */}
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

      {/* No Results Rate - Chart and Table */}
      <Grid hasGutter style={{ marginBottom: '2rem' }}>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <MetricsChart 
            title="No Results Rate" 
            data={metricsData.noResultsRate}
            color="#C9190B"
            isPercentage={true}
          />
        </GridItem>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <MetricsTable 
            title="No Results Rate" 
            data={metricsData.noResultsRate}
            isPercentage={true}
          />
        </GridItem>
      </Grid>

      {/* No Clicks Rate - Chart and Table */}
      <Grid hasGutter>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <MetricsChart 
            title="No Clicks Rate" 
            data={metricsData.noClicksRate}
            color="#EC7A08"
            isPercentage={true}
          />
        </GridItem>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <MetricsTable 
            title="No Clicks Rate" 
            data={metricsData.noClicksRate}
            isPercentage={true}
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection>
      <Title headingLevel="h2">Additional Search Details</Title>
    </PageSection>
  </>
)

export { Search }