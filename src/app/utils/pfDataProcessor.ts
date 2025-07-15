import pfData from '../data/pf.json';

// Raw data interface from pf.json
export interface PfProjectData {
  name: string;
  "@patternfly/patternfly": string;
  "@patternfly/quickstarts": string;
  "@patternfly/react-catalog-view-extension": string;
  "@patternfly/react-charts": string;
  "@patternfly/react-code-editor": string;
  "@patternfly/react-console": string;
  "@patternfly/react-core": string;
  "@patternfly/react-icons": string;
  "@patternfly/react-inline-edit-extension": string;
  "@patternfly/react-log-viewer": string;
  "@patternfly/react-data-view": string;
  "@patternfly/chatbot": string;
  "@patternfly/virtual-assistant": string;
  "@patternfly/react-component-groups": string;
  "@patternfly/react-styles": string;
  "@patternfly/react-table": string;
  "@patternfly/react-tokens": string;
  "@patternfly/react-topology": string;
  "@patternfly/react-user-feedback": string;
  "@patternfly/react-virtualized-extension": string;
  react: string;
}

// Processed data interfaces
export interface ProcessedProduct {
  id: string;
  name: string;
  organization: string;
  project: string;
  subproject?: string;
  pfCoreVersion: string;
  pfReactVersion: string;
  reactVersion: string;
  pfPatternflyVersion: string;
  adoptionScore: number;
  adoptionStatus: string;
  lastUpdate: string;
  packageCount: number;
  packages: { [key: string]: string };
}

export interface TeamSummary {
  id: string;
  teamName: string;
  organization: string;
  productsCount: number;
  products: string[];
  pfCoreVersions: string[];
  pfReactVersions: string[];
  reactVersions: string[];
  dominantPfCoreVersion: string;
  dominantPfReactVersion: string;
  dominantReactVersion: string;
  adoptionScore: number;
  adoptionStatus: string;
  lastUpdate: string;
  description: string;
  technologies: string[];
}

export interface VersionDistribution {
  version: string;
  count: number;
  percentage: number;
  color: string;
}

export interface PackageUsage {
  packageName: string;
  usageCount: number;
  percentage: number;
  versions: string[];
}

export class PfDataProcessor {
  private static rawData: PfProjectData[] = pfData as PfProjectData[];

  // Clean and normalize version strings
  private static normalizeVersion(version: string): string {
    if (!version || version.trim() === '') return 'Not Used';
    
    // Remove common prefixes and suffixes
    const cleaned = version
      .replace(/^[\^~>=<]+/, '')
      .replace(/-prerelease\.\d+$/, '')
      .replace(/-canary\.\d+$/, '')
      .replace(/-beta\.\d+$/, '')
      .replace(/-alpha\.\d+$/, '')
      .trim();
    
    if (cleaned === '') return 'Not Used';
    
    // Extract major.minor version for consistency
    const versionMatch = cleaned.match(/^(\d+)\.(\d+)(?:\.(\d+))?/);
    if (versionMatch) {
      const [, major, minor, patch] = versionMatch;
      return `${major}.${minor}${patch ? `.${patch}` : ''}`;
    }
    
    return cleaned;
  }

  // Parse project name into components
  private static parseProjectName(name: string): {
    organization: string;
    project: string;
    subproject?: string;
  } {
    const parts = name.split('-');
    if (parts.length < 2) {
      return {
        organization: 'Unknown',
        project: name
      };
    }
    
    const organization = parts[0];
    if (parts.length === 2) {
      return {
        organization,
        project: parts[1]
      };
    }
    
    const project = parts[1];
    const subproject = parts.slice(2).join('-');
    
    return {
      organization,
      project,
      subproject
    };
  }

  // Calculate adoption score based on package usage
  private static calculateAdoptionScore(packages: { [key: string]: string }): number {
    const packageKeys = Object.keys(packages);
    const usedPackages = packageKeys.filter(key => 
      packages[key] && packages[key].trim() !== '' && key !== 'react'
    ).length;
    
    const totalPfPackages = packageKeys.length - 1; // Exclude react
    return Math.round((usedPackages / totalPfPackages) * 100);
  }

