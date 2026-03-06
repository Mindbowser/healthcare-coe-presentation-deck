/**
 * Interactive Demos Module
 * Handles access control, encryption, audit log demonstrations
 */

class DemoController {
  constructor() {
    this.currentRole = 'doctor';
    this.auditLog = [];
    this.cryptoKey = null;
    
    this.init();
  }
  
  init() {
    this.initAccessControlDemo();
    this.initEncryptionDemo();
    this.initAuditLogDisplay();
  }
  
  // ===== Access Control Demo =====
  initAccessControlDemo() {
    // Role buttons
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentRole = btn.dataset.role;
        
        const roleDisplay = document.getElementById('currentRole');
        if (roleDisplay) {
          roleDisplay.textContent = `Current: ${this.capitalizeFirst(this.currentRole)}`;
        }
        
        this.logAudit('ROLE_SWITCH', this.currentRole, 'User switched role');
      });
    });
    
    // Action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        this.performAction(action);
      });
    });
  }
  
  performAction(action) {
    const resultDiv = document.getElementById('accessResult');
    if (!resultDiv) return;
    
    const resultContent = resultDiv.querySelector('.result-content');
    if (!resultContent) return;
    
    const permissions = this.getPermissions(this.currentRole);
    const allowed = permissions.includes(action);
    
    let message = '';
    let className = '';
    
    if (allowed) {
      className = 'result-success';
      message = this.getSuccessMessage(action, this.currentRole);
      this.logAudit(action, this.currentRole, 'Action permitted');
    } else {
      className = 'result-denied';
      message = `❌ <strong>ACCESS DENIED</strong><br>Role "${this.capitalizeFirst(this.currentRole)}" does not have permission to perform "${this.formatAction(action)}".`;
      this.logAudit(action + '_DENIED', this.currentRole, 'Access denied');
    }
    
    resultContent.innerHTML = message;
    resultContent.className = 'result-content ' + className;
    
    // Animate result
    resultDiv.style.animation = 'none';
    setTimeout(() => {
      resultDiv.style.animation = 'slideIn 0.3s ease';
    }, 10);
  }
  
  getPermissions(role) {
    const permissionMap = {
      'patient': ['viewRecord'],
      'nurse': ['viewRecord', 'editRecord'],
      'doctor': ['viewRecord', 'editRecord', 'prescribe'],
      'admin': ['viewAudit', 'deleteRecord']
    };
    return permissionMap[role] || [];
  }
  
  getSuccessMessage(action, role) {
    // Data minimization: Different roles see different levels of PHI
    let viewRecordMessage = '';
    
    if (action === 'viewRecord') {
      if (role === 'nurse') {
        // Nurse sees limited data - only birth year, not full DOB (data minimization)
        viewRecordMessage = `✅ <strong>Access Granted</strong><br>Viewing patient record...<br><br><div style="background: var(--brand-lighter); padding: 16px; border-radius: 8px; margin-top: 12px;"><strong>Patient: John Doe</strong><br>Birth Year: 1980 <span style="color: var(--brand-primary); font-size: 12px;">(Age: 45)</span><br>MRN: 123456<br>Diagnosis: Hypertension<br>Last Visit: 2025-11-01<br><br><em>Accessed by: ${role}</em><br><span style="font-size: 12px; color: var(--text-secondary);">💡 Data Minimization: Only birth year shown (not full DOB)</span></div>`;
      } else if (role === 'doctor') {
        // Doctor sees full information
        viewRecordMessage = `✅ <strong>Access Granted</strong><br>Viewing patient record...<br><br><div style="background: var(--brand-lighter); padding: 16px; border-radius: 8px; margin-top: 12px;"><strong>Patient: John Doe</strong><br>DOB: 1980-05-15 <span style="color: var(--brand-primary); font-size: 12px;">(Age: 45)</span><br>MRN: 123456<br>Diagnosis: Hypertension<br>Medications: Lisinopril 10mg<br>Allergies: Penicillin<br>Last Visit: 2025-11-01<br><br><em>Accessed by: ${role}</em><br><span style="font-size: 12px; color: var(--text-secondary);">✓ Full access to all patient information</span></div>`;
      } else {
        // Patient sees their own full record
        viewRecordMessage = `✅ <strong>Access Granted</strong><br>Viewing your record...<br><br><div style="background: var(--brand-lighter); padding: 16px; border-radius: 8px; margin-top: 12px;"><strong>Patient: John Doe</strong><br>DOB: 1980-05-15<br>MRN: 123456<br>Diagnosis: Hypertension<br>Last Visit: 2025-11-01<br><br><em>Accessed by: ${role}</em></div>`;
      }
    }
    
    const messages = {
      'viewRecord': viewRecordMessage,
      'editRecord': `✅ <strong>Access Granted</strong><br>Opening record for editing...<br><br>You can now update patient vitals, add clinical notes, and modify treatment plans.<br><br><em>All changes will be logged in the audit trail.</em>`,
      'prescribe': `✅ <strong>Access Granted</strong><br>Opening prescription form...<br><br>You can now prescribe medications. The system will check for drug interactions and allergies before finalizing.<br><br><em>E-prescription will be sent to patient's pharmacy.</em>`,
      'viewAudit': `✅ <strong>Access Granted</strong><br>Loading audit logs...<br><br>Displaying all access logs, failed login attempts, and data modifications. Use filters to narrow down results.<br><br><em>Audit logs are immutable and stored for 7 years.</em>`,
      'deleteRecord': `✅ <strong>Access Granted</strong><br>Record deletion requires additional confirmation...<br><br>⚠️ This action is irreversible and will be logged. You must provide a reason for deletion.<br><br><em>Legal review required for deletion of PHI.</em>`
    };
    return messages[action] || `✅ Action "${action}" completed successfully.`;
  }
  
  formatAction(action) {
    const formatted = action.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
  
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // ===== Encryption Demo =====
  initEncryptionDemo() {
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const plainTextInput = document.getElementById('plainText');
    const cipherTextDisplay = document.getElementById('cipherText');
    
    if (encryptBtn) {
      encryptBtn.addEventListener('click', async () => {
        const plainText = plainTextInput?.value || 'Patient has Type 2 Diabetes';
        try {
          const result = await this.encryptText(plainText);
          if (cipherTextDisplay) {
            cipherTextDisplay.innerHTML = `
              <strong>Encrypted Data:</strong><br>
              <div style="background: var(--brand-lighter); padding: 12px; border-radius: 6px; margin-top: 8px; word-break: break-all; font-family: monospace; font-size: 12px;">
                ${result.ciphertext}
              </div>
              <div style="margin-top: 8px; font-size: 13px; color: var(--text-secondary);">
                Algorithm: AES-256-GCM<br>
                IV: ${result.iv}<br>
                Key: [Stored securely in Key Management Service]
              </div>
            `;
          }
          this.logAudit('DATA_ENCRYPTED', 'demo', 'Data encrypted successfully');
        } catch (e) {
          console.error('Encryption failed:', e);
          if (cipherTextDisplay) {
            cipherTextDisplay.innerHTML = '<span style="color: var(--danger);">Encryption failed. See console.</span>';
          }
        }
      });
    }
    
    if (decryptBtn) {
      decryptBtn.addEventListener('click', async () => {
        try {
          const result = await this.decryptText();
          if (cipherTextDisplay) {
            cipherTextDisplay.innerHTML = `
              <strong>Decrypted Data:</strong><br>
              <div style="background: var(--success); color: white; padding: 12px; border-radius: 6px; margin-top: 8px;">
                ${result}
              </div>
            `;
          }
          this.logAudit('DATA_DECRYPTED', 'demo', 'Data decrypted for authorized access');
        } catch (e) {
          console.error('Decryption failed:', e);
          if (cipherTextDisplay) {
            cipherTextDisplay.innerHTML = '<span style="color: var(--danger);">No encrypted data to decrypt.</span>';
          }
        }
      });
    }
  }
  
  async encryptText(plaintext) {
    // Generate key if not exists
    if (!this.cryptoKey) {
      this.cryptoKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
    }
    
    // Generate random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt
    const encoder = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.cryptoKey,
      encoder.encode(plaintext)
    );
    
    // Store for decryption demo
    this.lastEncrypted = {
      ciphertext: encrypted,
      iv: iv,
      plaintext: plaintext
    };
    
    // Convert to base64 for display
    const ciphertextArray = new Uint8Array(encrypted);
    const ciphertextBase64 = btoa(String.fromCharCode(...ciphertextArray));
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    
    return {
      ciphertext: ciphertextBase64,
      iv: ivHex
    };
  }
  
  async decryptText() {
    if (!this.lastEncrypted) {
      throw new Error('No encrypted data available');
    }
    
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: this.lastEncrypted.iv },
      this.cryptoKey,
      this.lastEncrypted.ciphertext
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }
  
  // ===== Audit Log =====
  logAudit(action, user, description) {
    const timestamp = new Date().toISOString();
    const entry = {
      timestamp,
      action,
      user,
      description,
      ipAddress: '192.168.1.100', // Simulated
      sessionId: 'sess_' + Math.random().toString(36).substr(2, 9)
    };
    
    this.auditLog.unshift(entry);
    
    // Keep only last 50 entries
    if (this.auditLog.length > 50) {
      this.auditLog = this.auditLog.slice(0, 50);
    }
    
    this.updateAuditDisplay();
  }
  
  initAuditLogDisplay() {
    // Initialize with some sample entries
    this.logAudit('SESSION_START', 'presenter', 'Presentation started');
    this.logAudit('SLIDE_VIEW', 'presenter', 'Viewing introduction');
  }
  
  updateAuditDisplay() {
    const auditContainer = document.querySelector('.audit-entries');
    if (!auditContainer) return;
    
    const html = this.auditLog.slice(0, 10).map(entry => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `<div class="audit-entry">[${time}] ${entry.user} | ${entry.action} | ${entry.description}</div>`;
    }).join('');
    
    auditContainer.innerHTML = html || '<div style="color: var(--text-muted);">No audit entries yet</div>';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.demoController = new DemoController();
});

// Listen for slide changes to trigger relevant demos
window.addEventListener('slideChange', (event) => {
  const slideTitle = event.detail.title;
  
  if (window.demoController) {
    window.demoController.logAudit('SLIDE_VIEW', 'presenter', `Viewing: ${slideTitle}`);
  }
});

