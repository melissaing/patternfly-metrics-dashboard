import * as React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { PageSection, Title, List, ListItem, Card, CardTitle, CardBody, Grid, GridItem, Pagination, Nav, NavList, NavItem, TextInput, InputGroup, InputGroupItem } from '@patternfly/react-core';
import { VictoryPie, VictoryContainer, VictoryTooltip } from 'victory';
import { Table, Thead, Tr, Th, Tbody, Td, ThProps } from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { useState } from 'react';

// Sample data for version distributions
const versionData = {
  reactVersions: [
    { x: "React 18.x", y: 65, color: "#0066CC" },
    { x: "React 17.x", y: 25, color: "#009639" },
    { x: "React 16.x", y: 8, color: "#EC7A08" },
    { x: "React 15.x", y: 2, color: "#C9190B" }
  ],
  pfReactVersions: [
    { x: "PF React 6.x", y: 45, color: "#0066CC" },
    { x: "PF React 5.x", y: 35, color: "#009639" },
    { x: "PF React 4.x", y: 15, color: "#EC7A08" },
    { x: "PF React 3.x", y: 5, color: "#C9190B" }
  ],
  pfCoreVersions: [
    { x: "PF Core 6.x", y: 50, color: "#0066CC" },
    { x: "PF Core 5.x", y: 30, color: "#009639" },
    { x: "PF Core 4.x", y: 15, color: "#EC7A08" },
    { x: "PF Core 3.x", y: 5, color: "#C9190B" }
  ]
};

// Sample data for product adoption table
const productData = [
  { id: 1, product: "Red Hat Console", team: "Console Team", pfVersion: "6.2.1", reactVersion: "18.2.0", adoption: "Complete", lastUpdate: "2024-01-15" },
  { id: 2, product: "OpenShift Console", team: "OpenShift UX", pfVersion: "6.1.0", reactVersion: "18.1.0", adoption: "In Progress", lastUpdate: "2024-01-10" },
  { id: 3, product: "Ansible Automation Platform", team: "Ansible UX", pfVersion: "5.3.2", reactVersion: "17.0.2", adoption: "Complete", lastUpdate: "2023-12-20" },
  { id: 4, product: "Red Hat Insights", team: "Insights Team", pfVersion: "6.0.1", reactVersion: "18.0.0", adoption: "Complete", lastUpdate: "2024-01-08" },
  { id: 5, product: "RHEL Web Console", team: "Cockpit Team", pfVersion: "5.2.1", reactVersion: "17.0.2", adoption: "Partial", lastUpdate: "2023-11-30" },
  { id: 6, product: "Red Hat Satellite", team: "Satellite UX", pfVersion: "4.8.0", reactVersion: "16.14.0", adoption: "Planning", lastUpdate: "2023-10-15" },
  { id: 7, product: "Advanced Cluster Management", team: "ACM Team", pfVersion: "6.1.2", reactVersion: "18.1.0", adoption: "In Progress", lastUpdate: "2024-01-12" },
  { id: 8, product: "Red Hat Directory Server", team: "Directory Team", pfVersion: "5.1.0", reactVersion: "17.0.1", adoption: "Partial", lastUpdate: "2023-09-22" },
  { id: 9, product: "CodeReady Workspaces", team: "DevSpaces Team", pfVersion: "5.3.1", reactVersion: "17.0.2", adoption: "Complete", lastUpdate: "2023-12-05" },
  { id: 10, product: "Red Hat Quay", team: "Quay Team", pfVersion: "6.0.0", reactVersion: "18.0.0", adoption: "In Progress", lastUpdate: "2024-01-03" },
  { id: 11, product: "Red Hat Build Service", team: "Build Team", pfVersion: "5.2.3", reactVersion: "17.0.2", adoption: "Planning", lastUpdate: "2023-11-18" },
  { id: 12, product: "Red Hat Service Interconnect", team: "Interconnect Team", pfVersion: "6.1.1", reactVersion: "18.1.0", adoption: "Complete", lastUpdate: "2024-01-06" },
  { id: 13, product: "Red Hat Migration Toolkit", team: "Migration Team", pfVersion: "5.0.2", reactVersion: "16.14.0", adoption: "Partial", lastUpdate: "2023-10-28" },
  { id: 14, product: "Red Hat Developer Hub", team: "Developer Team", pfVersion: "6.2.0", reactVersion: "18.2.0", adoption: "Complete", lastUpdate: "2024-01-14" },
  { id: 15, product: "Red Hat Trusted Profile Analyzer", team: "Security Team", pfVersion: "5.3.0", reactVersion: "17.0.2", adoption: "In Progress", lastUpdate: "2023-12-12" },
  { id: 16, product: "Red Hat Enterprise Linux", team: "RHEL Team", pfVersion: "4.5.0", reactVersion: "16.13.0", adoption: "Planning", lastUpdate: "2023-09-15" },
  { id: 17, product: "Red Hat OpenStack Platform", team: "OpenStack Team", pfVersion: "5.1.2", reactVersion: "17.0.1", adoption: "Partial", lastUpdate: "2023-11-02" },
  { id: 18, product: "Red Hat Virtualization", team: "RHV Team", pfVersion: "4.7.1", reactVersion: "16.14.0", adoption: "Planning", lastUpdate: "2023-08-20" },
  { id: 19, product: "Red Hat CloudForms", team: "CloudForms Team", pfVersion: "5.2.0", reactVersion: "17.0.1", adoption: "Partial", lastUpdate: "2023-10-10" },
  { id: 20, product: "Red Hat JBoss EAP", team: "JBoss Team", pfVersion: "6.0.2", reactVersion: "18.0.0", adoption: "In Progress", lastUpdate: "2024-01-01" },
  { id: 21, product: "Red Hat Fuse", team: "Integration Team", pfVersion: "5.3.3", reactVersion: "17.0.2", adoption: "Complete", lastUpdate: "2023-12-18" },
  { id: 22, product: "Red Hat AMQ", team: "Messaging Team", pfVersion: "6.1.0", reactVersion: "18.1.0", adoption: "In Progress", lastUpdate: "2024-01-09" },
  { id: 23, product: "Red Hat Data Grid", team: "Data Team", pfVersion: "5.0.1", reactVersion: "16.14.0", adoption: "Planning", lastUpdate: "2023-09-30" },
  { id: 24, product: "Red Hat Process Automation", team: "Automation Team", pfVersion: "5.2.2", reactVersion: "17.0.1", adoption: "Partial", lastUpdate: "2023-11-25" },
  { id: 25, product: "Red Hat Decision Manager", team: "Decision Team", pfVersion: "6.0.3", reactVersion: "18.0.0", adoption: "Complete", lastUpdate: "2024-01-07" }
];