  // Determine adoption status
  private static getAdoptionStatus(score: number): string {
    if (score >= 80) return 'Complete';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Medium';
    if (score >= 20) return 'Low';
    return 'Minimal';
  }

  // Process all projects
  static processAllProjects(): ProcessedProduct[] {
    return this.rawData.map((project, index) => {
      const { organization, project: projectName, subproject } = this.parseProjectName(project.name);
      
      const packages = {
        '@patternfly/patternfly': this.normalizeVersion(project['@patternfly/patternfly']),
        '@patternfly/react-core': this.normalizeVersion(project['@patternfly/react-core']),
        '@patternfly/react-table': this.normalizeVersion(project['@patternfly/react-table']),
        '@patternfly/react-charts': this.normalizeVersion(project['@patternfly/react-charts']),
        '@patternfly/react-icons': this.normalizeVersion(project['@patternfly/react-icons']),
        '@patternfly/react-styles': this.normalizeVersion(project['@patternfly/react-styles']),
        '@patternfly/react-tokens': this.normalizeVersion(project['@patternfly/react-tokens']),
        '@patternfly/react-topology': this.normalizeVersion(project['@patternfly/react-topology']),
        '@patternfly/react-code-editor': this.normalizeVersion(project['@patternfly/react-code-editor']),
        '@patternfly/react-log-viewer': this.normalizeVersion(project['@patternfly/react-log-viewer']),
        '@patternfly/quickstarts': this.normalizeVersion(project['@patternfly/quickstarts']),
        '@patternfly/react-component-groups': this.normalizeVersion(project['@patternfly/react-component-groups']),
        '@patternfly/react-user-feedback': this.normalizeVersion(project['@patternfly/react-user-feedback']),
        '@patternfly/chatbot': this.normalizeVersion(project['@patternfly/chatbot']),
        '@patternfly/virtual-assistant': this.normalizeVersion(project['@patternfly/virtual-assistant']),
        '@patternfly/react-data-view': this.normalizeVersion(project['@patternfly/react-data-view']),
        '@patternfly/react-console': this.normalizeVersion(project['@patternfly/react-console']),
        '@patternfly/react-catalog-view-extension': this.normalizeVersion(project['@patternfly/react-catalog-view-extension']),
        '@patternfly/react-inline-edit-extension': this.normalizeVersion(project['@patternfly/react-inline-edit-extension']),
        '@patternfly/react-virtualized-extension': this.normalizeVersion(project['@patternfly/react-virtualized-extension']),
      };

      const adoptionScore = this.calculateAdoptionScore(packages);
      
      return {
        id: `project-${index}`,
        name: project.name,
        organization,
        project: projectName,
        subproject,
        pfCoreVersion: packages['@patternfly/react-core'],
        pfReactVersion: packages['@patternfly/react-core'], // Using react-core as primary
        reactVersion: this.normalizeVersion(project.react),
        pfPatternflyVersion: packages['@patternfly/patternfly'],
        adoptionScore,
        adoptionStatus: this.getAdoptionStatus(adoptionScore),
        lastUpdate: new Date().toISOString().split('T')[0],
        packageCount: Object.values(packages).filter(v => v !== 'Not Used').length,
        packages
      };
    });
  }

