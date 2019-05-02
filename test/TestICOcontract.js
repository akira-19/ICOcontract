// var chai = require('chai');
// var should = require('chai').should();
const { balance, BN, constants, ether, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const { ZERO_ADDRESS } = constants;
const ICOcontract = artifacts.require("ICOcontract");
const FMPtoken = artifacts.require("FMPtoken");


contract("ICOcontract", function([_, investor, wallet, purchaser]){

    const rate = new BN(1);
    // const rate = new BN(10);
    const value = ether('3');
    const tokenSupply = new BN('10').pow(new BN('22'));
    // const tokenSupply = 1000
    const expectedTokenAmount = rate.mul(value);

    const startTime = 2560000000;
    const endTime = 2600000000;
    const cap = new BN(8).mul(new BN('10').pow(new BN('19')));
    const goal = new BN(6).mul(new BN('10').pow(new BN('19')));
    let currentBlock;

    it('requires a non-null token', async function () {
      await shouldFail.reverting(
        ICOcontract.new(rate, wallet, ZERO_ADDRESS, cap, startTime, endTime, goal)
      );
    });

    describe('Token', async function () {
        beforeEach(async function () {
          this.token = await FMPtoken.new("FMPtoken","FMP",18,tokenSupply);
        });

        it('requires a non-zero rate', async function () {
          await shouldFail.reverting(
            ICOcontract.new(0, wallet, this.token.address, cap, startTime, endTime, goal)
          );
        });

        it('requires a non-null wallet', async function () {
          await shouldFail.reverting(
            ICOcontract.new(rate, ZERO_ADDRESS, this.token.address, cap, startTime, endTime, goal)
          );
        });


        context('deployed with current startTime', async function () {
          beforeEach(async function () {
            const block = await web3.eth.getBlock("latest");
            this.openTime = block.timestamp;
            this.closeTime = this.openTime + 100000;
            this.crowdsale = await ICOcontract.new(rate, wallet, this.token.address, cap, this.openTime, this.closeTime, goal);
            await this.token.transfer(this.crowdsale.address, tokenSupply);

          });

          context('buyTokens', function () {
            it('should accept payments', async function () {
              await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
            });

            it('reverts on zero-valued payments', async function () {
              await shouldFail.reverting(
                this.crowdsale.buyTokens(investor, { value: 0, from: purchaser })
              );
            });

            it('requires a non-null beneficiary', async function () {
              await shouldFail.reverting(
                this.crowdsale.buyTokens(ZERO_ADDRESS, { value: value, from: purchaser })
              );
            });

          });

        });


        context('deployed with future startTime', async function() {
            beforeEach(async function () {
              this.crowdsale = await ICOcontract.new(rate, wallet, this.token.address, cap, startTime, endTime, goal);
              await this.token.transfer(this.crowdsale.address, tokenSupply);
            });

            it('should fails before openingTime', async function () {
              await shouldFail.reverting(
                this.crowdsale.buyTokens(investor, {value: value, from: purchaser})
              );
            });
        });



    });






});

    
