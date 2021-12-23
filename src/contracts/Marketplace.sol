pragma solidity ^0.5.0;

contract Marketplace {
    string public name;
    uint256 public productCount = 0;
    mapping(uint256 => Product) public products;
    address payable ownerContract;

    struct Product {
        uint256 id;
        string name;
        uint256 price;
        address payable owner;
        bool sale;
    }

    event ProductCreated(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool sale
    );

    event ProductPurchased(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool sale
    );

    event ProductChanged(
        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool sale
    );

    constructor() public {
        name = "Dapp University Marketplace";
        ownerContract = address(msg.sender);
    }

    function createProduct(
        string memory _name,
        uint256 _price,
        bool _sale
    ) public {
        //Require a name
        require(bytes(_name).length > 0, "Enter a valid name");
        //Requiere a valid price
        require(_price > 0, "Enter a valid price");
        //Increment product count
        productCount++;
        //Create the product
        products[productCount] = Product(
            productCount,
            _name,
            _price,
            msg.sender,
            _sale
        );
        //Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, _sale);
    }

    function markForSale(uint256 _id, bool _sale) public {
        //Fetch the product and make a copy of it
        Product memory _product = products[_id];
        //Require that the buyer is not the seller
        require(
            msg.sender == _product.owner,
            "Only the contract owner can marked sale"
        );
        //Mark as purchased
        _product.sale = _sale;
        //Update the product
        products[_id] = _product;
        emit ProductChanged(
            productCount,
            _product.name,
            _product.price,
            _product.owner,
            _product.sale
        );
    }
   function updateProduct(uint256 _id, string memory _name, uint256 _price) public {
        //Fetch the product and make a copy of it
        Product memory _product = products[_id];
        //Require that the buyer is not the seller
        require(
            msg.sender == _product.owner,
            "Only the contract owner can marked sale"
        );
        //Mark as purchased
        _product.name = _name;
        _product.price = _price;
        //Update the product
        products[_id] = _product;
        emit ProductChanged(
            productCount,
            _product.name,
            _product.price,
            _product.owner,
            _product.sale
        );
    }

    function changePrice(uint256 _id, uint256 _price) public {
        //Fetch the product and make a copy of it
        Product memory _product = products[_id];
        //Require that the buyer is not the seller
        require(
            msg.sender == _product.owner,
            "Only the contract owner can change its value"
        );
        //Mark as purchased
        _product.price = _price;
        //Update the product
        products[_id] = _product;
        emit ProductChanged(
            productCount,
            _product.name,
            _product.price,
            _product.owner,
            _product.sale
        );
    }

    function purchaseProduct(uint256 _id) public payable {
        //Fetch the product and make a copy of it
        Product memory _product = products[_id];
        //Fetch the owner
        address payable _seller = _product.owner;
        //Make sure the product has valid id
        require(
            _product.id > 0 && _product.id <= productCount,
            "Enter valid id"
        );
        //Require that there is enough Ether in the transaction
        require(msg.value >= _product.price, "Transfer the correct amount");
        //Require that the buyer is not the seller
        require(msg.sender != _seller, "Buyer cannot be seller");
        //Require that Product is marked for sale
        require(_product.sale == true, "Product not marked for sale");
        //Transfer ownership to the buyer
        _product.owner = msg.sender;
        //Update the product
        products[_id] = _product;
        //Pay the seller by sending them Ether

        if (_seller == ownerContract) {
          address(_seller).transfer(msg.value);
        } else if ( msg.sender == ownerContract) {
          address(_seller).transfer((msg.value * 95) / 100);
        } else {
            address(_seller).transfer((msg.value * 95) / 100);
            address(ownerContract).transfer((msg.value * 5) / 100);
        }

        //Trigger an event
        emit ProductPurchased(
            productCount,
            _product.name,
            _product.price,
            msg.sender,
            false
        );
    }
}
