# DEX Ugly GUI

Before starting make sure you have `iguana` daemon compiled and running on your machine.

You can find instructions to install `iguana` here:

https://github.com/SuperNETorg/komodo/wiki/Setting-up-Liquidity-Provider-(LP)-Node#installing-liquidity-provider-lp-node-on-ubuntudebian-system

Just follow the above guide ONLY to the point it starts `iguana`.

Once running, follow these steps:
```shell
git clone https://github.com/SuperNETorg/dexuglygui.git
git checkout v0.2
```

Or click on this link to download a copy of this repo as a zip file:

https://github.com/SuperNETorg/dexuglygui/archive/v0.2.zip

It will download "v0.2". Open "v0.2", and from there open "index.html" file in your web browser.



## Quick Explanation of Steps:

### Step #1 - Activate Coin

- Activate Bitcoin
- Activate Komodo

Then check if both BTC and KMD are showing under 'basilisk' in JSON output like following:

```JSON
{
  "native": [],
  "basilisk": [
    "BTC",
    "KMD"
  ],
  "full": [],
  "tag": "18225885340050776559"
}
```

### Step #2 - Setup Blocktrail.com API

It includes instructions to get Blocktrail API key which you'll need to intput there and then acitvate it. Here are those instructions again:

- You need Blocktrail.com API. Please sign-up by going to [this link](https://www.blocktrail.com/dev/signup).
- After login in your account go to **Settings**, then go to **API Keys** tab there and get new keys from there.
- Make sure to save the newly generated `API Key` and `API Secret`. You'll only see this `API Secret` first time and never again.

- Input this Blocktrail API Key in Step 02, and press _**Activate Blocktrail API**_ button.
- Then click _**I'm not LP**_ button.


### Step #3 - Wallet Login

On this step you'll login to your wallet using passphrase.

- **Login** button logins to your wallet, and you can continue with the EasyDEX coin swap steps after this.
- **Login BTC Jumblr** button and **Login KMD Jumblr** button lets you access your BTC/KMD deposit address. Clicking on it any other sections which are not relevant to this passphrase hides, as this steps suppose to be only used for makinmg BTC/KMD transaction to other accounts.


### Step #4 - List Smart Addresses

- On this step click button **List Smart Addresses**

This step shows you your logged in wallet's Smart Addresses.
To know more about Smart Addresses, what these are and what they do, I highly recommend to please read this [FAQ for Smart Addresses](https://github.com/SuperNETorg/komodo/wiki/FAQ-for-smartaddresses)

This step won't require you to do anything, but gives you information which type of smart addresses and their related deposite and reciving addresses.

These smart addresses's deposit and reciving addresses will always be different than your logged in wallet's main addresses.


### Step #5 - Adjust DEX Parameters

On this step you get the option to change what percentage of order matching you wish your coin swaps to be completing.

The value input for this is expected from 0.01 - 1.00. But, you'd never want to set it that low and that high, for definte trading reasons. :)

To give better idea, for example you submit your KMD or BTC to deposit address to recieve swap of that coin.

The default value for **DEX ratio** is 0.95 (99.5%), which usually requites the market to move in the direction favorable to you for the LP nodes to adjust their quotes to meet your price during a specific time window when both are active, ie. low probability.

You can change it's value to 0.97 to get higher chance (99.7%) of your order to complete.

For this testing version, at the start, it's highly recommended to set it's value to 0.97, and get the results of testing. Once enough people have tested DEX then it's good to play with lower values.


### Step #6 - Wallet Operations

- **Show Bitcoin Balance** button will show your logged in wallet's main BTC address and it's balance.
- **Show Komodo Balance** button will show your logged in wallet's main KMD address and it's balance.
- **Show Wallet Info** will show all addresses for your logged in wallet in JSON output.


### Step #7 - Initiate Cross-Blockchain Coin Swap

This EasyDEX Ugly GUI is doing only 2 coins swap for the begining. KMD and BTC. No other currency or coin is shown in options for this testing GUI.
In Agama Wallet all other options will be activated to make different pairs of swaping coins with another.


The first option there to select is what you want to buy.

_**If you select BTC**_, the screen will update with information related to get BTC.

As this is just a test version, I have set there only 2 buttons with default value of 100 KMD and 0.001 KMD for fee.

>NOTE: For buying BTC, please push BOTH Send KMD buttons.


There are two buttons to send KMD as the protocol require to UTXOs to process and complete the swap.

If you won't send KMD fee after sending 100 KMD your swap might not complete.


_**If you select KMD**_, you'll see information and options to buy KMD through DEX.

The send BTC button auto updates with the expected BTC value to complete trade to buy 100 KMD, which is the minimum buy order in DEX.

The estimate price is taken from CoinMarketCap for now, and is adjusted to match with the expected DEX prices at that period of time.



### Step #8 - Check Swap List

Once you have deposited BTC or KMD to initalise cross-blockchain coin swap process, you get to this screen and push **Refresh Swap List** button.

Pushing this btton will show you JSON output of any latest swap list that are in progress.

If you see blank JSON output like this:

```JSON
{
  "result": "success",
  "swaps": [],
  "quotes": [],
  "tag": "11164256562825577933"
}
```

This means the coin swap process for your request has not begun. You should wait for sometime and refresh this button to see any updated output.
