//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract ColdSupplyChain {

    address public owner;

    struct Package {
        address admin;
        address currentCarrier;
        string productName;
        uint expirationDate;
        bool deliveryDone;
        address[] carriers;
        uint[] timestamps;
        uint carrierFinished;
    }

    mapping(address => bool) public admins;
    mapping(bytes32 => Package) public packages;

    event OwnerChanged(address indexed oldOwner, address indexed newOwner, uint timestamp);
    event AdminAdded(address indexed admin, uint timestamp);
    event AdminRemoved(address indexed admin, uint timestamp);
    event NewPackageCreated(bytes32 packageId, address indexed admin, address indexed currentCarrier, string productName, uint expirationDate, address[] carriers, uint[] timestamps);
    event PackageCarrierChange(address indexed oldCarrier, address indexed newCarrier, address indexed changedByAddress, uint timestamp);
    event PackageArrived(bytes32 packageId, address currentCarrier, uint timestamp);
    event PackageDeleted(bytes32 packageId, address indexed deletedBy, uint timestamp);

    constructor() {
        assert(owner != msg.sender);
        
        owner = msg.sender;
        emit OwnerChanged(0x0000000000000000000000000000000000000000, owner, block.timestamp);
    }

    
    function addAdmin(address admin) public onlyOwner {
        admins[admin] = true;

        emit AdminAdded(admin, block.timestamp);
    }

    function removeAdmin(address admin) public onlyOwner {
        admins[admin] = false;

        emit AdminRemoved(admin, block.timestamp);
    }

    function packageIdGenerator(address carrier) public view returns (bytes32) {
        return keccak256(abi.encodePacked(
                carrier,
                block.timestamp));
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        address oldOwner = owner;
        owner = newOwner;

        emit OwnerChanged(oldOwner, newOwner, block.timestamp);
    }

    function createDeliveryPackage(address currentCarrier, string memory productName, uint expirationDate, address[] memory carriers, uint[] memory timestamps) public onlyAdminOrOwner {
        require(carriers.length >= 1, "No carrier was provided as an input! Add some carriers!");
        require(carriers.length == timestamps.length, "The number of the carriers and their according timestamp lengths are different! Make sure you enter the same number of carriers and timestamps!");

        bytes32 packageId = packageIdGenerator(carriers[0]);

        packages[packageId].admin = msg.sender;
        packages[packageId].currentCarrier = currentCarrier;
        packages[packageId].productName = productName;
        packages[packageId].expirationDate = expirationDate;
        packages[packageId].carriers = carriers;
        packages[packageId].timestamps = timestamps;

        emit NewPackageCreated(packageId, msg.sender, currentCarrier, productName, expirationDate, carriers, timestamps);
    }

    function changePackageCarrier(bytes32 packageId, address newCarrierAddress) public {
        require(packages[packageId].currentCarrier == msg.sender || packages[packageId].admin == msg.sender || msg.sender == owner, "You do not have an access to edit the carrier address of this package!");

        address oldCarrier = packages[packageId].currentCarrier;
        packages[packageId].currentCarrier = newCarrierAddress;
        packages[packageId].carrierFinished += 1;

        emit PackageCarrierChange(oldCarrier, newCarrierAddress, msg.sender, block.timestamp);
    }

    function deleteDeliveryPackage(bytes32 packageId) public {
        require(packages[packageId].admin == msg.sender, "You are not the admin of this package!");

        delete packages[packageId];

        emit PackageDeleted(packageId, msg.sender, block.timestamp);
    }


    modifier onlyOwner() {
        require(owner == msg.sender, "You are not the owner!");
        _;
    }

    modifier onlyAdminOrOwner() {
        require(admins[msg.sender] == true || owner == msg.sender, "You are not an admin or the owner!");
        _;
    }

}