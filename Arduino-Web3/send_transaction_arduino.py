import sys
# Importing Libraries
from serial import Serial
from web3 import Web3
from dotenv import dotenv_values

arduino = Serial(port='COM3', baudrate=9600, timeout=.1)


def trigger():
    config = dotenv_values('.env')
    print(config['PRIVATE_KEY'])
    w3 = Web3(Web3.HTTPProvider("https://api.avax-test.network/ext/bc/C/rpc"))

    abi = '''[
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "AdminAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "AdminRemoved",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_deletedBy",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "DeletePackage",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_currentCarrier",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "NewPackageCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_newOwner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "OwnerChanged",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_currentCarrier",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "PackageArrived",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_sender",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "PackageCarrierChange",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_oldAdmin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "address",
                    "name": "_newAdmin",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "SetPackageAdmin",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "_previousDeliveryStatus",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "_newDeliveryStatus",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "SetPackageDeliveryDoneOrUndone",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "_currentCarrier",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "_timestamp",
                    "type": "uint256"
                }
            ],
            "name": "TemperatureViolated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                }
            ],
            "name": "addAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "admins",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "internalType": "address",
                    "name": "_newCarrier",
                    "type": "address"
                }
            ],
            "name": "changePackageCarrier",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "internalType": "address",
                    "name": "_currentCarrier",
                    "type": "address"
                }
            ],
            "name": "createDeliveryPackage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "deletePackage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "getPackageAdmin",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "getPackageCurrentCarrier",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "getPackageDeliveryDone",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "packageArrived",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "name": "products",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "_currentCarrier",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "_deliveryDone",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_admin",
                    "type": "address"
                }
            ],
            "name": "removeAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                },
                {
                    "internalType": "address",
                    "name": "_newAdmin",
                    "type": "address"
                }
            ],
            "name": "setPackageAdmin",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "setPackageDeliveryDoneOrUndone",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_packageId",
                    "type": "bytes32"
                }
            ],
            "name": "temperatureViolate",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]
    '''
    contractAddress = "0x5B4CfE32E5afae0683F77F64B76B3D8890a9A974"

    private_key = config['PRIVATE_KEY']

    contract = w3.eth.contract(
        address=contractAddress,
        abi=abi
    )

    nonce = w3.eth.get_transaction_count("0x9b3C59daa631807e9Eb80f473751cA6E8A3F5345")

    tx_data = {}
    tx_data["nonce"] = nonce  # You need to manually manage account nonce if you sign tx yourself
    tx_data["gas"] = 8000000
    tx_data["gasPrice"] = 25000000000

    transaction = contract.functions.temperatureViolate(
        '0x4c699181526c2bc4aa0ef5aa3f51062dbc5a3dcd4368e060112581f84410b7e0').buildTransaction(tx_data)

    signed_tx = w3.eth.account.sign_transaction(transaction, private_key)

    txn_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    txn_receipt = w3.eth.wait_for_transaction_receipt(txn_hash)

    print(txn_hash)
    print(txn_receipt)


def main():

    while True:
        data = arduino.readline()
        data = data.decode("utf-8") 
        
        if data:
            data = float(data)
            print("%.2f" % (data-22.0))

            # 2-8 C degree simulation (default is around 26 C)
            if data-22.0 >= 10.0:
                trigger()
                sys.exit() 


if __name__ == "__main__":
    main()
