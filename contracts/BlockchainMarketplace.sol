pragma solidity ^0.5.16;

contract BlockchainMarketplace {

    string public name;

    // keep track on how many product exist
    uint256 public productCount = 0; 

    mapping(uint256 => Product) public products; // mapping to store the product on blockchain

    
    // Listing an item for selling

    struct Product { 

        uint256 id;
        string name;
        uint256 price;
        address payable owner;   // person who owns the Product
        bool purchased;
    }

    event ProductCreated(

        uint256 id,
        string name,
        uint256 price, 
        address payable owner,
        bool purchased
    );

    event ProductPurchased(

        uint256 id,
        string name,
        uint256 price,
        address payable owner,
        bool purchased
    );


    constructor() public {

        name= "BlockchainMarketplace";
    }

    // 
    
    function createProduct(string memory _name, uint _price) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid price
        require(_price > 0);
        // Increment product count
        productCount ++;
        // Create the product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        // Trigger an event
        emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint256 _id) public  payable{

        //fetch the product

        Product memory _product= products[_id];     //instantiated new product
        
        //fetch the owner
        address payable _seller = _product.owner;

        //make sure the product is valid
        // make sure the product has valid id

        require(_product.id >0 && _product.id <= productCount);

        // require there is enough ether in transaction

        require(msg.value>= _product.price);

        // require that product has not been purchased already

        require(!_product.purchased);

        // require buyer is not the seller

        require(_seller!= msg.sender);

        
        //transfer the ownership to the buyer

        _product.owner= msg.sender;  //buyer is the one who call the function

        //marking as purchased

        _product.purchased=true;

        //update the product

        products[_id]= _product;

        //pay the seller by sending them ether

        address(_seller).transfer(msg.value);


        //trigger an event

        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender,true);


    }


}
