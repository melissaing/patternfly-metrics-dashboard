import * as React from 'react';
import { useState } from 'react';

import '@patternfly/react-core/dist/styles/base.css';
import { 
  Button, 
  Card, 
  CardBody, 
  CardTitle, 
  DescriptionList, 
  DescriptionListDescription, 
  DescriptionListGroup, 
  DescriptionListTerm, 
  Grid, 
  GridItem, 
  InputGroup, 
  InputGroupItem, 
  Modal, 
  ModalVariant, 
  PageSection, 
  TextInput, 
  Title, 
  Label,
  Badge,

  Pagination
} from '@patternfly/react-core';
import { SearchIcon, InfoCircleIcon, UsersIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, ThProps, Thead, Tr } from '@patternfly/react-table';

import { 
  processedTeams,
  summaryStats,
  TeamSummary,
  PfDataProcessor
} from '../utils/pfDataProcessor';

// Real data from pf.json
const teamsData = processedTeams;

const Teams: React.FunctionComponent = () => {
  const [sortBy, setSortBy] = useState<{ index: number; direction: 'asc' | 'desc' }>({ index: 0, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamSummary | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  const columnNames = {
    teamName: 'Team/Organization',
    productsCount: 'Products',
    dominantPfReactVersion: 'Primary PF React',
    dominantReactVersion: 'Primary React',
    dominantPfCoreVersion: 'Primary PF Core'
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
      return teamsData;
    }
    
    const searchLower = searchTerm.toLowerCase();
    return teamsData.filter((team) =>
      team.teamName.toLowerCase().includes(searchLower) ||
      team.organization.toLowerCase().includes(searchLower) ||
      team.dominantPfCoreVersion.toLowerCase().includes(searchLower) ||
      team.dominantPfReactVersion.toLowerCase().includes(searchLower) ||
      team.dominantReactVersion.toLowerCase().includes(searchLower) ||
      team.products.some(product => product.toLowerCase().includes(searchLower)) ||
      team.technologies.some(tech => tech.toLowerCase().includes(searchLower))
    );
  }, [searchTerm]);

  const sortedData = React.useMemo(() => {
    const sortedArray = [...filteredData];
    const { index, direction } = sortBy;
    
    sortedArray.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (index) {
        case 0:
          aValue = a.teamName;
          bValue = b.teamName;
          break;
        case 1:
          aValue = a.productsCount;
          bValue = b.productsCount;
          break;
        case 2:
          aValue = a.dominantPfReactVersion;
          bValue = b.dominantPfReactVersion;
          break;
        case 3:
          aValue = a.dominantReactVersion;
          bValue = b.dominantReactVersion;
          break;
        case 4:
          aValue = a.dominantPfCoreVersion;
          bValue = b.dominantPfCoreVersion;
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

  const handleSearchChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRowClick = (team: TeamSummary) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
  };

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







  return (
    <>
      <PageSection>
        <Title headingLevel="h1" size="lg">
          <UsersIcon style={{ marginRight: '8px' }} />
          Teams Using PatternFly
        </Title>
      </PageSection>
      


      <PageSection>
        <Card>
          <CardBody>
            <div style={{ marginBottom: '1rem' }}>
              <InputGroup>
                <InputGroupItem>
                  <SearchIcon />
                </InputGroupItem>
                <InputGroupItem isFill>
                  <TextInput
                    placeholder="Search by team name, products, versions, or technologies..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search teams"
                  />
                </InputGroupItem>
              </InputGroup>
              {searchTerm && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6a6e73' }}>
                  Showing {filteredData.length} of {teamsData.length} teams
                </div>
              )}
            </div>
            
            <Table aria-label="Teams using PatternFly" isStriped>
              <Thead>
                <Tr>
                  <Th sort={getSortParams(0)} width={20}>{columnNames.teamName}</Th>
                  <Th sort={getSortParams(1)} width={15}>{columnNames.productsCount}</Th>
                  <Th sort={getSortParams(2)} width={25}>{columnNames.dominantPfReactVersion}</Th>
                  <Th sort={getSortParams(3)} width={25}>{columnNames.dominantReactVersion}</Th>
                  <Th sort={getSortParams(4)} width={25}>{columnNames.dominantPfCoreVersion}</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData.map((team) => (
                  <Tr 
                    key={team.id} 
                    isClickable
                    onRowClick={() => handleRowClick(team)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Td dataLabel={columnNames.teamName}>
                      <div>
                        <strong>{team.teamName}</strong>
                        <div style={{ fontSize: '0.875rem', color: '#6a6e73', marginTop: '2px' }}>
                          {team.products.slice(0, 3).join(', ')}
                          {team.products.length > 3 && '...'}
                        </div>
                      </div>
                    </Td>
                    <Td dataLabel={columnNames.productsCount}>
                      <Badge color="blue">
                        {team.productsCount}
                      </Badge>
                    </Td>
                    <Td dataLabel={columnNames.dominantPfReactVersion}>
                      <code style={{ fontSize: '0.875rem' }}>
                        {team.dominantPfReactVersion}
                      </code>
                    </Td>
                    <Td dataLabel={columnNames.dominantReactVersion}>
                      <code style={{ fontSize: '0.875rem' }}>
                        {team.dominantReactVersion}
                      </code>
                    </Td>
                    <Td dataLabel={columnNames.dominantPfCoreVersion}>
                      <code style={{ fontSize: '0.875rem' }}>
                        {team.dominantPfCoreVersion}
                      </code>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            
            <Pagination
              itemCount={filteredData.length}
              widgetId="teams-table-pagination"
              perPage={perPage}
              page={page}
              variant="bottom"
              onSetPage={onSetPage}
              onPerPageSelect={onPerPageSelect}
              style={{ marginTop: '1rem' }}
            />
          </CardBody>
        </Card>
      </PageSection>

      <Modal
        variant={ModalVariant.large}
        title={`${selectedTeam?.teamName || 'Team Details'}`}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      >
        {selectedTeam && (
          <div style={{ padding: '1rem' }}>

            
            <Grid hasGutter>
              <GridItem span={8}>
                <DescriptionList>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Organization</DescriptionListTerm>
                    <DescriptionListDescription>
                      <Label color="blue" variant="outline">
                        {selectedTeam.organization}
                      </Label>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>Products ({selectedTeam.productsCount})</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '120px', overflowY: 'auto' }}>
                        {selectedTeam.products.map((product, index) => (
                          <Badge key={index} color="teal">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>Technologies Used</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {selectedTeam.technologies.map((tech, index) => (
                          <Badge key={index} color="purple">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>PatternFly React Versions</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                        {selectedTeam.pfReactVersions.filter(v => v !== 'Not Used').map((version, index) => (
                          <Badge key={index} color="cyan">
                            {version}
                          </Badge>
                        ))}
                        {selectedTeam.pfReactVersions.filter(v => v !== 'Not Used').length === 0 && (
                          <span style={{ fontSize: '0.875rem', color: '#6a6e73', fontStyle: 'italic' }}>
                            No PatternFly React versions found
                          </span>
                        )}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>React Versions</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                        {selectedTeam.reactVersions.filter(v => v !== 'Not Used').map((version, index) => (
                          <Badge key={index} color="orange">
                            {version}
                          </Badge>
                        ))}
                        {selectedTeam.reactVersions.filter(v => v !== 'Not Used').length === 0 && (
                          <span style={{ fontSize: '0.875rem', color: '#6a6e73', fontStyle: 'italic' }}>
                            No React versions found
                          </span>
                        )}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>PatternFly Core Versions</DescriptionListTerm>
                    <DescriptionListDescription>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
                        {selectedTeam.pfCoreVersions.filter(v => v !== 'Not Used').map((version, index) => (
                          <Badge key={index} color="green">
                            {version}
                          </Badge>
                        ))}
                        {selectedTeam.pfCoreVersions.filter(v => v !== 'Not Used').length === 0 && (
                          <span style={{ fontSize: '0.875rem', color: '#6a6e73', fontStyle: 'italic' }}>
                            No PatternFly Core versions found
                          </span>
                        )}
                      </div>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </GridItem>
              
              <GridItem span={4}>
                <DescriptionList>

                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>Primary PF React Version</DescriptionListTerm>
                    <DescriptionListDescription>
                      <code style={{ fontSize: '0.875rem' }}>
                        {selectedTeam.dominantPfReactVersion}
                      </code>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>Primary React Version</DescriptionListTerm>
                    <DescriptionListDescription>
                      <code style={{ fontSize: '0.875rem' }}>
                        {selectedTeam.dominantReactVersion}
                      </code>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  
                  <DescriptionListGroup>
                    <DescriptionListTerm>Primary PF Core Version</DescriptionListTerm>
                    <DescriptionListDescription>
                      <code style={{ fontSize: '0.875rem' }}>
                        {selectedTeam.dominantPfCoreVersion}
                      </code>
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  

                </DescriptionList>
              </GridItem>
            </Grid>
            
            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <Button variant="primary" onClick={handleModalClose}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export { Teams }; 