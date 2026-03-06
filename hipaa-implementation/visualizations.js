/**
 * Data Visualization Module
 * Creates charts and diagrams for HIPAA presentation
 */

class VisualizationController {
  constructor() {
    this.init();
  }
  
  init() {
    // Listen for slide changes to render visualizations
    window.addEventListener('slideChange', (event) => {
      this.renderVisualizationsForSlide(event.detail.slide);
    });
    
    // Render for initial slide
    setTimeout(() => {
      const firstSlide = document.querySelector('.slide.active');
      if (firstSlide) {
        this.renderVisualizationsForSlide(firstSlide);
      }
    }, 100);
  }
  
  renderVisualizationsForSlide(slide) {
    if (!slide) return;
    
    // RBAC Diagram
    const rbacDiagram = slide.querySelector('#rbacDiagram');
    if (rbacDiagram && !rbacDiagram.dataset.rendered) {
      this.renderRBACDiagram(rbacDiagram);
      rbacDiagram.dataset.rendered = 'true';
    }
    
    // Encryption Flow
    const encryptionFlow = slide.querySelector('#encryptionFlow');
    if (encryptionFlow && !encryptionFlow.dataset.rendered) {
      this.renderEncryptionFlow(encryptionFlow);
      encryptionFlow.dataset.rendered = 'true';
    }
    
    // Breach Statistics
    const breachChart = slide.querySelector('#breachChart');
    if (breachChart && !breachChart.dataset.rendered) {
      this.renderBreachChart(breachChart);
      breachChart.dataset.rendered = 'true';
    }
    
    // Compliance Timeline
    const complianceTimeline = slide.querySelector('#complianceTimeline');
    if (complianceTimeline && !complianceTimeline.dataset.rendered) {
      this.renderComplianceTimeline(complianceTimeline);
      complianceTimeline.dataset.rendered = 'true';
    }
  }
  
  // ===== RBAC Diagram =====
  renderRBACDiagram(container) {
    const svg = `
      <svg width="100%" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#38b8b3;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#2d9691;stop-opacity:1" />
          </linearGradient>
        </defs>
        
        <!-- Central Resource -->
        <rect x="340" y="150" width="120" height="100" rx="10" fill="url(#grad1)" />
        <text x="400" y="190" text-anchor="middle" fill="white" font-weight="bold" font-size="16">Patient</text>
        <text x="400" y="210" text-anchor="middle" fill="white" font-size="14">Health</text>
        <text x="400" y="230" text-anchor="middle" fill="white" font-size="14">Records</text>
        
        <!-- Patient Role -->
        <circle cx="100" cy="80" r="40" fill="#e6f7f6" stroke="#38b8b3" stroke-width="3"/>
        <text x="100" y="75" text-anchor="middle" font-weight="bold" font-size="14" fill="#2d9691">Patient</text>
        <text x="100" y="92" text-anchor="middle" font-size="11" fill="#6c757d">View Own</text>
        
        <path d="M 130 95 L 340 170" stroke="#38b8b3" stroke-width="2" fill="none" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
        <text x="220" y="125" fill="#6c757d" font-size="12">Read Only</text>
        
        <!-- Nurse Role -->
        <circle cx="100" cy="200" r="40" fill="#e6f7f6" stroke="#38b8b3" stroke-width="3"/>
        <text x="100" y="195" text-anchor="middle" font-weight="bold" font-size="14" fill="#2d9691">Nurse</text>
        <text x="100" y="212" text-anchor="middle" font-size="11" fill="#6c757d">Assigned</text>
        
        <path d="M 140 200 L 340 200" stroke="#38b8b3" stroke-width="3" fill="none" marker-end="url(#arrowhead)"/>
        <text x="220" y="190" fill="#6c757d" font-size="12">Read + Update</text>
        
        <!-- Doctor Role -->
        <circle cx="100" cy="320" r="40" fill="#e6f7f6" stroke="#38b8b3" stroke-width="3"/>
        <text x="100" y="315" text-anchor="middle" font-weight="bold" font-size="14" fill="#2d9691">Doctor</text>
        <text x="100" y="332" text-anchor="middle" font-size="11" fill="#6c757d">Full Access</text>
        
        <path d="M 135 305 L 340 230" stroke="#38b8b3" stroke-width="3" fill="none" marker-end="url(#arrowhead)"/>
        <text x="220" y="270" fill="#6c757d" font-size="12">Full CRUD</text>
        
        <!-- Admin Role -->
        <circle cx="700" cy="200" r="40" fill="#e6f7f6" stroke="#38b8b3" stroke-width="3"/>
        <text x="700" y="195" text-anchor="middle" font-weight="bold" font-size="14" fill="#2d9691">Admin</text>
        <text x="700" y="212" text-anchor="middle" font-size="11" fill="#6c757d">System</text>
        
        <path d="M 660 200 L 460 200" stroke="#38b8b3" stroke-width="2" fill="none" stroke-dasharray="5,5" marker-end="url(#arrowhead)"/>
        <text x="560" y="190" fill="#6c757d" font-size="12">Audit Only</text>
        
        <!-- Arrow marker -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#38b8b3" />
          </marker>
        </defs>
        
        <!-- Legend -->
        <rect x="600" y="320" width="180" height="60" rx="5" fill="#f8f9fa" stroke="#dee2e6"/>
        <text x="610" y="340" font-size="12" fill="#212529" font-weight="bold">Access Levels:</text>
        <line x1="610" y1="350" x2="640" y2="350" stroke="#38b8b3" stroke-width="3"/>
        <text x="645" y="355" font-size="11" fill="#6c757d">Full Access</text>
        <line x1="610" y1="365" x2="640" y2="365" stroke="#38b8b3" stroke-width="2" stroke-dasharray="5,5"/>
        <text x="645" y="370" font-size="11" fill="#6c757d">Limited Access</text>
      </svg>
    `;
    
    container.innerHTML = svg;
  }
  
