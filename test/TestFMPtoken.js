const FMPtoken = artifacts.require("FMPtoken");
var chai = require('chai');
var should = require('chai').should();
const BigNumber = require('bignumber.js');
chai.use(require('chai-bignumber')());

contract("FMPtoken", function(accounts){
    let token;
    const account = accounts[0]

    beforeEach(async () => {
        token = await FMPtoken.new("FMPtoken","FMP",18,1000);
    });

    describe('initialized correctly', () => {
        it('should be correct token name', async () => {
            const expectedName = 'FMPtoken';
            const actualName = await token.name();
            assert.equal(actualName, expectedName, "The contract name should be FMPtoken");
        });
        it('should be correct token symbol name', async () => {
            const expectedName = 'FMP';
            const actualName = await token.symbol();
            assert.equal(actualName, expectedName, "The contract name should be FMP");
        });
        it('should be correct decimals', async () => {
            const expect = 18;
            let actual = await token.decimals();
            actual = actual.toNumber();
            actual.should.be.equal(expect);
            // assert.equal(actual, expect, "The contract decimals should be 18");
        });
        it('should be correct amount of initial supply', async () => {
            const expect = 1000;
            const actual = await token.balanceOf(account);
            assert.equal(actual, expect, "Initial supply should be 1000");
        });
    });



});
