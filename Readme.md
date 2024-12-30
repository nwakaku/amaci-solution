# Project Proposal  
**A-MACI KeyKeeper**: Web Application and Browser Extension for Managing A-MACI Keypairs

## 1. Introduction
The **Anti-Collusion Machine for Information (A-MACI)** protocol is a groundbreaking cryptographic framework ensuring privacy, security, and collusion resistance in decentralized voting systems. While A-MACI provides a secure voting mechanism, there is currently no dedicated tool for managing EdDSA-based public and private keys required by users throughout the A-MACI lifecycle. This idea outlines the development of a web application and browser extension, **A-MACI KeyKeeper**, to empower users with a seamless, secure, and user-friendly way to manage their keypairs and sign MACI messages.

## 2. Objectives
The primary goals of this project are:
1. To provide a **secure platform** for generating, storing, and managing EdDSA keypairs used in A-MACI systems.
2. To simplify **keypair rotation** and synchronization with A-MACI backends.
3. To enable users to **sign and verify MACI messages** efficiently.
4. To integrate security best practices, ensuring **protection against unauthorized access** or malicious attacks.

## 3. Key Features
### 3.1 Web Application
- **Keypair Management**:
  - Generate new EdDSA keypairs with a simple interface.
  - View the status of keypairs (Active, Pending, Revoked).
  - Import/export keypairs.
- **Key Rotation**:
  - Discard old keypairs and generate replacements.
  - Automatically notify A-MACI backends of new public keys.
- **Message Signing**:
  - Allow users to sign MACI/A-MACI messages directly from the app.
  - Display signed messages in human-readable and raw formats.

- **User-Friendly Interface**:
  - Intuitive dashboard to manage keys and view their status.
  - Tooltip explanations for technical actions.

### 3.2 Browser Extension
- **Quick Access**:
  - Generate, view, and switch keypairs from the browser toolbar.
  - Sign MACI messages while navigating other applications.
- **Integration with A-MACI Systems**:
  - Automatically synchronize keypair changes with backends.
- **Secure Key Storage**:
  - Use the browser’s storage APIs (e.g., IndexedDB) with encryption.
- **Multi-Browser Support**:
  - Compatibility with major browsers like Chrome, Firefox, and Edge.

## 4. Technical Approach
### 4.1 Tech Stack
- **Frontend**: React.js, tailwindcss and NextUI for building an interactive user interface.
- **Cryptography**: Web Crypto API and libsodium for EdDSA key generation, signing, and verification.
- **Storage**: IndexedDB for secure local storage of keypairs with encryption.
- **Backend**:
  -  backend integration for advanced synchronization with A-MACI systems.
  - Use RESTful APIs to interact with A-MACI backends.

### 4.2 Security Measures
- Implement Content Security Policy (CSP) to block malicious scripts.
- Ensure private keys are never transmitted outside the browser.
- Zero-knowledge proof integration

### 4.3 Development
1. **Web Application**
   - Developed a standalone web app for managing keypairs and signing messages.
   - Test integration with A-MACI systems.
2. **Browser Extension**
   - Build a lightweight browser extension for quick key management.
   - Add integration for signing messages directly in the browser.
3. **Security and Optimization**
   - Conduct audits for security vulnerabilities.
   - Optimize performance for seamless user experience.

## 5. Expected Outcomes
- A web application that simplifies keypair management for A-MACI users.
- A browser extension providing quick and secure access to A-MACI functionality.
- Enhanced user trust in A-MACI systems through robust security and usability.

## 6. Conclusion
The A-MACI KeyKeeper project addresses a critical gap in the A-MACI ecosystem, providing users with a secure and user-friendly tool for keypair management and message signing. By enhancing usability and security, this tool will drive broader adoption of A-MACI systems, fostering trust in decentralized governance solutions.