  // Group projects by organization/team
  static processTeamData(): TeamSummary[] {
    const projects = this.processAllProjects();
    const teamMap = new Map<string, ProcessedProduct[]>();
    
    // Group by organization
    projects.forEach(project => {
      const key = project.organization;
      if (!teamMap.has(key)) {
        teamMap.set(key, []);
      }
      teamMap.get(key)!.push(project);
    });

    // Create team summaries
    const teams: TeamSummary[] = [];
    let teamIndex = 0;
    
    teamMap.forEach((teamProjects, orgName) => {
      // Collect all PatternFly React package versions used by this team
      const pfReactVersions: string[] = [];
      const pfCoreVersions: string[] = [];
      const reactVersions: string[] = [];
      
      teamProjects.forEach(project => {
        // Add React versions
        if (project.reactVersion !== 'Not Used' && !reactVersions.includes(project.reactVersion)) {
          reactVersions.push(project.reactVersion);
        }
        
        // Add PatternFly Core versions
        if (project.pfPatternflyVersion !== 'Not Used' && !pfCoreVersions.includes(project.pfPatternflyVersion)) {
          pfCoreVersions.push(project.pfPatternflyVersion);
        }
        
        // Add all PatternFly React package versions
        Object.entries(project.packages).forEach(([packageName, version]) => {
          if (packageName.includes('@patternfly/react-') && version !== 'Not Used' && !pfReactVersions.includes(version)) {
            pfReactVersions.push(version);
          }
        });
      });
      
      // Find dominant versions
      const dominantPfCore = this.findDominantVersion(pfCoreVersions);
      const dominantPfReact = this.findDominantVersion(pfReactVersions);
      const dominantReact = this.findDominantVersion(reactVersions);
      
      // Calculate team adoption score
      const avgAdoptionScore = teamProjects.reduce((sum, p) => sum + p.adoptionScore, 0) / teamProjects.length;
      
      teams.push({
        id: `team-${teamIndex++}`,
        teamName: orgName,
        organization: orgName,
        productsCount: teamProjects.length,
        products: teamProjects.map(p => p.name),
        pfCoreVersions: pfCoreVersions,
        pfReactVersions: pfReactVersions,
        reactVersions: reactVersions,
        dominantPfCoreVersion: dominantPfCore,
        dominantPfReactVersion: dominantPfReact,
        dominantReactVersion: dominantReact,
        adoptionScore: Math.round(avgAdoptionScore),
        adoptionStatus: this.getAdoptionStatus(Math.round(avgAdoptionScore)),
        lastUpdate: new Date().toISOString().split('T')[0],
        description: `${orgName} team responsible for ${teamProjects.length} product${teamProjects.length === 1 ? '' : 's'}: ${teamProjects.slice(0, 3).map(p => p.project).join(', ')}${teamProjects.length > 3 ? ` and ${teamProjects.length - 3} more` : ''}. Focus on PatternFly integration and user experience.`,
        technologies: this.extractTechnologies(teamProjects)
      });
    });

    return teams.sort((a, b) => b.productsCount - a.productsCount);
  }

