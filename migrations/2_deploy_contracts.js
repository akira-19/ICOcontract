var ICOcontract = artifacts.require("./ICOcontract.sol");
var FMPtoken = artifacts.require("./FMPtoken.sol");


module.exports = function(deployer, network, accounts) {
    const rate = web3.utils.toBN(1);
    const wallet = accounts[0];
    const name = "FMPtoken";
    const symbol = "FMP";
    const decimals = 18;
    const initSupply = web3.utils.toBN(100*(10**decimals));
    const cap = web3.utils.toWei("10", "ether");
    // const cap = web3.utils.toBN(10);
    const openingTime = 1556780400;
    const closingTime = 1567407600;
    const goal = web3.utils.toWei("5", "ether");
    // const goal = web3.utils.toBN(100);


    return deployer.then(() => {
        return deployer.deploy(
            FMPtoken,
            name,
            symbol,
            decimals,
            initSupply
        );
    }).then(() => {
        return deployer.deploy(
            ICOcontract,
            rate,
            wallet,
            FMPtoken.address,
            cap,
            openingTime,
            closingTime,
            goal
            );
    }).then(() => {
        return FMPtoken.deployed().then(instance => {
            instance.transfer(ICOcontract.address, initSupply, {from:accounts[0]});
        })
    })
};
