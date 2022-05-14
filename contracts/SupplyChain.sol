//SPDX-License-Identifier: MIT
<<<<<<< Updated upstream
// Author: @woosal1337

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
        address _manufacturerAddress;
        address _carrierWalletAddress;
        string _productName;
        uint _expirationDate;
        bool _deliveryDone;

=======
pragma solidity ^0.8.4;

contract ColdSupplyChain {
    address public owner;

    struct Package {
        address admin;
        address currentCarrier;
        string productName;
        uint256 expirationDate;
        bool deliveryDone;
        address[] carriers;
        uint256[] timestamps;
        uint256 carrierFinished;
>>>>>>> Stashed changes
    }

    event OwnerChanged(
        address indexed _previousOwner,
        address indexed _newOwner
    );

    event AdminAdded(
        address indexed _admin,
        uint _timetstamp
    );

    event AdminRemoved(
        address indexed _admin,
        uint _timetstamp
    );

    event PackageCarrierChange(
        address indexed _sender,
        address indexed _to,
        bytes32 _packageId,
        uint _timestamp
    );

<<<<<<< Updated upstream
    event NewPackageCreated(
        bytes32 _packageId,
        uint _timestamp,
        address carrierWalletAddress
=======
    event OwnerChanged(
        address indexed oldOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    event AdminAdded(address indexed admin, uint256 timestamp);
    event AdminRemoved(address indexed admin, uint256 timestamp);
    event NewPackageCreated(
        bytes32 packageId,
        address indexed admin,
        address indexed currentCarrier,
        string productName,
        uint256 expirationDate,
        address[] carriers,
        uint256[] timestamps
    );
    event PackageCarrierChange(
        address indexed oldCarrier,
        address indexed newCarrier,
        address indexed changedByAddress,
        uint256 timestamp
    );
    event PackageArrived(
        bytes32 packageId,
        address currentCarrier,
        uint256 timestamp
    );
    event PackageDeleted(
        bytes32 packageId,
        address indexed deletedBy,
        uint256 timestamp
>>>>>>> Stashed changes
    );

    event PackageArrived(
        bytes32 _packageId,
        uint _timestamp,
        address _carrierWalletAddress
    );

    event TotalDelivered(
        address _carrierWalletAddress,
        uint _totalDelivered
    );

    event DeletePackage (
        bytes32 _packageId,
        address _deletedBy
    );

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
<<<<<<< Updated upstream
        owner = msg.sender;

        emit OwnerChanged(0x0000000000000000000000000000000000000000, owner);
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
=======
        assert(owner != msg.sender);

        owner = msg.sender;
        emit OwnerChanged(
            0x0000000000000000000000000000000000000000,
            owner,
            block.timestamp
        );
    }

    function addAdmin(address admin) public onlyOwner {
        admins[admin] = true;
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
    /**
     * @dev Returns unique keccak256 hash combined with _carrierWalletAddress,
     * block.timestamp.
     */
    function packageIdGenerator(
        address _carrierWalletAddress
    ) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
                _carrierWalletAddress,
                block.timestamp));
    }
=======
    function packageIdGenerator(address carrier) public view returns (bytes32) {
        return keccak256(abi.encodePacked(carrier, block.timestamp));
    }

    function transferOwnership(address newOwner) public onlyOwner {
        address oldOwner = owner;
        owner = newOwner;
>>>>>>> Stashed changes

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
        owner = _owner;

        emit OwnerChanged(msg.sender, _owner);
    }

<<<<<<< Updated upstream
    /**
     * @dev Creates and add the new package/delivery with the {Product} struct
     * to the {products} mapping.
     *
     * Requirements:
     * - the caller must be an {admin} or {owner}.
     *
     * Emits {NewPackageCreated} event indicating the {packageId}, {timestamp},
     * and {carrierWalletAddress}.
     */
    function createDeliveryPackage(
        address _manufacturerAddress,
        address _carrierWalletAddress,
        string memory _productName,
        uint _expirationDate,
        bool _deliveryDone
    ) onlyAdminOrOwner public {
        bytes32 _packageId = packageIdGenerator(msg.sender);
        products[_packageId]._manufacturerAddress = _manufacturerAddress;
        products[_packageId]._carrierWalletAddress = _carrierWalletAddress;
        products[_packageId]._productName = _productName;
        products[_packageId]._expirationDate = _expirationDate;
        products[_packageId]._deliveryDone = _deliveryDone;

        emit NewPackageCreated(
            _packageId,
            block.timestamp,
            _carrierWalletAddress);
    }
