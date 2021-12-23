// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Owned.sol';
import './Logger.sol';
import './IFaucet.sol';

contract Faucet is Owned, Logger, IFaucet {
    address[] public funders;

    uint256 public numOfFunders;
    mapping(address => bool) private theFunders;
    mapping(uint256 => address) private lutFunders;

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1000000000000000000,
            'Cannot withdraw more than 1 eth'
        );
        _;
    }

    receive() external payable {}

    function test1() external onlyOwner {}

    function emitLog() public pure override returns (bytes32) {
        return 'Hello world';
    }

    function addFunds() public payable override {
        funders.push(msg.sender);
    }

    function addFundsMapping() external payable {
        address funder = msg.sender;

        if (!theFunders[funder]) {
            uint256 index = numOfFunders++;
            theFunders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    function getAllFunders() public view returns (address[] memory) {
        return funders;
    }

    function getAllFundersMapping() public view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        address[] memory _funders = getAllFunders();
        return _funders[index];
    }

    function getFunderAtIndexMapping(uint8 index)
        external
        view
        returns (address)
    {
        return lutFunders[index];
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }
}
