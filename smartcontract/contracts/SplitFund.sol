// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SplitPayment {
    // Owner of the contract
    address public owner;

    // Struct to record each payment details
    struct Payment {
        address sender;              // Address of the sender
        address[] recipients;       // List of recipient addresses
        uint256[] amounts;          // List of amounts sent to each recipient
        uint256 timestamp;          // Timestamp of when the payment was made
    }

    // Array to store all payment history
    Payment[] public payments;

    // Event emitted when a payment is successfully sent
    event PaymentSent(address indexed sender, address[] recipients, uint256[] amounts, uint256 timestamp);

    // Constructor sets the contract deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Splits the sent ETH among recipients based on specified amounts
     * @param recipients Array of recipient addresses
     * @param amounts Array of ETH amounts to be sent to each recipient
     */
    function splitPayment(address[] calldata recipients, uint256[] calldata amounts) external payable {
        // Ensure the lengths of recipients and amounts match
        require(recipients.length == amounts.length, "Recipients and amounts length mismatch");

        uint256 totalAmount;
        // Calculate total amount to be distributed
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }

        // Ensure the sent ETH matches the total distribution amount
        require(msg.value == totalAmount, "Incorrect ETH sent");

        // Transfer respective amounts to each recipient
        for (uint256 i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amounts[i]);
        }

        // Record the payment in history
        payments.push(Payment({
            sender: msg.sender,
            recipients: recipients,
            amounts: amounts,
            timestamp: block.timestamp
        }));

        // Emit the PaymentSent event
        emit PaymentSent(msg.sender, recipients, amounts, block.timestamp);
    }

    /**
     * @dev Returns the total number of payments made
     */
    function getPaymentsCount() external view returns (uint256) {
        return payments.length;
    }

    /**
     * @dev Retrieves the details of a specific payment by index
     * @param index The index of the payment to retrieve
     * @return sender The address who sent the payment
     * @return recipients The list of recipients
     * @return amounts The list of amounts sent to each recipient
     * @return timestamp The timestamp when the payment was made
     */
    function getPayment(uint256 index) external view returns (address sender, address[] memory recipients, uint256[] memory amounts, uint256 timestamp) {
        require(index < payments.length, "Invalid index");
        Payment storage payment = payments[index];
        return (payment.sender, payment.recipients, payment.amounts, payment.timestamp);
    }
}
