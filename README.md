<div align="center">
<img src="src/cold-chain-logo.png" width=25% />
</div>

<div align="center">
<img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge&logo=appveyor">
<img src="https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=Ethereum&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" />
<img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
<img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" />
<img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" />
<img src="https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white" />
<img src="https://img.shields.io/badge/c-%2300599C.svg?style=for-the-badge&logo=c&logoColor=white" />
</div>
	
<h1>❄ Soğuk Tedarik Zinciri</h1>
<h3>Eczane/ilaç hırsızlığının, nakliye sırasında sıcaklık sapmalarının kaçınılmaz olduğu merkezi veritabanı sistemlerini çözmeye adanmış basit, şeffaf, fakat aynı zamanda verimli tamamen merkeziyetsiz soğuk tedarik zinciri.</h3>
</div>

## 📦 Kurulum

### Nodejs ve npm gereksinimleri
```shell
git clone https://github.com/medipolchain/supply-chain.git

cd supply-chain

npm i
```

### Python kütüphaneleri
```shell
pip install -r requirements.txt
```

## 📂 Klasör yapısı
```
+---Arduino-Web3
+---backend
|   +---src
|   |   +---config
|   |   +---contract
|   |   |   +---ABIs
|   |   +---db
|   |   +---middleware
|   |   +---models
|   |   +---routers
|   |   +---web3
+---client
|   +---components
|   |   +---hooks
|   |   +---providers
|   |   |   +---web3
|   |   |   |   +---hooks
|   |   +---ui
|   |   |   +---AdminContent
|   |   |   |   +---base
|   |   |   +---ConnectButton
|   |   |   |   +---base
|   |   |   +---Layout
|   |   |   +---MetamaskSVG
|   |   |   +---RestrictedArea
|   |   |   |   +---base
|   |   |   +---SettingsModal
|   |   |   |   +---base
|   +---pages
|   +---public
|   |   +---contracts
|   +---styles
|   +---utils
+---contracts
+---scripts
+---src
+---test
```

## 📍 Akış diyagramı
![Akış diyagramı](src/diagram.png)

## 📝 Veritabanı yapısı
```js
address owner x
mapping(address => bool) public admins; x
mapping(bytes32 => Product) public products; x

struct Product {
	address _admin,
	address _currentCarrier,
	bool _deliveryDone
} x

event OwnerChanged x 
event AdminAdded x 
event AdminRemoved x
event PackageCarrierChange x
event NewPackageCreated x
event PackageArrived x
event DeletePackage x
event TemperatureViolated x
event SetPackageAdmin x
event SetPackageDeliveryDoneOrUndone x

function addAdmin x Owner
function removeAdmin x Owner
function transferOwnership x Owner
function createDeliveryPackage x Owner, Admin
function deleteDeliveryPackage x Owner, Admin
function changePackageCarrier x Owner, Admin, Current Carrier 
function packageArrived x Owner, Admin, Current Carrier
function temperatureViolate x Owner, Admin

function setPackageDeliveryDoneOrUndone x Owner, Admin
function setPackageAdmin x Owner
function getPackageDeliveryDone x 
function getPackageAdmin x
function getPackageCurrentCarrier x

modifier onlyOwner() x
modifier onlyAdminOrOwner() x
```

## 📸 Ekran görüntüleri
||||
| ------------- | ------------- | ------------- |
|![Screen Shot 2022-05-15 at 07 57 42](https://user-images.githubusercontent.com/77115599/168457954-aa163517-c0e9-4f16-b109-37635dbcf6b1.jpg)|![Screen Shot 2022-05-15 at 07 58 22](https://user-images.githubusercontent.com/77115599/168457955-df9f0f20-0e61-4176-962e-2b74990179b7.jpg)|![Screen Shot 2022-05-15 at 07 58 33](https://user-images.githubusercontent.com/77115599/168457956-82b8e49f-4060-448b-b32c-604f30ddb82f.jpg)|

## 🎥 Ekran kaydı
|Metamask Connection and Admin Panel Transition|Create Product Through Admin Panel|Mail Notification Subscription|Heat Sensor and Blockchain Transaction IoT|
| ------------- | ------------- | ------------- | ------------- |
|[![Watch the video](https://img.youtube.com/vi/YMg4wP34dS4/maxresdefault.jpg)](https://www.youtube.com/watch?v=YMg4wP34dS4)|[![Watch the video](https://img.youtube.com/vi/8KDqg36Ajqs/maxresdefault.jpg)](https://www.youtube.com/watch?v=8KDqg36Ajqs)|[![Watch the video](https://img.youtube.com/vi/P_YzSvvrf5k/maxresdefault.jpg)](https://www.youtube.com/watch?v=P_YzSvvrf5k)|[![Watch the video](https://i3.ytimg.com/vi/Sc31JmGvMy0/hqdefault.jpg)](https://www.youtube.com/watch?v=Sc31JmGvMy0)|

## 🤝 Takım üyeleri
[Berkay Ermiş - @berkayermis](https://github.com/berkayermis) - Frontend / IoT

[Mehmet Berat Öztürk - BeratOz01](https://github.com/BeratOz01) - Frontend / Backend

[Vusal Ismayilov - @woosal1337](https://github.com/woosal1337) - Solidity / IoT

[Furkan Boyraz - @hellomrbj](https://twitter.com/hellomrbj) - Blockchain / Security

## 📝 Lisans
[MIT](https://opensource.org/licenses/MIT): License
