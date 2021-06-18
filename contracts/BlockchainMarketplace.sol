pragma solidity ^0.5.16;

contract BlockchainMarketplace {

    string public name;

    // keep track on how many product exist
    uint256 public productCount = 0; 

    mapping(uint256 => Product) public products; // mapping to store the product on blockchain

    
    // Listing an item for selling

    struct Product{

        uint256 id;
        string name;
        uint256 price;
        address owner;   // person who owns the Product
        bool purchased;
    }

    event ProductCreated(

        uint256 id,
        string name,
        uint256 price, 
        address owner,
        bool purchased
    );

    constructor() public {

        name= "BlockchainMarketplace";
    }

    function createProduct(string memory _name, uint256 _price) public {

        productCount ++ ;

        //creating the product

        products[productCount]= Product(productCount, _name, _price, msg.sender, false);

        emit ProductCreated(productCount, _name, _price, msg.sender, false);


    }


}
