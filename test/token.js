const { expect } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');

describe('MyToken', function () {
  let MyToken, myToken;
  let owner, addr1, addr2;

  beforeEach(async function () {
    MyToken = await ethers.getContractFactory('MyToken');
    [owner, addr1, addr2, _] = await ethers.getSigners();

    myToken = await MyToken.deploy();
    await myToken.waitForDeployment(); 
  });

  describe('Deployment', function () {
    it('Should assign the total supply of tokens to the owner', async function () {
      const ownerBalance = await myToken.balanceOf(owner.address);
      expect(await myToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe('Transactions', function () {
    it('Should transfer tokens between accounts', async function () {
      await myToken.transfer(addr1.address, 50);
      expect(await myToken.balanceOf(addr1.address)).to.equal(50);

      await myToken.connect(addr1).transfer(addr2.address, 50);
      expect(await myToken.balanceOf(addr2.address)).to.equal(50);
    });

       
  });

  describe('Minting', function () {
    it('Should mint new tokens to specified address', async function () {
      const mintAmount = 100;
      await myToken.mint(addr1.address, mintAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(mintAmount);
    });

    
    
  });

});
