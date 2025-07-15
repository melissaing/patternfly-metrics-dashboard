import * as React from 'react';
import { useState, Fragment } from 'react';

import '@patternfly/react-core/dist/styles/base.css';
import { Card, CardBody, CardTitle, Grid, GridItem, InputGroup, InputGroupItem, List, ListItem, Nav, NavItem, NavList, PageSection, Pagination, TextInput, Title, Button, Label, Badge } from '@patternfly/react-core';
import { SearchIcon, InfoCircleIcon, ExternalLinkAltIcon, ChartLineIcon, ArrowUpIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';
import { VictoryAxis, VictoryBar, VictoryChart, VictoryContainer, VictoryLine, VictoryPie, VictoryTooltip, VictoryScatter, VictoryArea } from 'victory';

import { 
  processedProducts, 
  versionDistributions, 
  packageUsage, 
  summaryStats,
  ProcessedProduct,
  VersionDistribution,
  PackageUsage,
  PfDataProcessor
} from '../utils/pfDataProcessor';

// Real data from pf.json
const productData = processedProducts;

const SortableTable: React.FunctionComponent = () => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 0, direction: 'asc' });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  const columnNames = {
    name: 'Product Name',
    organization: 'Organization',
    pfCoreVersion: 'PF React Core',
    reactVersion: 'React Version',
    pfPatternflyVersion: 'PF Core',
    packageCount: 'Package Count'
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
      item.name.toLowerCase().includes(searchLower) ||
      item.organization.toLowerCase().includes(searchLower) ||
      item.project.toLowerCase().includes(searchLower) ||
      item.pfCoreVersion.toLowerCase().includes(searchLower) ||
      item.reactVersion.toLowerCase().includes(searchLower) ||
      item.pfPatternflyVersion.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (index) {
        case 0:
          aValue = a.name;
          bValue = b.name;
          break;
        case 1:
          aValue = a.organization;
          bValue = b.organization;
          break;
        case 2:
          aValue = a.pfCoreVersion;
          bValue = b.pfCoreVersion;
          break;
        case 3:
          aValue = a.reactVersion;
          bValue = b.reactVersion;
          break;
        case 4:
          aValue = a.pfPatternflyVersion;
          bValue = b.pfPatternflyVersion;
          break;
        case 5:
          aValue = a.packageCount;
          bValue = b.packageCount;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      }
      
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
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



  return (
    <Card>
      <CardTitle>
        Product Adoption Details
        <span style={{ float: 'right', fontSize: '0.875rem', color: '#6a6e73' }}>
          {summaryStats.totalProjects} products from {summaryStats.totalTeams} teams
        </span>
      </CardTitle>
      <CardBody>
        <div style={{ marginBottom: '1rem' }}>
          <InputGroup>
            <InputGroupItem>
              <SearchIcon />
            </InputGroupItem>
            <InputGroupItem isFill>
              <TextInput
                placeholder="Search products, organizations, or versions..."
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
              <Th sort={getSortParams(0)}>{columnNames.name}</Th>
              <Th sort={getSortParams(1)}>{columnNames.organization}</Th>
              <Th sort={getSortParams(2)}>{columnNames.pfCoreVersion}</Th>
              <Th sort={getSortParams(3)}>{columnNames.reactVersion}</Th>
              <Th sort={getSortParams(4)}>{columnNames.pfPatternflyVersion}</Th>
              <Th sort={getSortParams(5)}>{columnNames.packageCount}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedData.map((row) => (
              <Tr key={row.id}>
                <Td dataLabel={columnNames.name}>
                  <div>
                    <strong>{row.project}</strong>
                    {row.subproject && (
                      <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                        {row.subproject}
                      </div>
                    )}
                  </div>
                </Td>
                <Td dataLabel={columnNames.organization}>
                  <Label color="blue" variant="outline">
                    {row.organization}
                  </Label>
                </Td>
                <Td dataLabel={columnNames.pfCoreVersion}>
                  <code style={{ fontSize: '0.875rem' }}>
                    {row.pfCoreVersion}
                  </code>
                </Td>
                <Td dataLabel={columnNames.reactVersion}>
                  <code style={{ fontSize: '0.875rem' }}>
                    {row.reactVersion}
                  </code>
                </Td>
                <Td dataLabel={columnNames.pfPatternflyVersion}>
                  <code style={{ fontSize: '0.875rem' }}>
                    {row.pfPatternflyVersion}
                  </code>
                </Td>
                <Td dataLabel={columnNames.packageCount}>
                  <strong>{row.packageCount}</strong>/20
                </Td>
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
  data: VersionDistribution[];
  subtitle?: string;
}> = ({ title, data, subtitle }) => {
  const chartData = data.map(item => ({
    x: item.version,
    y: item.percentage,
    color: item.color
  }));

  return (
    <Card isFullHeight>
      <CardTitle>
        {title}
        {subtitle && (
          <div style={{ fontSize: '0.875rem', color: '#6a6e73', fontWeight: 'normal' }}>
            {subtitle}
          </div>
        )}
      </CardTitle>
      <CardBody>
        <div style={{ height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <VictoryPie
            data={chartData}
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
              labels: { fontSize: 11, fill: "black" }
            }}
          />
        </div>
        <div style={{ marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
          {data.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '5px',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: item.color, 
                    marginRight: '8px',
                    borderRadius: '2px'
                  }}
                />
                <span>{item.version}</span>
              </div>
              <span style={{ color: '#6a6e73' }}>
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const PatternFly6AdoptionCard: React.FunctionComponent = () => {
  const [activeTab, setActiveTab] = useState<'using' | 'not-using' | 'all'>('using');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter products based on PatternFly 6 usage
  const v6Products = processedProducts.filter(product => 
    product.pfCoreVersion.startsWith('6') || product.pfPatternflyVersion.startsWith('6')
  );
  
  const nonV6Products = processedProducts.filter(product => 
    !product.pfCoreVersion.startsWith('6') && 
    !product.pfPatternflyVersion.startsWith('6') &&
    product.pfCoreVersion !== 'Not Used' &&
    product.pfPatternflyVersion !== 'Not Used'
  );

  const handleSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setSearchTerm(value);
  };

  const getFilteredProducts = (products: ProcessedProduct[]) => {
    if (!searchTerm.trim()) return products;
    
    const searchLower = searchTerm.toLowerCase();
    return products.filter(product =>
      product.project.toLowerCase().includes(searchLower) ||
      product.organization.toLowerCase().includes(searchLower) ||
      product.pfCoreVersion.toLowerCase().includes(searchLower) ||
      product.pfPatternflyVersion.toLowerCase().includes(searchLower)
    );
  };

  const ProductList: React.FunctionComponent<{ products: ProcessedProduct[]; title: string }> = ({ products, title }) => (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>{title}</h3>
        <Badge color="blue">{products.length} products</Badge>
      </div>
      <div style={{ 
        maxHeight: '300px', 
        overflowY: 'auto',
        border: '1px solid #ededed',
        borderRadius: '4px'
      }}>
        {products.slice(0, 20).map((product, index) => (
          <div key={product.id} style={{ 
            padding: '12px',
            borderBottom: index < products.length - 1 ? '1px solid #f5f5f5' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                {product.project}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6a6e73' }}>
                {product.organization}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ textAlign: 'right', fontSize: '0.75rem' }}>
                <div>PF React: <code>{product.pfCoreVersion}</code></div>
                <div>PF Core: <code>{product.pfPatternflyVersion}</code></div>
              </div>
            </div>
          </div>
        ))}
        {products.length > 20 && (
          <div style={{ 
            padding: '8px 12px',
            backgroundColor: '#f8f9fa',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6a6e73'
          }}>
            ... and {products.length - 20} more products
          </div>
        )}
      </div>
    </div>
  );

  const getCurrentProducts = () => {
    let products: ProcessedProduct[];
    switch (activeTab) {
      case 'using':
        products = v6Products;
        break;
      case 'not-using':
        products = nonV6Products;
        break;
      case 'all':
        products = processedProducts;
        break;
      default:
        products = v6Products;
    }
    return getFilteredProducts(products);
  };

  const currentProducts = getCurrentProducts();

  return (
    <Card>
      <CardTitle>PatternFly 6 Migration Tracker</CardTitle>
      <CardBody>
        <Grid hasGutter>
          <GridItem xl={3} lg={3} md={6} sm={12}>
                         <Card style={{ height: '100%', backgroundColor: '#f0f8ff', border: '2px solid #06c' }}>
               <CardBody style={{ textAlign: 'center', padding: '1.5rem' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#06c' }}>
                   {v6Products.length}
                 </div>
                <div style={{ fontSize: '0.875rem', color: '#6a6e73' }}>
                  Using PatternFly 6
                </div>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem xl={9} lg={9} md={6} sm={12}>
            <div style={{ marginBottom: '1rem' }}>
              <nav style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={activeTab === 'using' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('using')}
                  size="sm"
                >
                  Using v6 ({v6Products.length})
                </Button>
                <Button
                  variant={activeTab === 'not-using' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('not-using')}
                  size="sm"
                >
                  Not Using v6 ({nonV6Products.length})
                </Button>
                <Button
                  variant={activeTab === 'all' ? 'primary' : 'secondary'}
                  onClick={() => setActiveTab('all')}
                  size="sm"
                >
                  All Products ({processedProducts.length})
                </Button>
              </nav>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <InputGroup>
                <InputGroupItem>
                  <SearchIcon />
                </InputGroupItem>
                <InputGroupItem isFill>
                  <TextInput
                    placeholder="Search products, organizations, or versions..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search products"
                  />
                </InputGroupItem>
              </InputGroup>
              {searchTerm && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
                  Showing {currentProducts.length} results
                </div>
              )}
            </div>
          </GridItem>
        </Grid>
        
        <div style={{ marginTop: '1rem' }}>
          <ProductList 
            products={currentProducts} 
            title={
              activeTab === 'using' ? "Products Using PatternFly 6" :
              activeTab === 'not-using' ? "Products on Older Versions" :
              "All Products"
            }
          />
        </div>
      </CardBody>
    </Card>
  );
};

const PackageUsageCard: React.FunctionComponent = () => {
  const [showAll, setShowAll] = useState(false);
  const displayData = showAll ? packageUsage : packageUsage.slice(0, 10);

  return (
    <Card isFullHeight>
      <CardTitle>
        PatternFly Package Usage
        <div style={{ fontSize: '0.875rem', color: '#6a6e73', fontWeight: 'normal' }}>
          Usage across all {summaryStats.totalProjects} products
        </div>
      </CardTitle>
      <CardBody>
        <div style={{ height: '400px', overflowY: 'auto' }}>
          {displayData.map((pkg, index) => (
            <div key={index} style={{ 
              marginBottom: '12px', 
              padding: '8px', 
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              borderRadius: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                  {pkg.packageName}
                </div>
                              <div style={{ fontSize: '0.875rem' }}>
                <span style={{ color: '#06c', fontWeight: 'bold' }}>
                  {pkg.usageCount}
                </span>
                <span style={{ color: '#6a6e73' }}>
                  /{summaryStats.totalProjects} ({pkg.percentage}%)
                </span>
              </div>
            </div>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: '#ededed', 
              marginTop: '4px',
              borderRadius: '2px'
            }}>
              <div style={{ 
                width: `${pkg.percentage}%`, 
                height: '100%', 
                backgroundColor: '#06c',
                borderRadius: '2px'
              }} />
              </div>
              {pkg.versions.length > 0 && (
                <div style={{ marginTop: '4px', fontSize: '0.75rem', color: '#6a6e73' }}>
                  Versions: {pkg.versions.slice(0, 3).join(', ')}
                  {pkg.versions.length > 3 && ` +${pkg.versions.length - 3} more`}
                </div>
              )}
            </div>
          ))}
        </div>
        {packageUsage.length > 10 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button 
              variant="link" 
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Show Less' : `Show All ${packageUsage.length} Packages`}
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const KeyInsightsSection: React.FunctionComponent = () => {
  const stats = summaryStats;
  
  // Calculate insights from the data
  const v6Products = processedProducts.filter(product => 
    product.pfCoreVersion.startsWith('6') || product.pfPatternflyVersion.startsWith('6')
  );
  const v6Percentage = Math.round((v6Products.length / processedProducts.length) * 100);
  
  // Get most common versions
  const reactVersions = versionDistributions.react.slice(0, 2);
  const pfVersions = versionDistributions.reactCore.slice(0, 2);
  
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Title headingLevel="h2" style={{ marginBottom: '1rem' }}>Key Insights</Title>
      <Grid hasGutter>
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', height: '100%' }}>
            <Title headingLevel="h3" size="md" style={{ color: '#06c', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ChartLineIcon />
              Version Distribution
            </Title>
            <List isPlain>
              <ListItem>
                <strong>{stats.totalProjects}</strong> products across <strong>{stats.totalTeams}</strong> organizations are using PatternFly
              </ListItem>
              <ListItem>
                <strong>{reactVersions[0]?.version}</strong> is the most popular React version ({reactVersions[0]?.percentage}% of products)
              </ListItem>
              <ListItem>
                <strong>PatternFly {pfVersions[0]?.version}</strong> leads PatternFly adoption ({pfVersions[0]?.percentage}% of products)
              </ListItem>
            </List>
          </div>
        </GridItem>
        
        <GridItem xl={6} lg={6} md={12} sm={12}>
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', height: '100%' }}>
            <Title headingLevel="h3" size="md" style={{ color: '#8476d1', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpIcon />
              PatternFly 6 Migration
            </Title>
            <List isPlain>
              <ListItem>
                <strong>{v6Products.length}</strong> products ({v6Percentage}%) have migrated to PatternFly 6
              </ListItem>
              <ListItem>
                <strong>{processedProducts.length - v6Products.length}</strong> products still need to upgrade
              </ListItem>
              <ListItem>
                Top migrated organization: <strong>{stats.topTeamByProducts}</strong> with {stats.topTeamProductCount} products
              </ListItem>
            </List>
          </div>
        </GridItem>
      </Grid>
    </div>
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
              onClick={() => scrollToSection('summary-stats')}
              style={{ cursor: 'pointer' }}
            >
              Key Insights
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('version-distribution')}
              style={{ cursor: 'pointer' }}
            >
              Version Distribution
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('pf6-adoption')}
              style={{ cursor: 'pointer' }}
            >
              PatternFly 6 Adoption
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('package-usage')}
              style={{ cursor: 'pointer' }}
            >
              Package Usage
            </NavItem>
            <NavItem 
              onClick={() => scrollToSection('adoption-table')}
              style={{ cursor: 'pointer' }}
            >
              Product Details
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
      <Title headingLevel="h1" size="lg">PatternFly Adoption Analytics</Title>
    </PageSection>
    <PageSection>
      <PageNavigation />
    </PageSection>
    <PageSection id="summary-stats">
      <KeyInsightsSection />
    </PageSection>
    <PageSection id="version-distribution">
      <Title headingLevel="h2">Version Distribution</Title>
      <p>Distribution of PatternFly and React versions across all products:</p>
      <Grid hasGutter>
        <GridItem xl={4} lg={4} md={6} sm={12}>
          <PieChartCard 
            title="React Versions" 
            data={versionDistributions.react}
            subtitle={`${versionDistributions.react.length} different versions`}
          />
        </GridItem>
        <GridItem xl={4} lg={4} md={6} sm={12}>
          <PieChartCard 
            title="PatternFly React Core" 
            data={versionDistributions.reactCore}
            subtitle={`${versionDistributions.reactCore.length} different versions`}
          />
        </GridItem>
        <GridItem xl={4} lg={4} md={12} sm={12}>
          <PieChartCard 
            title="PatternFly Core" 
            data={versionDistributions.patternfly}
            subtitle={`${versionDistributions.patternfly.length} different versions`}
          />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection id="pf6-adoption">
      <Title headingLevel="h2">PatternFly 6 Migration Status</Title>
      <p>Track which products have successfully migrated to PatternFly 6 and identify migration opportunities:</p>
      <PatternFly6AdoptionCard />
    </PageSection>
    <PageSection id="package-usage">
      <Title headingLevel="h2">Package Usage Analysis</Title>
      <p>Detailed breakdown of PatternFly package adoption across all products:</p>
      <Grid hasGutter>
        <GridItem xl={12} lg={12} md={12} sm={12}>
          <PackageUsageCard />
        </GridItem>
      </Grid>
    </PageSection>
    <PageSection id="adoption-table">
      <Title headingLevel="h2">Product Adoption Details</Title>
      <p>Comprehensive table showing PatternFly adoption status for all products:</p>
      <SortableTable />
    </PageSection>
  </>
);

export { Product };