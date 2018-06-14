
var coinsdbdir = JSON.parse(localStorage.getItem('mm_barterdex_app_info')).CoinsDBDir;
var login_select_options = '';

login_select_options = `
<option data-content="<img src='${coinsdbdir}/icons/kmd.png' width='50px;'/> BarterDEX - Komodo Decentralized Exchange" data-tokens="BarterDEX ">BarterDEX</option>
`

// Removed option
//<option data-content="<img src='img/cryptologo/mnz.png' width='50px;'/> Monaize (MNZ) dICO - Decentralized ICO" data-tokens="dICO">dICO</option>

$('.login_mode_options').html(login_select_options);