//SPDX-License-Identifier: MIT
// Author: @medipolchain

pragma solidity 0.8.0;

/**
 * @dev Contract module which includes the complete supply chain functionality
 * and is used to simulate the supply chain.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */

contract SupplyChain {

    address public owner;

    mapping(address => bool) public admins;
    mapping(bytes32 => Product) public products;

    /**
     * @dev Creates a package/delivery product details.
     */
    struct Product {
        address _admin;
        address _currentCarrier;
        bool _deliveryDone;
    }

    event OwnerChanged(
        address indexed _previousOwner,
        address indexed _newOwner,
        uint _timestamp
    );

    event AdminAdded(
        address indexed _admin,
        uint _timestamp
    );

    event AdminRemoved(
        address indexed _admin,
        uint _timestamp
    );

    event PackageCarrierChange(
        address indexed _sender,
        address indexed _to,
        bytes32 _packageId,
        uint _timestamp
    );

    event NewPackageCreated(
        bytes32 _packageId,
        address _admin,
        address _currentCarrier,
        uint _timestamp
    );

    event PackageArrived(
        bytes32 _packageId,
        address _currentCarrier,
        uint _timestamp
    );

    event DeletePackage (
        bytes32 _packageId,
        address _deletedBy,
        uint _timestamp
    );

    event TemperatureViolated(
        bytes32 _packageId,
        address indexed _currentCarrier,
        uint _timestamp
    );

    event SetPackageAdmin(
        bytes32 _packageId,
        address _oldAdmin,
        address _newAdmin,
        uint _timestamp
    );

    event SetPackageDeliveryDoneOrUndone(
        bytes32 _packageId,
        bool _previousDeliveryStatus,
        bool _newDeliveryStatus,
        uint _timestamp
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        owner = msg.sender;

        emit OwnerChanged(0x0000000000000000000000000000000000000000, owner, block.timestamp);
    }

    /**
     * @dev Adds new Admin users to the {admins}.
     *
     * Emits {AdminAdded} event indicating the {Admin} and the timestamp.
     *
     * Requirements:
     * - the caller must be the owner.
     */
    function addAdmin(
        address _admin
    ) public onlyOwner {
        admins[_admin] = true;

        emit AdminAdded(_admin, block.timestamp);
    }

    /**
     * @dev Removes an Admin user from the {admins}.
     *
     * Emits {AdminRemoved} event indicating the {Admin} and the timestamp.
     *
     * Requirements:
     * - the caller must be the {owner}.
     */
    function removeAdmin(
        address _admin
    ) public onlyOwner {
        admins[_admin] = false;

        emit AdminRemoved(_admin, block.timestamp);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`_owner`).
     *
     * Requirements:
     * - the caller must be the {owner}.
     *
     * Emits {OwnerChanged} event indicating the previous owner and the
     * new owner.
     */
    function transferOwnership(
        address _owner
    ) public onlyOwner {
        address oldOwner = owner;
        owner = _owner;

        emit OwnerChanged(oldOwner, owner, block.timestamp);
    }

    /**
     * @dev Creates and add the new package/delivery with the {Product} struct
     * to the {products} mapping.
     *
     * Requirements:
     * - the caller must be an {admin} or {owner}.
     *
     * Emits {NewPackageCreated} event indicating the {packageId}, {timestamp},
     * and {currentCarrier}.
     */
    function createDeliveryPackage(
        bytes32 _packageId,
        address _currentCarrier
    ) onlyAdminOrOwner public {
        products[_packageId]._admin = msg.sender;
        products[_packageId]._currentCarrier = _currentCarrier;

        emit NewPackageCreated(
            _packageId,
            msg.sender,
            _currentCarrier,
            block.timestamp
        );
    }

    /**
     * @dev Changes the {currentCarrier} saved in the {products} mapping.
     *
     * Requirements:
     * - the caller must be the current {currentCarrier} of the
     * {packageId} package.
     *
     * Emits {PackageCarrierChange} event indicating the old
     * {currentCarrier} and the new {currentCarrier} for the
     * {packageId} package.
     */
    function changePackageCarrier(bytes32 _packageId, address _newCarrier) public {
        require(msg.sender == products[_packageId]._currentCarrier || msg.sender == products[_packageId]._currentCarrier,
            "You are not the current Carrier of this product!");

        products[_packageId]._currentCarrier = _newCarrier;

        emit PackageCarrierChange(
            msg.sender,
            _newCarrier,
            _packageId,
            block.timestamp);
    }

    /**
     * @dev Changes the {currentCarrier} saved in the {products} mapping
     * indicating that package has been successfully delivered to the final
     * destination.
     *
     * Requirements:
     * - the caller must be the current {currentCarrier} of the
     * {packageId} package.
     *
     * Emits {PackageArrived} event indicating that {packageId} package has been
     * successfully delivered to the final destination.
     *
     * Note:
     * - the {currentCarrier} is changed to the {owner} address.
     */
    function packageArrived(bytes32 _packageId) public {
        require(msg.sender == products[_packageId]._currentCarrier || msg.sender == products[_packageId]._admin,
            "You are not the current Carrier nor the Admin of this product!");

        products[_packageId]._deliveryDone = true;
        products[_packageId]._currentCarrier = owner;

        emit PackageArrived(
            _packageId,
            msg.sender,
            block.timestamp
        );
    }


    /**
     * @dev Deletes the {_packageId} saved in the {products} mapping.
     *
     * Requirements:
     * - the caller must be the current {_currentCarrier} of the
     * {packageId} package.
     *
     * Emits {DeletePackage} event indicating that {packageId} package has been
     * successfully deleted from the {products}.
     *
     */
    function deletePackage(bytes32 _packageId) public {
        require(msg.sender == products[_packageId]._admin || msg.sender == owner, 
            "You do not have permission do delete this package!");

        delete products[_packageId];

        emit DeletePackage(_packageId, msg.sender, block.timestamp);
    }

    /**
     * @dev Gets the {currentCarrier} argument in the {products} mapping struct.
     */
    function getPackageCurrentCarrier(bytes32 _packageId) public view returns (address) {
        return products[_packageId]._currentCarrier;
    }

    /**
     * @dev Gets the {admin} argument in the {products} mapping struct.
     */
    function getPackageAdmin(bytes32 _packageId) public view returns (address) {
        return products[_packageId]._admin;
    }

    /**
     * @dev Gets the {packageDelivery} argument in the {products} mapping struct.
     */
    function getPackageDeliveryDone(bytes32 _packageId) public view returns (bool) {
        return products[_packageId]._deliveryDone;
    }

    /**
     * @dev Sets the {admin} argument in the {products} mapping struct.
     *
     * Requirements:
     * - the caller must be the owner.
     *
     * Emits {SetPackageAdmin} event indicating that the {admin} of {packageId} package 
     * has been successfully changed to {_newAdmin}.
     *
     */
    function setPackageAdmin(bytes32 _packageId, address _newAdmin) public onlyOwner {
        address _oldAdmin = products[_packageId]._admin;
        products[_packageId]._admin = _newAdmin;

        emit SetPackageAdmin(_packageId, _oldAdmin, _newAdmin, block.timestamp);
    }

    /**
     * @dev Sets the {deliveryDone} argument in the {products} mapping struct.
     *
     * Requirements:
     * - the caller must be an admin or the owner.
     *
     *
     * Emits {SetPackageDeliveryDoneOrUndone} event indicating that the {deliveryDone} of {packageId} package 
     * has been successfully changed to false if was true, and true if was false.
     */
    function setPackageDeliveryDoneOrUndone(bytes32 _packageId) public onlyAdminOrOwner {
        bool _oldDeliveryDone = products[_packageId]._deliveryDone;

        // Case of _oldDeliveryDone == true
        if (_oldDeliveryDone) {
            products[_packageId]._deliveryDone = false;
        } else { // Case of _oldDeliveryDone == false
            products[_packageId]._deliveryDone = true;
        }

        emit SetPackageDeliveryDoneOrUndone(_packageId, _oldDeliveryDone, !_oldDeliveryDone, block.timestamp);
    }

    /**
     * @dev Emits the {TemperatureViolated} event in the {products} mapping.
     *
     * Requirements:
     * - the caller must be an admin or the owner.
     *
     */
    function temperatureViolate(bytes32 _packageId) public onlyAdminOrOwner {
        
        emit TemperatureViolated(_packageId, products[_packageId]._currentCarrier, block.timestamp);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner == msg.sender,
            "You are not the Owner!");
        _;
    }

    /**
     * @dev Throws if called by any account other than the admin or owner.
     */
    modifier onlyAdminOrOwner() {
        require(admins[msg.sender] == true || msg.sender == owner,
            "You are not the Admin!");
        _;
    }

}