  // ===== Encryption Flow Diagram =====
  renderEncryptionFlow(container) {
    const svg = `
      <svg width="100%" height="300" viewBox="0 0 900 300" xmlns="http://www.w3.org/2000/svg">
        <!-- Plaintext -->
        <rect x="50" y="100" width="150" height="100" rx="8" fill="#e6f7f6" stroke="#38b8b3" stroke-width="2"/>
        <text x="125" y="130" text-anchor="middle" font-weight="bold" fill="#2d9691">Plaintext PHI</text>
        <text x="125" y="155" text-anchor="middle" font-size="12" fill="#6c757d">Name: John Doe</text>
        <text x="125" y="175" text-anchor="middle" font-size="12" fill="#6c757d">DOB: 1980-05-15</text>
        
        <!-- Encryption Process -->
        <path d="M 200 150 L 280 150" stroke="#38b8b3" stroke-width="3" marker-end="url(#arrow2)"/>
        <text x="240" y="140" text-anchor="middle" font-size="12" fill="#212529">Encrypt</text>
        
        <rect x="280" y="100" width="140" height="100" rx="8" fill="#38b8b3"/>
        <text x="350" y="135" text-anchor="middle" font-weight="bold" fill="white">AES-256-GCM</text>
        <text x="350" y="160" text-anchor="middle" font-size="11" fill="white">+ Encryption Key</text>
        <text x="350" y="180" text-anchor="middle" font-size="11" fill="white">+ Random IV</text>
        
        <!-- Ciphertext -->
        <path d="M 420 150 L 500 150" stroke="#38b8b3" stroke-width="3" marker-end="url(#arrow2)"/>
        
        <rect x="500" y="100" width="150" height="100" rx="8" fill="#f8f9fa" stroke="#38b8b3" stroke-width="2"/>
        <text x="575" y="130" text-anchor="middle" font-weight="bold" fill="#2d9691">Ciphertext</text>
        <text x="575" y="155" text-anchor="middle" font-size="10" fill="#6c757d" font-family="monospace">A3f9K2m...</text>
        <text x="575" y="175" text-anchor="middle" font-size="10" fill="#6c757d" font-family="monospace">9xB4cP1...</text>
        
        <!-- Storage -->
        <path d="M 575 200 L 575 240" stroke="#38b8b3" stroke-width="3" marker-end="url(#arrow2)"/>
        <text x="595" y="225" font-size="12" fill="#212529">Store</text>
        
        <ellipse cx="575" cy="270" rx="80" ry="25" fill="#e6f7f6" stroke="#38b8b3" stroke-width="2"/>
        <text x="575" y="275" text-anchor="middle" font-weight="bold" fill="#2d9691">Database</text>
        
        <!-- Decryption Path -->
        <path d="M 500 150 Q 450 50, 350 50 Q 250 50, 200 150" stroke="#dc3545" stroke-width="2" fill="none" stroke-dasharray="5,5" marker-end="url(#arrow3)"/>
        <text x="350" y="35" text-anchor="middle" font-size="12" fill="#dc3545">Decrypt (Authorized)</text>
        
        <!-- Key Storage -->
        <rect x="700" y="120" width="150" height="60" rx="8" fill="#ffc107" stroke="#212529" stroke-width="2"/>
        <text x="775" y="145" text-anchor="middle" font-weight="bold" fill="#212529">🔑 Key Vault</text>
        <text x="775" y="165" text-anchor="middle" font-size="11" fill="#212529">Encryption Keys</text>
        
        <path d="M 700 150 L 420 150" stroke="#ffc107" stroke-width="2" stroke-dasharray="3,3"/>
        
        <!-- Arrows -->
        <defs>
          <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#38b8b3" />
          </marker>
          <marker id="arrow3" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#dc3545" />
          </marker>
        </defs>
      </svg>
    `;
    
    container.innerHTML = svg;
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }
  
