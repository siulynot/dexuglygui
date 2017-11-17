var coin_select_options = '';

coin_select_options = `<optgroup label="Crytpo Coins">
      <option data-content="<img src='img/cryptologo/kmd.png' width='50px;'/> Komodo (KMD)" data-tokens="kmd komodo ">KMD</option>
      <option data-content="<img src='img/cryptologo/btc.png' width='50px;'/> Bitcoin (BTC)" data-tokens="btc bitcoin ">BTC</option>
      <option data-content="<img src='img/cryptologo/mnz.png' width='50px;'/> Monaize (MNZ)" data-tokens="mnz monaize ">MNZ</option>
      <option data-content="<img src='img/cryptologo/chips.png' width='50px;'/> CHIPS (CHIPS)" data-tokens="CHIPS CHIPS ">CHIPS</option>
      
      <option data-content="<img src='img/cryptologo/888.png' width='50px'/> OctoCoin (888)" data-tokens="OctoCoin 888">888</option>
      <option data-content="<img src='img/cryptologo/arc.png' width='50px'/> ArcticCoin (ARC)" data-tokens="ArcticCoin ARC">ARC</option>
      <option data-content="<img src='img/cryptologo/ARG.png' width='50px'/> Argentum (ARG)" data-tokens="Argentum ARG">ARG</option>
      <option data-content="<img src='img/cryptologo/bta.png' width='50px;'/> Bata (BTA)" data-tokens="Bata BTA">BTA</option>
      <option data-content="<img src='img/cryptologo/bdl.png' width='50px;'/> Bitdeal (BDL)" data-tokens="Bitdeal BDL">BDL</option>
      
      <option data-content="<img src='img/cryptologo/btx.png' width='50px'/> Bitcore (BTX)" data-tokens="Bitcore BTX">BTX</option>
      <option data-content="<img src='img/cryptologo/btcz.png' width='50px'/> BitcoinZ (BTCZ)" data-tokens="BitcoinZ BTCZ">BTCZ</option>
      <option data-content="<img src='img/cryptologo/bsd.png' width='50px'/> BitSend (BSD)" data-tokens="BitSend BSD">BSD</option>
      <option data-content="<img src='img/cryptologo/blk.png' width='50px'/> BlackCoin (BLK)" data-tokens="BlackCoin BLK">BLK</option>
      <option data-content="<img src='img/cryptologo/block.png' width='50px'/> Blocknet (BLOCK)" data-tokens="Blocknet BLOCK">BLK</option>
      
      <option data-content="<img src='img/cryptologo/crw.png' width='50px'/> Crown (CRW)" data-tokens="crw crown ">CRW</option>
      <option data-content="<img src='img/cryptologo/crea.png' width='50px'/> Creativecoin (CREA)" data-tokens="Creativecoin CREA">CREA</option>
      <option data-content="<img src='img/cryptologo/dash.png' width='50px'/> Dash (DASH)" data-tokens="dash">DASH</option>
      <option data-content="<img src='img/cryptologo/dgb.png' width='50px'/> Digibyte (DGB)" data-tokens="dgb digibyte">DGB</option>
      <option data-content="<img src='img/cryptologo/doge.png' width='50px'/> Dogecoin (DOGE)" data-tokens="doge dogecoin">DOGE</option>
      <option data-content="<img src='img/cryptologo/emc2.png' width='50px'/> Einsteinium (EMC2)" data-tokens="emc2 einsteinium">EMC2</option>
      <option data-content="<img src='img/cryptologo/erc.png' width='50px'/> EuropeCoin (ERC)" data-tokens="EuropeCoin ERC">ERC</option>
      <option data-content="<img src='img/cryptologo/fair.png' width='50px'/> Faircoin (FAIR)" data-tokens="FAIR Faircoin">FAIR</option>
      <option data-content="<img src='img/cryptologo/flo.png' width='50px'/> Florincoin (FLO)" data-tokens="Florincoin FLO">FLO</option>
      
      <option data-content="<img src='img/cryptologo/game.png' width='50px'/> Gamecredits (GAME)" data-tokens="Gamecredits GAME">GAME</option>
      <option data-content="<img src='img/cryptologo/glt.png' width='50px'/> GlobalToken (GLT)" data-tokens="GlobalToken GLT">GLT</option>
      <option data-content="<img src='img/cryptologo/huc.png' width='50px'/> Huntercoin (HUC)" data-tokens="Huntercoin HUC">HUC</option>
      <option data-content="<img src='img/cryptologo/hush.png' width='50px'/> Hush (HUSH)" data-tokens="Hush HUSH">HUSH</option>
      <option data-content="<img src='img/cryptologo/i0c.png' width='50px'/> I0Coin (I0C)" data-tokens="I0Coin I0C">I0C</option>
      <option data-content="<img src='img/cryptologo/iop.png' width='50px'/> Internet of People (IOP)" data-tokens="Internet of People IOP">IOP</option>
      <option data-content="<img src='img/cryptologo/lbc.png' width='50px'/> LBRY Credits (LBC)" data-tokens="LBRY Credits LBC">LBC</option>
      <option data-content="<img src='img/cryptologo/ltc.png' width='50px'/> Litecoin (LTC)" data-tokens="Litecoin LTC">LTC</option>
      <option data-content="<img src='img/cryptologo/mac.png' width='50px'/> Machinecoin (MAC)" data-tokens="Machinecoin MAC">MAC</option>
      <option data-content="<img src='img/cryptologo/maga.png' width='50px'/> Magacoin (MAGA)" data-tokens="Magacoin MAGA">MAGA</option>
      
      <option data-content="<img src='img/cryptologo/mona.png' width='50px'/> Monacoin (MONA)" data-tokens="Monacoin MONA">MONA</option>
      <option data-content="<img src='img/cryptologo/mue.png' width='50px'/> Monetary Unit (MUE)" data-tokens="MonetaryUnit MUE">MUE</option>
      <option data-content="<img src='img/cryptologo/moon.png' width='50px'/> Mooncoin (MOON)" data-tokens="Mooncoin MOON">MOON</option>
      <option data-content="<img src='img/cryptologo/xmy.png' width='50px'/> Myriad (XMY)" data-tokens="Myriad (XMY)">XMY</option>
      <option data-content="<img src='img/cryptologo/nav.png' width='50px'/> Navcoin (NAV)" data-tokens="Navcoin NAV">NAV</option>
      <option data-content="<img src='img/cryptologo/nmc.png' width='50px'/> Namecoin (NMC)" data-tokens="Namecoin NMC">NMC</option>
      <option data-content="<img src='img/cryptologo/pivx.png' width='50px'/> PIVX (PIVX)" data-tokens="PIVX">PIVX</option>
      <option data-content="<img src='img/cryptologo/xre.png' width='50px'/> RevolverCoin (XRE)" data-tokens="RevolverCoin XRE">XRE</option>
      <option data-content="<img src='img/cryptologo/sxc.png' width='50px'/> Sexcoin (SXC)" data-tokens="Sexcoin SXC">SXC</option>
      <option data-content="<img src='img/cryptologo/sib.png' width='50px'/> Sibcoin (SIB)" data-tokens="Sibcoin SIB">SIB</option>
      <option data-content="<img src='img/cryptologo/strat.png' width='50px'/> Stratis (STRAT)" data-tokens="Stratis STRAT">STRAT</option>
      <option data-content="<img src='img/cryptologo/smc.png' width='50px'/> SmartCoin (SMC)" data-tokens="SmartCoin SMC">SMC</option>
      <option data-content="<img src='img/cryptologo/sys.png' width='50px'/> Syscoin (SYS)" data-tokens="Syscoin SYS">SYS</option>
      <option data-content="<img src='img/cryptologo/trc.png' width='50px'/> Terracoin (TRC)" data-tokens="Terracoin TRC">TRC</option>
      
      <option data-content="<img src='img/cryptologo/uis.png' width='50px'/> Unitus (UIS)" data-tokens="Unitus UIS">UIS</option>
      <option data-content="<img src='img/cryptologo/vtc.png' width='50px'/> Vertcoin (VTC)" data-tokens="Vertcoin VTC">VTC</option>
      <option data-content="<img src='img/cryptologo/via.png' width='50px'/> Viacoin (VIA)" data-tokens="Viacoin VIA">VIA</option>
      <option data-content="<img src='img/cryptologo/zcl.png' width='50px'/> ZClassic (ZCL)" data-tokens="ZClassic ZCL">ZCL</option>
      <option data-content="<img src='img/cryptologo/zer.png' width='50px'/> Zero (ZER)" data-tokens="Zero ZER">ZER</option>
      <option data-content="<img src='img/cryptologo/zet.png' width='50px'/> Zetacoin (ZET)" data-tokens="Zetacoin ZET">ZET</option>
      <option data-content="<img src='img/cryptologo/zen.png' width='50px'/> ZenCash (ZEN)" data-tokens="ZenCash ZEN">ZEN</option>
      <option data-content="<img src='img/cryptologo/zec.png' width='50px'/> Zcash (ZEC)" data-tokens="Zcash ZEC">ZEC</option>
    </optgroup>
    <optgroup label="AssetChains">
      <option data-content="<img src='img/cryptologo/bet.png' width='50px'/> BET (BET)" data-tokens="BET BET">BET</option>
      <option data-content="<img src='img/cryptologo/bots.png' width='50px'/> BOTS (BOTS)" data-tokens="BOTS BOTS">BOTS</option>
      <option data-content="<img src='img/cryptologo/ceal.png' width='50px'/> Ceal (CEAL)" data-tokens="Ceal CEAL">CEAL</option>
      <option data-content="<img src='img/cryptologo/coqui.png' width='50px;'/> COQUI (COQUI)" data-tokens="COQUI COQUI">COQUI</option>
      <option data-content="<img src='img/cryptologo/crypto.png' width='50px'/> Crypto777 (CRYPTO)" data-tokens="Crypto777 CRYPTO">CRYPTO</option>
      <option data-content="<img src='img/cryptologo/dex.png' width='50px;'/> InstantDEX (DEX)" data-tokens="InstantDEX DEX">DEX</option>
      <option data-content="<img src='img/cryptologo/hodlc.png' width='50px'/> HODLC (HODLC)" data-tokens="HODLC HODLC">HODLC</option>
      <option data-content="<img src='img/cryptologo/jumblr.png' width='50px;'/> Jumblr (JUMBLR)" data-tokens="Jumblr JUMBLR">JUMBLR</option>
      <option data-content="<img src='img/cryptologo/kv.png' width='50px'/> KeyValue (KV)" data-tokens="KeyValue KV">KV</option>
      <option data-content="<img src='img/cryptologo/mesh.png' width='50px'/> SuperMesh (MESH)" data-tokens="SuperMesh MESH">MESH</option>
      <option data-content="<img src='img/cryptologo/mgw.png' width='50px'/> MultiGateway (MGW)" data-tokens="MultiGateway MGW">MGW</option>
      
      <option data-content="<img src='img/cryptologo/pangea.png' width='50px'/> Pangea (PANGEA)" data-tokens="Pangea PANGEA">PANGEA</option>
      <option data-content="<img src='img/cryptologo/revs.png' width='50px'/> REVS (REVS)" data-tokens="REVS REVS">REVS</option>
      <option data-content="<img src='img/cryptologo/shark.png' width='50px'/> SHARK (SHARK)" data-tokens="SHARK SHARK">SHARK</option>
      <option data-content="<img src='img/cryptologo/supernet.png' width='50px'/> SUPERNET (SUPERNET)" data-tokens="SUPERNET SUPERNET">SUPERNET</option>
      <option data-content="<img src='img/cryptologo/wlc.png' width='50px'/> Wireless (WLC)" data-tokens="Wireless WLC">WLC</option>>
    </optgroup>`;


