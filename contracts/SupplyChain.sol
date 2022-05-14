// SPDX-License-Identifier: MIT
// Author: @woosal1337

pragma solidity ^0.8.0;

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

    mapping(address => Product[]) public userProducts;
    mapping(address => bool) public admins;
    mapping(bytes32 => Product) public products;

    /**
     * @dev Creates a package/delivery product details.
     */
    struct Product {
        address _manufacturerAddress;
        address _carrierWalletAddress;
        string _productName;
        uint256 _expirationDate;
        bool _deliveryDone;
    }

    event OwnerChanged(
        address indexed _previousOwner,
        address indexed _newOwner
    );

    event AdminAdded(address indexed _admin, uint256 _timetstamp);

    event AdminRemoved(address indexed _admin, uint256 _timetstamp);

    event PackageCarrierChange(
        address indexed _sender,
        address indexed _to,
        bytes32 _packageId,
        uint256 _timestamp
    );

    event NewPackageCreated(
        bytes32 _packageId,
        uint256 _timestamp,
        address carrierWalletAddress
    );

    event PackageArrived(
        bytes32 _packageId,
        uint256 _timestamp,
        address _carrierWalletAddress
    );

    event TotalDelivered(
        address _carrierWalletAddress,
        uint256 _totalDelivered
    );

    event DeletePackage(bytes32 _packageId, address _deletedBy);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
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
    function addAdmin(address _admin) public onlyOwner {
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
    function removeAdmin(address _admin) public onlyOwner {
        admins[_admin] = false;

        emit AdminRemoved(_admin, block.timestamp);
    }

    /**
     * @dev Returns unique keccak256 hash combined with _carrierWalletAddress,
     * block.timestamp.
     */
    function packageIdGenerator(address _carrierWalletAddress)
        public
        view
        returns (bytes32)
    {
        return
            keccak256(abi.encodePacked(_carrierWalletAddress, block.timestamp));
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
    function transferOwnership(address _owner) public onlyOwner {
        owner = _owner;

        emit OwnerChanged(msg.sender, _owner);
    }

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
        uint256 _expirationDate,
        bool _deliveryDone
    ) public onlyAdminOrOwner {
        bytes32 _packageId = packageIdGenerator(msg.sender);
        products[_packageId]._manufacturerAddress = _manufacturerAddress;
        products[_packageId]._carrierWalletAddress = _carrierWalletAddress;
        products[_packageId]._productName = _productName;
        products[_packageId]._expirationDate = _expirationDate;
        products[_packageId]._deliveryDone = _deliveryDone;

        userProducts[msg.sender].push(products[_packageId]);

        emit NewPackageCreated(
            _packageId,
            block.timestamp,
            _carrierWalletAddress
        );
    }

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
    function changePackageCarrier(bytes32 _packageId, address _newCarrier)
        public
    {
        require(
            msg.sender == products[_packageId]._carrierWalletAddress ||
                msg.sender == products[_packageId]._manufacturerAddress,
            "You are not the current Carrier of this product!"
        );

        products[_packageId]._carrierWalletAddress = _newCarrier;

        emit PackageCarrierChange(
            msg.sender,
            _newCarrier,
            _packageId,
            block.timestamp
        );
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
        require(
            msg.sender == products[_packageId]._carrierWalletAddress,
            "You are not the current Carrier of this product!"
        );

        products[_packageId]._deliveryDone = true;
        products[_packageId]._carrierWalletAddress = owner;

        emit PackageArrived(_packageId, block.timestamp, msg.sender);
    }

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
        require(
            msg.sender == products[_packageId]._manufacturerAddress,
            "You do not have permission do delete this package!"
        );

        delete products[_packageId];

        emit DeletePackage(_packageId, msg.sender);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the Owner!");
        _;
    }

    /**
     * @dev Throws if called by any account other than the admin or owner.
     */
    modifier onlyAdminOrOwner() {
        require(
            admins[msg.sender] == true || msg.sender == owner,
            "You are not the Admin!"
        );
        _;
    }
}
