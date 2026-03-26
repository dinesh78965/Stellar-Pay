# Stellar Pay 💫

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![Stellar](https://img.shields.io/badge/Stellar-Testnet-08b5e5.svg)
![Freighter](https://img.shields.io/badge/Freighter-Wallet-6c5ce7.svg)

A lightweight React payment dApp for Stellar Testnet that connects to the Freighter wallet, reads XLM balance, and signs native XLM payment transactions directly from the browser.

## ✨ Features

- 🔗 **Connect Freighter Wallet** - Easy wallet integration with Freighter extension
- 👤 **Display Wallet Info** - Show public key and XLM balance in real-time
- 💸 **Send XLM Payments** - Transfer XLM to any Stellar Testnet account
- ✅ **Transaction Status** - Real-time feedback with success/failure messages
- 📋 **Copy to Clipboard** - One-click copy for addresses and transaction hashes
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔄 **Auto-refresh Balance** - Balance updates automatically after transactions

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Blockchain:** Stellar SDK
- **Wallet:** Freighter Wallet API
- **Network:** Stellar Testnet

## 📁 Project Structure
stellar-pay/
├── src/
│ ├── lib/
│ │ └── stellar.js # Stellar network utilities
│ ├── App.jsx # Main application component
│ ├── main.jsx # Application entry point
│ └── index.css # Global styles with Tailwind
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- [Freighter Wallet Extension](https://freighter.app/) installed in your browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinesh78965/Stellar-Pay.git
   cd Stellar-Pay

   ##📖 How It Works
**1. Wallet Connection
The app uses @stellar/freighter-api to:

Detect if Freighter extension is installed

Request wallet access permissions

Fetch the connected account's public key

Store connection state in localStorage

**2. Balance Display
Fetches account data from Horizon Testnet

Extracts native XLM balance

Auto-refreshes every 30 seconds

**3. Sending Payments
Builds a Stellar payment transaction

Signs with Freighter wallet

Submits to Horizon Testnet

Displays transaction hash and status


##📸 Screenshots
Connect Wallet		
https://docs/screenshots/connect.png

**Balance Display
https://docs/screenshots/balance.png

**Transaction Success
https://docs/screenshots/success.png



**📧 Contact
Dinesh - @dinesh78965

Project Link: https://github.com/dinesh78965/Stellar-Pay