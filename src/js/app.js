App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/48190ec952f442fc94011c79e5e603b1');
  }

  web3 = new Web3(App.web3Provider);
  return App.initContract();
  },

  initContract: function() {
      $.getJSON('ICOcontract.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var ICOcontractArtifact = data;
    App.contracts.ICOcontract = TruffleContract(ICOcontractArtifact);

    // Set the provider for our contract
    App.contracts.ICOcontract.setProvider(App.web3Provider);

  });
      $.getJSON('FMPtoken.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var FMPtokenArtifact = data;
    App.contracts.FMPtoken = TruffleContract(FMPtokenArtifact);

    // Set the provider for our contract
    App.contracts.FMPtoken.setProvider(App.web3Provider);
    return App.showToken();
  });
    App.getRefund();
    return App.purchaseToken();
  },

  purchaseToken: function(){
      $(document).on('click', '#purchase_token', function(event){
          event.preventDefault();
          let fundAmount = $('#fundAmount').val();
          fundAmount = parseInt(fundAmount);
          fundAmount = window.web3.toWei(fundAmount, 'ether');
          web3.eth.getAccounts(function(error, accounts) {
              if (error) {
                  console.log(error);
              }
              var account = accounts[0];

              App.contracts.ICOcontract.deployed().then(instance => {
                  instance.buyTokens(account, {from: account, value: fundAmount});
              }).catch(function(err) {
                  console.log(err.message);
              });

          });
     });
 },

 showToken: function(){
     web3.eth.getAccounts(function(error, accounts) {
         if (error) {
             console.log(error);
         }
         var account = accounts[0];
         let icoInstance;
         App.contracts.ICOcontract.deployed().then(instance => {
             icoInstance = instance;
             return icoInstance.weiRaised();
         }).then(weiRaised => {
             let raisedEther = weiRaised / (10**18);
             $("#weiRaised").text(raisedEther + ' ether');
             return icoInstance.openingTime();
         }).then(opTime => {
             const d = new Date(opTime * 1000);
             const year = d.getFullYear();
             const month = d.getMonth() + 1;
             const day = d.getDate();
             const hour = ('0' + d.getHours()).slice(-2);
             const minute = ('0' + d.getMinutes()).slice(-2);
             $("#opTime").text(year + "-" + month + "-" + day + " " + hour + ":" + minute);
             return icoInstance.closingTime();
         }).then(clTime => {
             const d = new Date(clTime * 1000);
             const year = d.getFullYear();
             const month = d.getMonth() + 1;
             const day = d.getDate();
             const hour = ('0' + d.getHours()).slice(-2);
             const minute = ('0' + d.getMinutes()).slice(-2);
             $("#clTime").text(year + "-" + month + "-" + day + " " + hour + ":" + minute);
             return icoInstance.cap();
         }).then(maxFund => {
             const fund = maxFund / (10**18);
             $("#maxFund").text(fund + " ether");
             return icoInstance.goal();
         }).then(goal => {
             const goalFund = goal / (10**18);
             $("#goal").text(goalFund + " ether");
         }).catch(function(err) {
             console.log(err.message);
         });

         App.contracts.FMPtoken.deployed().then(instance => {
             return instance.balanceOf(account);
         }).then(balance => {
             let token = balance / (10**18);
             $("#token").text(token + ' FMP');
         }).catch(function(err) {
             console.log(err.message);
         });

     });

 },

 getRefund: function(){
     $(document).off('click');
     $(document).on('click', '#getRefund', function(event){
         event.preventDefault();
         web3.eth.getAccounts(function(error, accounts) {
             if (error) {
                 console.log(error);
             }
             var account = accounts[0];
             let icoInstance;
             App.contracts.ICOcontract.deployed().then(instance => {
                 icoInstance = instance;
                 icoInstance.claimRefund(account);
             }).catch(function(err) {
                 console.log(err.message);
             });
         });
     });
 }

}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
