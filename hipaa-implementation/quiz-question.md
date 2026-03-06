# HIPAA Implementation Playbook - Quiz Questions

## Question 1: Team Responsibilities
**According to the presentation, what is the primary HIPAA responsibility of DevOps?**

A) Design clear consent flows and secure authentication UX  
B) Verify security controls work as intended through testing  
C) Configure encrypted storage, secure networks, and monitor for security incidents  
D) Conduct HIPAA training and enforce security policies  

**Answer: C** - DevOps manages infrastructure and deployments, including encrypted storage, secure networks, access controls, backup systems, and monitoring for security incidents. Option A is for Designers, B is for QA, and D is for HR.

---

## Question 2: Protected Health Information (PHI)
**Which of the following is considered PHI under HIPAA?**

A) Patient's first name only  
B) Birth year (e.g., 1985)  
C) Full date of birth (e.g., 1985-03-22)  
D) Age range (e.g., 40-45)  

**Answer: C** - Full date of birth is PHI. Birth year alone or age ranges may be acceptable under data minimization.

---

## Question 3: Access Control & Data Minimization
**According to the presentation, what should a nurse see when accessing a patient record?**

A) Full date of birth (DOB)  
B) Only birth year or calculated age  
C) Social Security Number  
D) Full medical history including all past visits  

**Answer: B** - The presentation emphasizes data minimization: nurses should see only birth year (e.g., 1980) or calculated age, not the full DOB.

---

## Question 4: Encryption Standards
**What encryption standard is recommended for protecting PHI at rest?**

A) AES-128  
B) AES-256  
C) DES  
D) MD5  

**Answer: B** - AES-256 is the industry standard for encrypting PHI at rest.

---

## Question 5: Audit Trails
**How long must audit logs be retained according to HIPAA requirements?**

A) 1 year  
B) 3 years  
C) 6 years minimum  
D) 10 years  

**Answer: C** - Audit logs must be stored for a minimum of 6 years (check state laws as some may require longer).

---

## Question 6: Business Associate Agreements (BAAs)
**What happens if you use a vendor that handles PHI without signing a BAA?**

A) Nothing, as long as no breach occurs  
B) It's a HIPAA violation even if no breach occurs  
C) Only the vendor is liable  
D) It's acceptable for cloud providers  

**Answer: B** - Using a vendor without a BAA when they handle PHI is itself a HIPAA violation, regardless of whether a breach occurs.

---

## Question 7: Logging Best Practices
**Which logging approach is HIPAA compliant?**

A) `logger.error('Failed to process patient John Doe, SSN: 123-45-6789')`  
B) `logger.error('Failed to process patient [REDACTED], ID: pat_002')`  
C) `logger.info('Patient John Doe logged in')`  
D) `console.log(patient.name + ' - ' + patient.ssn)`  

**Answer: B** - Logs should use patient IDs or debug tokens, not PHI like names or SSNs. Option B correctly redacts PHI.

---

## Question 8: Audit Trails
**What information must be included in audit logs when tracking PHI access?**

A) Only the user ID and timestamp  
B) Only the action performed and resource accessed  
C) Who (user ID), What (action), When (timestamp), and Where (resource/patient ID)  
D) Just the patient ID and date  

**Answer: C** - Audit logs must include: Who (user ID, name, role, IP), What (action performed), When (timestamp with timezone), and Where (resource accessed like patient ID). Logs must be immutable and stored for 6+ years.

---

## Question 9: Employee Training Requirements
**How often must employees complete HIPAA training?**

A) Once when hired  
B) Every 6 months  
C) Annually (every year)  
D) Every 2 years  

**Answer: C** - All employees must complete annual refresher HIPAA training, and new employees must complete it before accessing PHI.

---

## Question 10: Common HIPAA Mistakes
**Which of the following is a common HIPAA compliance mistake?**

A) Encrypting all PHI at rest with AES-256  
B) Logging PHI data like patient names and SSNs in application logs  
C) Using role-based access controls (RBAC)  
D) Conducting annual security assessments  

**Answer: B** - Logging PHI in plain text (names, SSNs, DOB) is a major HIPAA violation. Application logs, error messages, and debug output should use patient IDs or debug tokens instead of PHI. The presentation emphasizes using redacted logging or tokenization.
