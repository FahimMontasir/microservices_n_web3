// SPDX-License-Identifier: MIT
// Refactor the Inbox constructor to use the new constructor keyword 
// Specify the data location of the variables to be memory 
// Remove the public keyword from the constructor

pragma solidity ^0.8.9;

contract Inbox {
    string public message;
    
    constructor(string memory initialMessage) {
        message = initialMessage;
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}