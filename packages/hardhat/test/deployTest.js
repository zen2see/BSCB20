/* global describe it before ethers */
const chai = require("chai"),
  expect = chai.expect;
const { deployProject } = require('../scripts/deploy.js')

// describe('Deploying Contracts', async function () {
//   this.timeout(300000)
//   before(async function () {
//     const deployVars = await deployProject('deployTest')
//     global.set = true
//     global.account = deployVars.account
//     global.bscb721Diamond = deployVars.bscb721DiDiamond
//       // global.bscb721Facet = deployVars.BSCB721Facet
//       // global.bscb20Facet = deployVars.BSCB20Facet
//       // global.ghstTokenContract = deployVars.ghstTokenContract
//       // global.vrfFacet = deployVars.vrfFacet
//       // global.svgFacet = deployVars.svgFacet
//     global.linkAddress = deployVars.linkAddress
//     global.linkContract = deployVars.linkContract
//     global.diamondLoupeFacet = deployVars.diamondLoupeFacet
//     global.metaTransactionsFacet = deployVars.metaTransactionsFacet
//   })
//   it('Should mint 10,000,000 BSCB20 tokens', async function () {
//     await global.bscb20Facet.mint()
//     const balance = await global.bscb20Facet.balanceOf(global.account)
//     const oneMillion = ethers.utils.parseEther('10000000')
//     expect(balance).to.equal(oneMillion)
//   })
// })
  
  before(async function () {
    const deployVars = await deployProject('deployTest')
    global.set = true
    global.account = deployVars.account
    // global.aavegotchiDiamond = deployVars.aavegotchiDiamond
    // global.bridgeFacet = deployVars.bridgeFacet
    // global.aavegotchiFacet = deployVars.aavegotchiFacet
    // global.aavegotchiGameFacet = deployVars.aavegotchiGameFacet
    // global.itemsFacet = deployVars.itemsFacet
    // global.itemsTransferFacet = deployVars.itemsTransferFacet
    // global.collateralFacet = deployVars.collateralFacet
    // global.shopFacet = deployVars.shopFacet
    // global.daoFacet = deployVars.daoFacet
    // global.ghstTokenContract = deployVars.ghstTokenContract
    // global.vrfFacet = deployVars.vrfFacet
    // global.svgFacet = deployVars.svgFacet
    global.bscb20Facet = deployVars.bscb20Facet
    global.linkAddress = deployVars.linkAddress
    global.linkContract = deployVars.linkContract
    global.diamondLoupeFacet = deployVars.diamondLoupeFacet
    global.metaTransactionsFacet = deployVars.metaTransactionsFacet
  })
  it('Should mint 10,000,000 bscb20 tokens', async function () {
    await global.bscb20Facet.mint()
    const balance = await global.bscb20Facet.balanceOf(account);
    const oneMillion = ethers.utils.parseEther('10000000')
    expect(balance).to.eql(oneMillion)
  })