  // ===== Breach Statistics Chart =====
  renderBreachChart(container) {
    const data = [
      { year: '2019', breaches: 510, records: 41000000 },
      { year: '2020', breaches: 663, records: 29000000 },
      { year: '2021', breaches: 714, records: 45000000 },
      { year: '2022', breaches: 707, records: 52000000 },
      { year: '2023', breaches: 741, records: 133000000 }
    ];
    
    const maxBreaches = Math.max(...data.map(d => d.breaches));
    const scale = 200 / maxBreaches;
    
    const svg = `
      <svg width="100%" height="350" viewBox="0 0 800 350" xmlns="http://www.w3.org/2000/svg">
        <text x="400" y="30" text-anchor="middle" font-size="18" font-weight="bold" fill="#212529">
          Healthcare Data Breaches (2019-2023)
        </text>
        
        <!-- Bars -->
        ${data.map((d, i) => {
          const x = 100 + i * 140;
          const barHeight = d.breaches * scale;
          const y = 280 - barHeight;
          return `
            <rect x="${x}" y="${y}" width="80" height="${barHeight}" fill="#38b8b3" rx="4"/>
            <text x="${x + 40}" y="${y - 10}" text-anchor="middle" font-size="16" font-weight="bold" fill="#38b8b3">
              ${d.breaches}
            </text>
            <text x="${x + 40}" y="310" text-anchor="middle" font-size="14" fill="#212529">
              ${d.year}
            </text>
          `;
        }).join('')}
        
        <!-- Y-axis -->
        <line x1="80" y1="80" x2="80" y2="290" stroke="#dee2e6" stroke-width="2"/>
        <text x="70" y="85" text-anchor="end" font-size="12" fill="#6c757d">800</text>
        <text x="70" y="185" text-anchor="end" font-size="12" fill="#6c757d">400</text>
        <text x="70" y="285" text-anchor="end" font-size="12" fill="#6c757d">0</text>
        
        <!-- X-axis -->
        <line x1="80" y1="290" x2="780" y2="290" stroke="#dee2e6" stroke-width="2"/>
        
        <!-- Label -->
        <text x="40" y="180" text-anchor="middle" font-size="12" fill="#6c757d" transform="rotate(-90, 40, 180)">
          Number of Breaches
        </text>
      </svg>
    `;
    
    container.innerHTML = svg;
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }
  
  // ===== Compliance Timeline =====
  renderComplianceTimeline(container) {
    const milestones = [
      { year: '1996', title: 'HIPAA Enacted', desc: 'Original legislation passed' },
      { year: '2003', title: 'Privacy Rule', desc: 'Privacy regulations effective' },
      { year: '2005', title: 'Security Rule', desc: 'Security standards required' },
      { year: '2009', title: 'HITECH Act', desc: 'Breach notification required' },
      { year: '2013', title: 'Omnibus Rule', desc: 'Business associates covered' }
    ];
    
    const svg = `
      <svg width="100%" height="200" viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Timeline line -->
        <line x1="50" y1="100" x2="850" y2="100" stroke="#38b8b3" stroke-width="4"/>
        
        ${milestones.map((m, i) => {
          const x = 50 + (i * 200);
          const y = i % 2 === 0 ? 50 : 150;
          const lineY = i % 2 === 0 ? 80 : 120;
          return `
            <circle cx="${x}" cy="100" r="12" fill="#38b8b3"/>
            <circle cx="${x}" cy="100" r="6" fill="white"/>
            <line x1="${x}" y1="100" x2="${x}" y2="${lineY}" stroke="#38b8b3" stroke-width="2"/>
            <text x="${x}" y="${y}" text-anchor="middle" font-weight="bold" font-size="14" fill="#38b8b3">
              ${m.year}
            </text>
            <text x="${x}" y="${y + 18}" text-anchor="middle" font-size="12" fill="#212529">
              ${m.title}
            </text>
            <text x="${x}" y="${y + 33}" text-anchor="middle" font-size="10" fill="#6c757d">
              ${m.desc}
            </text>
          `;
        }).join('')}
      </svg>
    `;
    
    container.innerHTML = svg;
    container.style.background = 'white';
    container.style.padding = '20px';
    container.style.borderRadius = '12px';
    container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.visualizationController = new VisualizationController();
});

