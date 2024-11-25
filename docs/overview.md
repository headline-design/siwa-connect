# Sign-In with Algorand (SIWA) Integration Guide

This document provides an overview of the Sign-In with Algorand (SIWA) integration using the `SIWAConnect` component.

## Overview

The `SIWAConnect` component facilitates the SIWA flow, allowing users to authenticate using their Algorand wallets (currently supporting Pera Wallet and Defly Wallet). The component handles wallet connection, message signing, and signature verification.

## Key Features

1. Multi-wallet support (Pera Wallet and Defly Wallet)
2. Persistent sessions using local storage
3. Step-by-step SIWA flow with clear UI feedback
4. Detailed error handling and display
5. JSON viewing for credentials, messages, and verification results

## SIWA Flow

The SIWA flow consists of the following steps:

1. **Connect Wallet**: User connects their Algorand wallet (Pera or Defly).
2. **Sign Message**: User signs a SIWA message using their connected wallet.
3. **Verify Signature**: The signed message is verified (in this demo, on the client-side).
4. **Success**: Upon successful verification, the user is considered authenticated.

## Component Usage

To use the `SIWAConnect` component in your application:

1. Import the component:
   ```jsx
   import SIWAConnect from '@/components/SIWAConnect';
