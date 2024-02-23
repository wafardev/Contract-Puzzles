const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }
  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);

    let randomSigner;

    const [signer] = await ethers.getSigners();
    const provider = signer.provider;

    let isValid = false;

    const number = parseInt("0x00ffffffffffffffffffffffffffffffffffffff");

    while (!isValid) {
      randomSigner = await ethers.Wallet.createRandom().connect(provider);

      if (randomSigner.address < number) {
        isValid = true;
      }
    }

    await signer.sendTransaction({
      to: randomSigner.address,
      value: ethers.utils.parseEther("1"),
    });

    await game.connect(randomSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
