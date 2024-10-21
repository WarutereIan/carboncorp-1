// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CCToken is ERC20, ERC20Burnable, Ownable, AccessControl {
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor() ERC20("CCToken", "CC") Ownable(msg.sender) {
        _grantRole(BURNER_ROLE, msg.sender);
    }

    function transferBurnerRole(address new_burner) public onlyOwner {
        _grantRole(BURNER_ROLE, new_burner);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burnFromAddress(address from, uint256 amount) public {
        require(
            hasRole(BURNER_ROLE, msg.sender),
            "Caller does not have a burner role"
        );
        _burn(from, amount);
    }
}
