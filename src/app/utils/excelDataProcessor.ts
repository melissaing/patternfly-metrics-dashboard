import * as XLSX from 'xlsx';

export interface ExcelTeamData {
  id: number;
  teamName: string;
  department: string;
  projectsCount: number;
  pfVersion: string;
  adoptionScore: number;
  lastActive: string;
  members: number;
  status: string;
  description: string;
  technologies: string[];
  recentProjects: string[];
}

export interface ExcelProductData {
  id: number;
  product: string;
  team: string;
  pfVersion: string;
  reactVersion: string;
  adoption: string;
  lastUpdate: string;
}

export class ExcelDataProcessor {
  public static async processExcelFile(filePath: string): Promise<{
    teams: ExcelTeamData[];
    products: ExcelProductData[];
  }> {
    try {
      // Read the Excel file
      const workbook = XLSX.readFile(filePath);
      
      // Get worksheet names
      const sheetNames = workbook.SheetNames;
      console.log('Available sheets:', sheetNames);
      
      // Process teams data (assuming there's a sheet with teams data)
      const teamsData: ExcelTeamData[] = [];
      const productsData: ExcelProductData[] = [];
      
      // Look for sheets that might contain team or product data
      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) continue;
        
        // Check if this looks like team data or product data based on headers
        const headers = jsonData[0] as string[];
        
        if (this.isTeamSheet(headers)) {
          const teamRows = jsonData.slice(1) as any[][];
          teamsData.push(...this.processTeamData(teamRows, headers));
        } else if (this.isProductSheet(headers)) {
          const productRows = jsonData.slice(1) as any[][];
          productsData.push(...this.processProductData(productRows, headers));
        }
      }
      
      return {
        teams: teamsData,
        products: productsData
      };
      
    } catch (error) {
      console.error('Error processing Excel file:', error);
      throw error;
    }
  }
  
  private static isTeamSheet(headers: string[]): boolean {
    // Check if headers suggest this is team data
    const teamHeaders = ['team', 'department', 'members', 'adoption', 'score'];
    return teamHeaders.some(header => 
      headers.some(h => h && h.toLowerCase().includes(header))
    );
  }
  
  private static isProductSheet(headers: string[]): boolean {
    // Check if headers suggest this is product data
    const productHeaders = ['product', 'application', 'patternfly', 'react', 'version'];
    return productHeaders.some(header => 
      headers.some(h => h && h.toLowerCase().includes(header))
    );
  }
  
  private static processTeamData(rows: any[][], headers: string[]): ExcelTeamData[] {
    const teams: ExcelTeamData[] = [];
    
    // Find column indices
    const getColumnIndex = (searchTerms: string[]) => {
      return headers.findIndex(header => 
        header && searchTerms.some(term => 
          header.toLowerCase().includes(term.toLowerCase())
        )
      );
    };
    
    const teamNameIndex = getColumnIndex(['team', 'name']);
    const departmentIndex = getColumnIndex(['department', 'org', 'division']);
    const membersIndex = getColumnIndex(['members', 'size', 'count']);
    const pfVersionIndex = getColumnIndex(['patternfly', 'pf', 'version']);
    const adoptionIndex = getColumnIndex(['adoption', 'score', 'percentage']);
    const statusIndex = getColumnIndex(['status', 'state']);
    const projectsIndex = getColumnIndex(['project', 'application']);
    const lastActiveIndex = getColumnIndex(['last', 'active', 'updated']);
    
    rows.forEach((row, index) => {
      if (row.length === 0 || !row[teamNameIndex]) return;
      
      const team: ExcelTeamData = {
        id: index + 1,
        teamName: row[teamNameIndex] || `Team ${index + 1}`,
        department: row[departmentIndex] || 'Unknown',
        projectsCount: this.parseNumber(row[projectsIndex]) || 0,
        pfVersion: row[pfVersionIndex] || '5.0.0',
        adoptionScore: this.parseNumber(row[adoptionIndex]) || 0,
        lastActive: this.formatDate(row[lastActiveIndex]) || new Date().toISOString().split('T')[0],
        members: this.parseNumber(row[membersIndex]) || 1,
        status: row[statusIndex] || 'Unknown',
        description: `${row[teamNameIndex]} team working on PatternFly adoption`,
        technologies: ['React', 'TypeScript', 'PatternFly'],
        recentProjects: [`${row[teamNameIndex]} Project`]
      };
      
      teams.push(team);
    });
    
    return teams;
  }
  
  private static processProductData(rows: any[][], headers: string[]): ExcelProductData[] {
    const products: ExcelProductData[] = [];
    
    // Find column indices
    const getColumnIndex = (searchTerms: string[]) => {
      return headers.findIndex(header => 
        header && searchTerms.some(term => 
          header.toLowerCase().includes(term.toLowerCase())
        )
      );
    };
    
    const productIndex = getColumnIndex(['product', 'application', 'app']);
    const teamIndex = getColumnIndex(['team', 'owner']);
    const pfVersionIndex = getColumnIndex(['patternfly', 'pf', 'version']);
    const reactVersionIndex = getColumnIndex(['react', 'version']);
    const adoptionIndex = getColumnIndex(['adoption', 'status', 'state']);
    const lastUpdateIndex = getColumnIndex(['last', 'update', 'modified']);
    
    rows.forEach((row, index) => {
      if (row.length === 0 || !row[productIndex]) return;
      
      const product: ExcelProductData = {
        id: index + 1,
        product: row[productIndex] || `Product ${index + 1}`,
        team: row[teamIndex] || 'Unknown Team',
        pfVersion: row[pfVersionIndex] || '5.0.0',
        reactVersion: row[reactVersionIndex] || '17.0.0',
        adoption: row[adoptionIndex] || 'Unknown',
        lastUpdate: this.formatDate(row[lastUpdateIndex]) || new Date().toISOString().split('T')[0]
      };
      
      products.push(product);
    });
    
    return products;
  }
  
  private static parseNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  
  private static formatDate(value: any): string {
    if (!value) return '';
    
    if (value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    
    if (typeof value === 'string') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    }
    
    if (typeof value === 'number') {
      // Excel serial date number
      const date = new Date((value - 25569) * 86400 * 1000);
      return date.toISOString().split('T')[0];
    }
    
    return '';
  }
} 