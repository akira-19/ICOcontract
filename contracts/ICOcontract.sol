pragma solidity ^0.5.2;

import "../node_modules/openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/distribution/RefundableCrowdsale.sol";
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
/* import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/IndividuallyCappedCrowdsale.sol"; */
import "../node_modules/openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


/* Crowdsale, TimedCrowdsale, RefundableCrowdsale, CappedCrowdsale, IndividuallyCappedCrowdsale */

contract ICOcontract is Crowdsale, CappedCrowdsale, TimedCrowdsale, RefundableCrowdsale{

    constructor(
        uint _rate, address payable _wallet, IERC20 _token, uint _cap, uint _openingTime, uint _closingTime, uint _goal
    )
    Crowdsale(
        _rate, _wallet, _token
    )
    CappedCrowdsale(
        _cap
    )
    RefundableCrowdsale(
       _goal
   )
    TimedCrowdsale(
        _openingTime, _closingTime
    )
    public
    {

    }


}
