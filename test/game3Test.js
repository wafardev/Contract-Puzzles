const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game3", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game3");
    const game = await Game.deploy();

    // Hardhat will create 10 accounts for you by default
    // you can get one of this accounts with ethers.provider.getSigner
    // and passing in the zero-based indexed of the signer you want:
    const [signer, signer2, signer3] = await ethers.getSigners();

    // you can get that signer's address via .getAddress()
    // this variable is NOT used for Contract 3, just here as an example

    const signersArray = [signer, signer2, signer3];
    return { game, signersArray };
  }

  it("should be a winner", async function () {
    const { game, signersArray } = await loadFixture(
      deployContractAndSetVariables
    );

    // you'll need to update the `balances` mapping to win this stage
    // to call a contract as a signer you can use contract.connect
    await game.connect(signersArray[0]).buy({ value: "10" });

    await game.connect(signersArray[1]).buy({ value: "100" });

    await game.connect(signersArray[2]).buy({ value: "1" });

    // TODO: win expects three arguments
    await game.win(
      signersArray[0].address,
      signersArray[1].address,
      signersArray[2].address
    );

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