const SortableTable: React.FunctionComponent = () => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 0, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const columnNames = {
    product: 'Product',
    team: 'Team',
    pfVersion: 'PF Version',
    reactVersion: 'React Version',
    adoption: 'Adoption Status',
    lastUpdate: 'Last Update'
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
      return productData;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return productData.filter((item) =>
      item.product.toLowerCase().includes(searchLower) ||
      item.team.toLowerCase().includes(searchLower) ||
      item.pfVersion.toLowerCase().includes(searchLower) ||
      item.reactVersion.toLowerCase().includes(searchLower) ||
      item.adoption.toLowerCase().includes(searchLower) ||
      item.lastUpdate.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue, bValue;
      
      switch (index) {
        case 0:
          aValue = a.product;
          bValue = b.product;
          break;
        case 1:
          aValue = a.team;
          bValue = b.team;
          break;
        case 2:
          aValue = a.pfVersion;
          bValue = b.pfVersion;
          break;
        case 3:
          aValue = a.reactVersion;
          bValue = b.reactVersion;
          break;
        case 4:
          aValue = a.adoption;
          bValue = b.adoption;
          break;
        case 5:
          aValue = new Date(a.lastUpdate);
          bValue = new Date(b.lastUpdate);
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

  const getAdoptionColor = (status: string) => {
    switch (status) {
      case 'Complete': return '#3E8635';
      case 'In Progress': return '#F0AB00';
      case 'Partial': return '#EC7A08';
      case 'Planning': return '#6A6E73';
      default: return '#151515';
    }
  };

  return (
    <Card>
      <CardTitle>Product Adoption Details</CardTitle>
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <InputGroup>
            <InputGroupItem>
              <SearchIcon />
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInput
                placeholder="Search products, teams, versions, or status..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Search table"
              />
            </InputGroupItem>
          </InputGroup>
          {searchTerm && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
              Showing {filteredData.length} of {productData.length} results
            </div>
          )}
        </div>
        <Table aria-label="Sortable product adoption table">
          <Thead>
            <Tr>
              <Th sort={getSortParams(0)}>{columnNames.product}</Th>
              <Th sort={getSortParams(1)}>{columnNames.team}</Th>
              <Th sort={getSortParams(2)}>{columnNames.pfVersion}</Th>
              <Th sort={getSortParams(3)}>{columnNames.reactVersion}</Th>
              <Th sort={getSortParams(4)}>{columnNames.adoption}</Th>
              <Th sort={getSortParams(5)}>{columnNames.lastUpdate}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel={columnNames.product}>{row.product}</Td>
                <Td dataLabel={columnNames.team}>{row.team}</Td>
                <Td dataLabel={columnNames.pfVersion}>{row.pfVersion}</Td>
                <Td dataLabel={columnNames.reactVersion}>{row.reactVersion}</Td>
                <Td dataLabel={columnNames.adoption}>
                  <span style={{ color: getAdoptionColor(row.adoption), fontWeight: 'bold' }}>
                    {row.adoption}
                  </span>
                </Td>
                <Td dataLabel={columnNames.lastUpdate}>{row.lastUpdate}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          itemCount={filteredData.length}
          widgetId="product-table-pagination"
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

const PieChartCard: React.FunctionComponent<{
  title: string;
  data: Array<{ x: string; y: number; color: string }>;
}> = ({ title, data }) => {
  return (
    <Card isFullHeight>
      <CardTitle>{title}</CardTitle>
      <CardBody>
        <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <VictoryPie
            data={data}
            width={350}
            height={350}
            innerRadius={50}
            labelRadius={120}
            labelComponent={<VictoryTooltip />}
            colorScale={data.map(item => item.color)}
            animate={{
              duration: 1000
            }}
            style={{
              labels: { fontSize: 12, fill: "black" }
            }}
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          {data.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '5px',
              fontSize: '0.875rem'
            }}>
              <div 
                style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: item.color, 
                  marginRight: '8px',
                  borderRadius: '2px'
                }}
              />
              <span>{item.x}: {item.y}%</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const PageNavigation: React.FunctionComponent = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card>
      <CardBody style={{ padding: '1rem' }}>
        <Nav aria-label="Page sections navigation" variant="horizontal">
          <NavList>
            <NavItem 
              onClick={() => scrollToSection('version-distribution')}
              style={{ cursor: 'pointer' }}
            >
              Version Distribution
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('adoption-table')}
              style={{ cursor: 'pointer' }}
            >
              Adoption Table
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('additional-details')}
              style={{ cursor: 'pointer' }}
            >
              Additional Details
            </NavItem>
          </NavList>
        </Nav>
      </CardBody>
    </Card>
  );
};

