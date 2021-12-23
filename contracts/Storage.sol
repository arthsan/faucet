// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    mapping(uint256 => uint256) public aa;
    mapping(address => uint256) public bb;

    //slot 2
    uint8 public a = 7;
    uint16 public b = 10;
    address public c = 0x59F3C2a5FFD77D928A519173de044F604cE1A5a3;
    bool d = true;
    uint64 public e = 15;

    //slot 3
    uint256 public f = 200;

    //slot 4
    uint8 public g = 40;

    //slot 5
    uint256 public h = 789;

    constructor() {
        aa[2] = 4;
        aa[3] = 10;

        bb[0x59F3C2a5FFD77D928A519173de044F604cE1A5a3] = 100;
    }
}
