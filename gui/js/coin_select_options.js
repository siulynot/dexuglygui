
var coin_select_options = '';

coin_select_options = `<optgroup label="Crytpo Coins">
      <option data-content="<img src='img/cryptologo/kmd.png' width='50px;'/> Komodo (KMD)" data-tokens="kmd komodo ">KMD</option>
      <option data-content="<img src='img/cryptologo/btc.png' width='50px;'/> Bitcoin (BTC)" data-tokens="btc bitcoin ">BTC</option>
    </optgroup>`;


$('.trading_pair_coin').html(coin_select_options);