const Product: React.FunctionComponent = () => (
  <>
    <PageSection>
      <Title headingLevel="h1" size="lg">PatternFly Adoption</Title>
      <p>Metrics of PatternFly usage by Red Hat teams and products.</p>
    </PageSection>
    <PageSection>
      <PageNavigation />
    </PageSection>
    <PageSection id="version-distribution">
      <Title headingLevel="h2">Version Distribution</Title>
      <p>Current version adoption across Red Hat teams and products:</p>
      <Grid hasGutter>
        <GridItem xl={4} lg={4} md={6} sm={12}>
          <PieChartCard 
            title="React Version Distribution" 
            data={versionData.reactVersions}
          />
        </GridItem>
        <GridItem xl={4} lg={4} md={6} sm={12}>
          <PieChartCard 
            title="PatternFly React Core Version" 
            data={versionData.pfReactVersions}
          />
        </GridItem>
        <GridItem xl={4} lg={4} md={12} sm={12}>
          <PieChartCard 
            title="PatternFly Core Version" 
            data={versionData.pfCoreVersions}
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection id="adoption-table">
      <Title headingLevel="h2">Product Adoption Table</Title>
      <p>Detailed breakdown of PatternFly adoption across Red Hat products and teams:</p>
      <SortableTable />
    </PageSection>
    <PageSection id="additional-details">
      <Title headingLevel="h2">Additional Details</Title>
      <ListBasic />
    </PageSection>
  </>
)

const ListBasic: React.FunctionComponent = () => (
  <List>
    <ListItem>Table of Contents</ListItem>
    <ListItem>Patternfly Version</ListItem>
    <ListItem>PF React Versions</ListItem>
    <ListItem>PF Core Versions</ListItem>
  </List>
);

export { Product }