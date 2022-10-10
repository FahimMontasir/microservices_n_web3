pragma solidity ^0.4.17;

contract Inbox {
  string public message;

  function Inbox (string initMessage) public {
      message = initMessage;
  }

  function setMessage (string newMessage) public {
      message = newMessage;
  }

  function getMessage () public view returns (string){
      return message;
  }
}