/*
<option data-content="<img src='img/cryptologo/ANC.png' width='50px' disabled/> Anoncoin (ANC)" data-tokens="anc anoncoin">ANC</option>
<option data-content="<img src='img/cryptologo/BTM.png' width='50px' disabled/> Bitmark (BTM)" data-tokens="btm bitmark">BTM</option>
<option data-content="<img src='img/cryptologo/CARB.png' width='50px' disabled/> Carboncoin (CARB)" data-tokens="carb carboncoin">CARB</option>
<option data-content="<img src='img/cryptologo/FRK.png' width='50px' disabled/> Franko (FRK)" data-tokens="Franko FRK">FRK</option>
<option data-content="<img src='img/cryptologo/MZC.png' width='50px' disabled/> Mazacoin (MZC)" data-tokens="Mazacoin MZC">MZC</option>
<option data-content="<img src='img/cryptologo/UNO.png' width='50px' disabled/> Unobtanium (UNO)" data-tokens="Unobtanium UNO">UNO</option>
<option data-content="<img src='img/cryptologo/MVP.png' width='50px' disabled/> MVP (MVP)" data-tokens="MVP MVP">MVP</option>
<optgroup label="Komodo Currencies">
      <option data-content="<img src='img/cryptologo/aud.png' width='50px;'/> Australian Dollar (AUD)" data-tokens="Australian Dollar AUD">AUD</option>
      <option data-content="<img src='img/cryptologo/bgn.png' width='50px;'/> Bulgarian Lev (BGN)" data-tokens="Bulgarian Lev BGN">BGN</option>
      <option data-content="<img src='img/cryptologo/cad.png' width='50px;'/> Canadian Dollar (CAD)" data-tokens="Canadian Dollar CAD">CAD</option>
      <option data-content="<img src='img/cryptologo/chf.png' width='50px;'/> Swiss Franc (CHF)" data-tokens="Swiss Franc CHF">CHF</option>
      <option data-content="<img src='img/cryptologo/cny.png' width='50px;'/> Chinese Yuan (CNY)" data-tokens="Chinese Yuan CNY">CNY</option>
      <option data-content="<img src='img/cryptologo/czk.png' width='50px;'/> Czech Koruna (CZK)" data-tokens="Czech Koruna CZK">CZK</option>
      <option data-content="<img src='img/cryptologo/dkk.png' width='50px;'/> Danish Krone (DKK)" data-tokens="Danish Krone DKK">DKK</option>
      <option data-content="<img src='img/cryptologo/eur.png' width='50px;'/> Euro (EUR)" data-tokens="Euro EUR">EUR</option>
      <option data-content="<img src='img/cryptologo/gbp.png' width='50px;'/> Pound Sterling (GBP)" data-tokens="Pound Sterling GBP">GBP</option>
      <option data-content="<img src='img/cryptologo/hkd.png' width='50px;'/> Hong Kong Dollar (HKD)" data-tokens="Hong Kong Dollar HKD">HKD</option>
      <option data-content="<img src='img/cryptologo/hrk.png' width='50px;'/> Croatian Kuna (HRK)" data-tokens="Croatian Kuna HRK">HRK</option>
      <option data-content="<img src='img/cryptologo/huf.png' width='50px;'/> Hungarian Forint (HUF)" data-tokens="Hungarian Forint HUF">HUF</option>
      <option data-content="<img src='img/cryptologo/idr.png' width='50px;'/> Indonesian Rupiah (IDR)" data-tokens="Indonesian Rupiah IDR">IDR</option>
      <option data-content="<img src='img/cryptologo/ils.png' width='50px;'/> Israeli Shekel (ILS)" data-tokens="Israeli Shekel ILS">ILS</option>
      <option data-content="<img src='img/cryptologo/inr.png' width='50px;'/> Indian Rupee (INR)" data-tokens="Indian Rupee INR">INR</option>
      <option data-content="<img src='img/cryptologo/jpy.png' width='50px;'/> Japanese Yen (JPY)" data-tokens="Japanese Yen JPY">JPY</option>
      <option data-content="<img src='img/cryptologo/krw.png' width='50px;'/> South Korean Won (KRW)" data-tokens="South Korean Won KRW">KRW</option>
      <option data-content="<img src='img/cryptologo/mxn.png' width='50px;'/> Mexican Peso (MXN)" data-tokens="Mexican Peso MXN">MXN</option>
      <option data-content="<img src='img/cryptologo/myr.png' width='50px;'/> Malaysian Ringgit (MYR)" data-tokens="Malaysian Ringgit MYR">MYR</option>
      <option data-content="<img src='img/cryptologo/nok.png' width='50px;'/> Norwegian Krone (NOK)" data-tokens="Norwegian Krone NOK">NOK</option>
      <option data-content="<img src='img/cryptologo/nzd.png' width='50px;'/> New Zealand Dollar (NZD)" data-tokens="New Zealand Dollar NZD">NZD</option>
      <option data-content="<img src='img/cryptologo/php.png' width='50px;'/> Philippine Peso (PHP)" data-tokens="Philippine Peso PHP">PHP</option>
      <option data-content="<img src='img/cryptologo/pln.png' width='50px;'/> Polish Zloty (PLN)" data-tokens="Polish Zloty PLN">PLN</option>
      <option data-content="<img src='img/cryptologo/brl.png' width='50px;'/> Brazilian Real (BRL)" data-tokens="Brazilian Real BRL">BRL</option>
      <option data-content="<img src='img/cryptologo/ron.png' width='50px;'/> Romanian Leu (RON)" data-tokens="Romanian Leu RON">RON</option>
      <option data-content="<img src='img/cryptologo/rub.png' width='50px;'/> Russian Ruble (RUB)" data-tokens="Russian Ruble RUB">RUB</option>
      <option data-content="<img src='img/cryptologo/sek.png' width='50px;'/> Swedish Krona (SEK)" data-tokens="Swedish Krona SEK">SEK</option>
      <option data-content="<img src='img/cryptologo/sgd.png' width='50px;'/> Singapore Dollar (SGD)" data-tokens="Singapore Dollar SGD">SGD</option>
      <option data-content="<img src='img/cryptologo/thb.png' width='50px;'/> Thai Baht (THB)" data-tokens="Thai Baht THB">THB</option>
      <option data-content="<img src='img/cryptologo/try.png' width='50px;'/> Turkish Lira (TRY)" data-tokens="Turkish Lira TRY">TRY</option>
      <option data-content="<img src='img/cryptologo/usd.png' width='50px;'/> US Dollar (USD)" data-tokens="US Dollar USD">USD</option>
      <option data-content="<img src='img/cryptologo/zar.png' width='50px;'/> South African Rand (ZAR)" data-tokens="South African Rand ZAR">ZAR</option>
    </optgroup>
*/

$('.trading_pair_coin').html(coin_select_options);


$('.sell_coin').html(coin_select_options);
$('.buy_coin').html(coin_select_options);

$('.sell_coin_p').html(coin_select_options);
$('.buy_coin_p').html(coin_select_options);