  // Find the most common version in an array
  private static findDominantVersion(versions: string[]): string {
    if (versions.length === 0) return 'Not Used';
    
    const versionCounts = versions.reduce((acc, version) => {
      acc[version] = (acc[version] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(versionCounts)
      .sort(([, a], [, b]) => b - a)[0][0];
  }

  // Extract technologies based on project names and packages
  private static extractTechnologies(projects: ProcessedProduct[]): string[] {
    const technologies = new Set<string>();
    
    technologies.add('React');
    technologies.add('TypeScript');
    technologies.add('PatternFly');
    
    projects.forEach(project => {
      const name = project.name.toLowerCase();
      
      if (name.includes('openshift') || name.includes('kubernetes')) {
        technologies.add('Kubernetes');
      }
      if (name.includes('ansible')) {
        technologies.add('Ansible');
      }
      if (name.includes('cockpit')) {
        technologies.add('Linux');
      }
      if (name.includes('quay') || name.includes('container')) {
        technologies.add('Docker');
      }
      if (name.includes('console')) {
        technologies.add('Console');
      }
      if (name.includes('ui') || name.includes('frontend')) {
        technologies.add('Frontend');
      }
    });
    
    return Array.from(technologies);
  }

  // Get version distribution for charts grouped by major versions
  static getVersionDistribution(packageName: keyof PfProjectData): VersionDistribution[] {
    const versions = this.rawData.map(project => this.normalizeVersion(project[packageName]));
    
    // Group by major versions
    const majorVersionCounts = versions.reduce((acc, version) => {
      let majorVersion: string;
      
      if (version === 'Not Used') {
        majorVersion = 'Not Used';
      } else {
        // Extract major version (e.g., "18.3.1" -> "18", "5.4.2" -> "5")
        const versionMatch = version.match(/^(\d+)/);
        if (versionMatch) {
          majorVersion = versionMatch[1];
          // For React versions, add the word "React" prefix
          if (packageName === 'react') {
            majorVersion = `React ${majorVersion}`;
          }
          // For PatternFly versions, add "v" prefix
          else {
            majorVersion = `v${majorVersion}`;
          }
        } else {
          majorVersion = version;
        }
      }
      
      acc[majorVersion] = (acc[majorVersion] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const total = versions.length;
    // PatternFly chart colors - using hex values for reliability
    const colors = [
      '#06c', // PatternFly blue-300
      '#3e8635', // PatternFly green-300  
      '#f0ab00', // PatternFly gold-300
      '#8476d1', // PatternFly purple-300
      '#009596', // PatternFly cyan-300
      '#c9190b', // PatternFly red-300
      '#2b9af3', // PatternFly blue-200
      '#5ba352', // PatternFly green-200
      '#f4c145', // PatternFly gold-200
      '#a18fff'  // PatternFly purple-200
    ];
    
    return Object.entries(majorVersionCounts)
      .map(([version, count], index) => ({
        version,
        count,
        percentage: Math.round((count / total) * 100),
        color: colors[index % colors.length]
      }))
      .sort((a, b) => b.count - a.count);
  }

  // Get package usage statistics
  static getPackageUsage(): PackageUsage[] {
    const packageKeys = [
      '@patternfly/react-core',
      '@patternfly/react-table',
      '@patternfly/react-charts',
      '@patternfly/react-icons',
      '@patternfly/patternfly',
      '@patternfly/react-styles',
      '@patternfly/react-topology',
      '@patternfly/react-code-editor',
      '@patternfly/react-log-viewer',
      '@patternfly/quickstarts',
      '@patternfly/react-component-groups',
      '@patternfly/chatbot',
      '@patternfly/virtual-assistant',
      '@patternfly/react-data-view'
    ];

    const total = this.rawData.length;
    
    return packageKeys.map(packageName => {
      const usedProjects = this.rawData.filter(project => {
        const version = project[packageName as keyof PfProjectData];
        return version && version.trim() !== '';
      });
      
      const versions = usedProjects.map(project => 
        this.normalizeVersion(project[packageName as keyof PfProjectData])
      );
      
      return {
        packageName,
        usageCount: usedProjects.length,
        percentage: Math.round((usedProjects.length / total) * 100),
        versions: [...new Set(versions)].sort()
      };
    }).sort((a, b) => b.usageCount - a.usageCount);
  }

  // Get summary statistics
  static getSummaryStats() {
    const projects = this.processAllProjects();
    const teams = this.processTeamData();
    
    return {
      totalProjects: projects.length,
      totalTeams: teams.length,
      avgAdoptionScore: Math.round(projects.reduce((sum, p) => sum + p.adoptionScore, 0) / projects.length),
      highAdoptionProjects: projects.filter(p => p.adoptionScore >= 60).length,
      reactVersions: [...new Set(projects.map(p => p.reactVersion).filter(v => v !== 'Not Used'))].length,
      pfCoreVersions: [...new Set(projects.map(p => p.pfCoreVersion).filter(v => v !== 'Not Used'))].length,
      topTeamByProducts: teams[0]?.teamName || 'Unknown',
      topTeamProductCount: teams[0]?.productsCount || 0
    };
  }
}

// Export processed data
export const processedProducts = PfDataProcessor.processAllProjects();
export const processedTeams = PfDataProcessor.processTeamData();
export const versionDistributions = {
  reactCore: PfDataProcessor.getVersionDistribution('@patternfly/react-core'),
  patternfly: PfDataProcessor.getVersionDistribution('@patternfly/patternfly'),
  react: PfDataProcessor.getVersionDistribution('react')
};
export const packageUsage = PfDataProcessor.getPackageUsage();
export const summaryStats = PfDataProcessor.getSummaryStats(); 