=======
    function createDeliveryPackage(
        address currentCarrier,
        string memory productName,
        uint256 expirationDate,
        address[] memory carriers,
        uint256[] memory timestamps
    ) public onlyAdminOrOwner {
        require(
            carriers.length >= 1,
            "No carrier was provided as an input! Add some carriers!"
        );
        require(
            carriers.length == timestamps.length,
            "The number of the carriers and their according timestamp lengths are different! Make sure you enter the same number of carriers and timestamps!"
        );
>>>>>>> Stashed changes

    /**
     * @dev Changes the {carrierWalletAddress} saved in the {products} mapping.
     *
     * Requirements:
     * - the caller must be the current {carrierWalletAddress} of the
     * {packageId} package.
     *
     * Emits {PackageCarrierChange} event indicating the old
     * {carrierWalletAddress} and the new {carrierWalletAddress} for the
     * {packageId} package.
     */
    function changePackageCarrier(bytes32 _packageId, address _newCarrier) public {
        require(msg.sender == products[_packageId]._carrierWalletAddress || msg.sender == products[_packageId]._manufacturerAddress,
            "You are not the current Carrier of this product!");

        products[_packageId]._carrierWalletAddress = _newCarrier;

<<<<<<< Updated upstream
        emit PackageCarrierChange(
            msg.sender,
            _newCarrier,
            _packageId,
            block.timestamp);
    }

    /**
     * @dev Changes the {carrierWalletAddress} saved in the {products} mapping
     * indicating that package has been successfully delivered to the final
     * destination.
     *
     * Requirements:
     * - the caller must be the current {carrierWalletAddress} of the
     * {packageId} package.
     *
     * Emits {PackageArrived} event indicating that {packageId} package has been
     * successfully delivered to the final destination.
     *
     * Note:
     * - the {carrierWalletAddress} is changed to the {owner} address.
     */
    function packageArrived(bytes32 _packageId) public {
        require(msg.sender == products[_packageId]._carrierWalletAddress,
            "You are not the current Carrier of this product!");
=======
        emit NewPackageCreated(
            packageId,
            msg.sender,
            currentCarrier,
            productName,
            expirationDate,
            carriers,
            timestamps
        );
    }

    function changePackageCarrier(bytes32 packageId, address newCarrierAddress)
        public
    {
        require(
            packages[packageId].currentCarrier == msg.sender ||
                packages[packageId].admin == msg.sender ||
                msg.sender == owner,
            "You do not have an access to edit the carrier address of this package!"
        );
>>>>>>> Stashed changes

        products[_packageId]._deliveryDone = true;
        products[_packageId]._carrierWalletAddress = owner;

<<<<<<< Updated upstream
        emit PackageArrived(
            _packageId,
            block.timestamp,
            msg.sender
        );
    }

=======
        emit PackageCarrierChange(
            oldCarrier,
            newCarrierAddress,
            msg.sender,
            block.timestamp
        );
    }

    function deleteDeliveryPackage(bytes32 packageId) public {
        require(
            packages[packageId].admin == msg.sender,
            "You are not the admin of this package!"
        );
>>>>>>> Stashed changes

    /**
     * @dev Deletes the {_packageId} saved in the {products} mapping.
     *
     * Requirements:
     * - the caller must be the current {_manufacturerAddress} of the
     * {packageId} package.
     *
     * Emits {DeletePackage} event indicating that {packageId} package has been
     * successfully deleted from the {products}.
     *
     */
    function deletePackage(bytes32 _packageId) public {
        require(msg.sender == products[_packageId]._manufacturerAddress, "You do not have permission do delete this package!");

        delete products[_packageId];

        emit DeletePackage(_packageId, msg.sender);
    }

<<<<<<< Updated upstream

    /**
     * @dev Throws if called by any account other than the owner.
     */
=======
>>>>>>> Stashed changes
    modifier onlyOwner() {
        require(owner == msg.sender,
            "You are not the Owner!");
        _;
    }

    /**
     * @dev Throws if called by any account other than the admin or owner.
     */
    modifier onlyAdminOrOwner() {
<<<<<<< Updated upstream
        require(admins[msg.sender] == true || msg.sender == owner,
            "You are not the Admin!");
=======
        require(
            admins[msg.sender] == true || owner == msg.sender,
            "You are not an admin or the owner!"
        );
>>>>>>> Stashed changes
        _;
    }
}
