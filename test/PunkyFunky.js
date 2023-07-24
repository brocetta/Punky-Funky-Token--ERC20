const { expect } = require("chai");
const hre = require ("hardhat");

describe('PunkyFunky Contract', () => {
    let token;
    let punkyFunkyToken;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 600;
    let tokenBlockReward = 2;

    beforeEach(async function () {
        // Get the ContractFactory and Signers here.
        token = await ethers.getContractFactory("PunkyFunky");
        [owner, addr1, addr2] = await hre.ethers.getSigners();
    
        punkyFunkyToken = await token.deploy(tokenCap, tokenBlockReward);
      });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
          expect(await punkyFunkyToken.owner()).to.equal(owner.address);
        });
    
        it("Should assign the total supply of tokens to the owner", async function () {
          const ownerBalance = await punkyFunkyToken.balanceOf(owner.address);
          expect(await punkyFunkyToken.totalSupply()).to.equal(ownerBalance);
        });
    
        it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await punkyFunkyToken.cap();
            const capInEther = Number(cap) / 1e18; // Convert to Ether
            expect(capInEther).to.equal(tokenCap);
          });
    
          it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await punkyFunkyToken.blockReward();
            const blockRewardInEther = Number(blockReward) / 1e18; // Convert to Ether
            expect(blockRewardInEther).to.equal(tokenBlockReward);
          });
      });
    
    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            // Transfer 50 tokens from owner to addr1
            await punkyFunkyToken.transfer(addr1.address, 50);
            const addr1Balance = await punkyFunkyToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);
            
            // Transfer 50 tokens from addr1 to addr2
            // We use .connect(signer) to send a transaction from another account
            await punkyFunkyToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await punkyFunkyToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
        
        it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await punkyFunkyToken.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
          punkyFunkyToken.connect(addr1).transfer(owner.address, 1)
          ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
          
          // Owner balance shouldn't have changed.
          expect(await punkyFunkyToken.balanceOf(owner.address)).to.equal(
              initialOwnerBalance
              );
            });
            
            it("Should update balances after transfers", async function () {
                const initialOwnerBalance = await punkyFunkyToken.balanceOf(owner.address);
              
                // Transfer 100 tokens from owner to addr1.
                await punkyFunkyToken.transfer(addr1.address, 100);
              
                // Transfer another 50 tokens from owner to addr2.
                await punkyFunkyToken.transfer(addr2.address, 50);
              
                // Check balances.
                const finalOwnerBalance = await punkyFunkyToken.balanceOf(owner.address);
                expect(Number(finalOwnerBalance)).to.equal(Number(initialOwnerBalance) - 150);
              
                const addr1Balance = await punkyFunkyToken.balanceOf(addr1.address);
                expect(Number(addr1Balance)).to.equal(100);
              
                const addr2Balance = await punkyFunkyToken.balanceOf(addr2.address);
                expect(Number(addr2Balance)).to.equal(50);
              });
              
              
        });
    });