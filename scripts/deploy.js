const hre = require("hardhat");

async function main() {
  const PunkyFunky = await hre.ethers.getContractFactory("PunkyFunky");
  const punkyFunky = await PunkyFunky.deploy(600, 2);

  await punkyFunky.deployed();
  console.log("Punky Funky Deployed:", punkyFunky.address);
  // Check if the contract object is properly initialized
  if (punkyFunky && punkyFunky.address && typeof punkyFunky.balanceOf === 'function') {
    console.log('Contract object is properly initialized');
  } else {
    console.log('Contract object is not properly initialized');
  }
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
