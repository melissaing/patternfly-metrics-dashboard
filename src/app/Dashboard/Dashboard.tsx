import * as React from 'react';
import { PageSection, Title, FileUpload, DropEvent } from '@patternfly/react-core';
import '@patternfly/react-core/dist/styles/base.css';
import { ChartPie } from '@patternfly/react-charts/victory';
import Papa from 'papaparse'
import { useState } from 'react';

// Papa.parse(csv, {
// 	complete: function(results) {
// 		console.log("Finished:", results.data);
// 	}
// });

const Dashboard: React.FunctionComponent = () => (
  <PageSection>
    <Title headingLevel="h1" size="lg">Google Analytics</Title>
    <BasicWithRightAlignedLegend></BasicWithRightAlignedLegend>
    <SimpleTextFileUpload></SimpleTextFileUpload>
  </PageSection>
)

const BasicWithRightAlignedLegend: React.FunctionComponent = () => (
  <div style={{ height: '230px', width: '350px' }}>
    <ChartPie
      ariaDesc="Average number of pets"
      ariaTitle="Pie chart example"
      constrainToVisibleArea
      data={[{ x: 'Cats', y: 35 }, { x: 'Dogs', y: 55 }, { x: 'Birds', y: 10 }]}
      height={230}
      labels={({ datum }) => `${datum.x}: ${datum.y}`}
      legendData={[{ name: 'Cats: 35' }, { name: 'Dogs: 55' }, { name: 'Birds: 10' }]}
      legendOrientation="vertical"
      legendPosition="right"
      name="chart1"
      padding={{
        bottom: 20,
        left: 20,
        right: 140, // Adjusted to accommodate legend
        top: 20
      }}
      width={350}
    />
  </div>
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

export { Dashboard };
