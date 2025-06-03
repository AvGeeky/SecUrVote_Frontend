

# SecurVote – Secure Digital Voting Platform: 
## FRONT END ONLY! BACKEND IS PRIVATE. VIEW DEMO TO LEARN ABOUT FRONT+BACKEND
## ENCENDER 2.0 1st Prize @ CSE-SSN
## https://youtu.be/4nAzh8N8cbA - DEMO
## https://securvote.vercel.app - WEBSITE. 
Press Login and follow on screen instructions for a tour of the software on Demo Mode!
##About
SecurVote is a secure, cryptographically verifiable digital voting system designed to ensure privacy, authenticity, and tamper-proof election processes. By leveraging advanced cryptographic techniques and blockchain-backed storage, SecurVote offers a trustworthy and transparent voting experience.

## Overview

SecurVote addresses common concerns in digital elections—such as vote tampering, impersonation, and unauthorized access—through a combination of encryption, digital signatures, HMAC verification, and multi-factor authentication.

## Features

### RSA-Encrypted Voting

- Implements a two-stage RSA encryption process:
  - First, the vote is encrypted using a dedicated vote keypair.
  - Then, it is signed with the user’s personal keypair to ensure authenticity.
- Each vote is stored as part of a VoteBlock, which includes:
  - A magic identifier (`magic-id`)
  - An HMAC-hashed Secret ID (`SC-'n'`)
- User sessions are managed using JSON Web Tokens (JWTs) that include authentication levels.
  - JWTs are encrypted with an admin keypair to prevent forgery or unauthorized modifications.

### Immutable Blockchain Ledger

- VoteBlocks are stored in an immutable, append-only blockchain-like ledger using MongoDB.
- Each block contains the hash of the previous block to preserve chain integrity.
- Any tampering invalidates the entire chain, making manipulation detectable.
- The current validity of the ledger can be verified in real-time via the system’s "Verify" page.

### Secure Vote Counting

- The `magic-id` is used to retrieve the original Secret ID from the database.
- This is compared against the decrypted HMAC-hashed Secret ID to verify vote uniqueness.
- Vote signatures are verified using user keypairs.
- Personally identifiable information is removed before decryption.
- Votes are then decrypted using the vote keypair to compute the final tally.

### Multi-Factor Authentication

- Users authenticate using:
  - Email-based One-Time Password (OTP)
  - Username-password login, where passwords are hashed using PBKDF2
- A vote keypair is generated at the time of election creation.
  - This keypair is encrypted using a passphrase provided by the administrator.
  - The passphrase is required to decrypt the vote results, preventing unauthorized access even in the case of server compromise.

## Technical Highlights

- Two-stage RSA encryption for vote confidentiality and authenticity
- HMAC-based Secret ID system for enforcing vote uniqueness
- MongoDB-backed blockchain structure for immutable and verifiable vote storage
- Supabase used for secure storage of vote decryption keypairs
- JWT-based session control with encrypted claims
- Multi-factor authentication combining email OTP and strong password hashing

## Mission Statement

To advance the integrity of democratic processes through a highly secure, transparent, and user-friendly digital voting platform based on cryptographic best practices.

