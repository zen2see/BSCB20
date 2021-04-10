/* global ethers hre */
const diamond = require('../js/diamond-util/src/index.js')

function addCommas (nStr) {
  nStr += ''
  const x = nStr.split('.')
  let x1 = x[0]
  const x2 = x.length > 1 ? '.' + x[1] : ''
  var rgx = /(\d+)(\d{3})/
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2')
  }
  return x1 + x2
}

function strDisplay (str) {
  return addCommas(str.toString())
}

async function main (scriptName) {
  console.log('SCRIPT NAME:', scriptName)

  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  console.log('Account: ' + account)
  console.log('---')
  let tx
  let totalGasUsed = ethers.BigNumber.from('0')
  let receipt
  let vrfCoordinator
  let linkAddress
  let linkContract
  let keyHash
  let fee
  //let bscb20Diamond
  let ghstTokenContract
  let bscb721DiDiamond
  const gasLimit = 12300000
  const name = 'BSCB'
  const symbol = 'BSCB'

  if (hre.network.name === 'hardhat') {
    childChainManager = account
    //InitDiamond = account
    // const LinkTokenMock = await ethers.getContractFactory('LinkTokenMock')
    // linkContract = await LinkTokenMock.deploy()
    // await linkContract.deployed()
    // linkAddress = linkContract.address
    // keyHash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
    // fee = ethers.utils.parseEther('0.0001')
    
  } else if (hre.network.name === 'matic') {
    // childChainManager = '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa'
    // vrfCoordinator = '0x3d2341ADb2D31f1c5530cDC622016af293177AE0'
    // linkAddress = '0xb0897686c545045aFc77CF20eC7A532E3120E0F1'
    // keyHash = '0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da'
    // fee = ethers.utils.parseEther('0.0001')
    
    // // Matic ghst token address
    // ghstTokenContract = await ethers.getContractAt('GHSTFacet', '0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7')
    // ghstStakingDiamond = '0xA02d547512Bb90002807499F05495Fe9C4C3943f'

    // dao = 'todo' // await accounts[1].getAddress()
    // daoTreasury = 'todo'
    // rarityFarming = 'todo' // await accounts[2].getAddress()
    // pixelCraft = 'todo' // await accounts[3].getAddress()
  } else if (hre.network.name === 'kovan') {
    childChainManager = account
    // vrfCoordinator = '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9'
    // linkAddress = '0xa36085F69e2889c224210F603D836748e7dC0088'
    // keyHash = '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4'
    // fee = ethers.utils.parseEther('0.1')
    // ghstTokenContract = await ethers.getContractAt('GHSTFacet', '0xeDaA788Ee96a0749a2De48738f5dF0AA88E99ab5')
    // ghstStakingDiamond = '0xA4fF399Aa1BB21aBdd3FC689f46CCE0729d58DEd'
    
  }  else {
    throw Error('No network settings for ' + hre.network.name)
  }

  async function deployFacets (...facets) {
    const instances = []
    for (let facet of facets) {
      let constructorArgs = []
      if (Array.isArray(facet)) {
        console.log('beforesemic')
        ;[facet, constructorArgs] = facet
        console.log(facet);
        console.log("aftersemic " +constructorArgs);
      }
      console.log('After deployFacets in deploy script the constructorArgs' + constructorArgs)
      const factory = await ethers.getContractFactory(facet)
      const facetInstance = await factory.deploy(...constructorArgs)
      await facetInstance.deployed()
      const tx = facetInstance.deployTransaction
      const receipt = await tx.wait()
      console.log(`${facet} deploy gas used: ` + strDisplay(receipt.gasUsed))
      totalGasUsed = totalGasUsed.add(receipt.gasUsed)
      instances.push(facetInstance)
    }
    return instances
  }

  let [
    bscb20facet,
    //BSCB721Facet
  ] = await deployFacets(
    'contracts/bscb20Di/facets/BSCB20Facet.sol:BSCB20Facet'
    // 'contracts/bscb721/facets/BSCB721Facet.sol:BSCB721Facet'
  )

  if (hre.network.name === 'hardhat') {
    bscb721diamond = await diamond.deploy({
      diamondName: 'BSCB721Diamond',
      initDiamond: 'contracts/bscb721/InitDiamond.sol:InitDiamond',
      facets: [
        'BSCB721Facet'
      ],
      owner: account
    })
    bscb721Contract = await ethers.getContractAt('BSCB721Facet', bscb721Contract.address)
    console.log('BSCB729 diamond address:' + bscb721Contract.address)
  }

  
  // eslint-disable-next-line no-unused-vars
  const bscb20Diamond = await diamond.deploy({
    diamondName: 'BSCB20diamond',
    initDiamond: 'contracts/bscb20Di/InitDiamond.sol:InitDiamond',
    facets: [
      ['BSCB20Facet', bscb20facet]
    ],
    owner: account, 
    args: [[name, symbol]]
  })
  console.log('BSCB20 diamond address:' + bscb20Diamond.address)

  tx = bscb20Diamond.deployTransaction
  receipt = await tx.wait()
  console.log('BSCB20 diamond deploy gas used:' + strDisplay(receipt.gasUsed))
  totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  const diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', bscb20Diamond.address)
  // daoFacet = await ethers.getContractAt('VrfFacet', bscb20Diamond.address)
  bscb20Facet = await ethers.getContractAt('contracts/bscb20Di/facets/BSCB20Facet.sol:BSCB20Facet', bscb20Diamond.address)
  // aavegotchiGameFacet = await ethers.getContractAt('AavegotchiGameFacet', bscb20Diamond.address)
  // collateralFacet = await ethers.getContractAt('CollateralFacet', bscb20Diamond.address)
  // shopFacet = await ethers.getContractAt('ShopFacet', bscb20Diamond.address)
  // erc1155MarketplaceFacet = await ethers.getContractAt('ERC1155MarketplaceFacet', bscb20Diamond.address)
  // erc721MarketplaceFacet = await ethers.getContractAt('ERC721MarketplaceFacet', bscb20Diamond.address)
  // bridgeFacet = await ethers.getContractAt('contracts/Aavegotchi/facets/BridgeFacet.sol:BridgeFacet', bscb20Diamond.address)

  // add collateral info

  // console.log('Adding Collateral Types')

  // if (hre.network.name === 'hardhat') {
  //   // const { getCollaterals } = require('./collateralTypes.js')
  //   const { getCollaterals } = require('./testCollateralTypes.js')
  //   tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, ghstTokenContract.address))
  // } else if (hre.network.name === 'mumbai') {
  //   // const { getCollaterals } = require('./collateralTypes.js')
  //   const { getCollaterals } = require('./testCollateralTypes.js')
  //   tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, ghstTokenContract.address))
  // } else {
  //   const { getCollaterals } = require('./collateralTypes.js')
  //   tx = await daoFacet.addCollateralTypes(getCollaterals(hre.network.name, ghstTokenContract.address))
  // }
  // receipt = await tx.wait()
  // console.log('Adding Collateral Types gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // console.log('Adding ticket categories')
  // // adding type categories
  // const ticketCategories = []
  // for (let i = 0; i < 6; i++) {
  //   ticketCategories.push({
  //     erc1155TokenAddress: ghstStakingDiamond,
  //     erc1155TypeId: i,
  //     category: 3
  //   })
  // }
  // tx = await erc1155MarketplaceFacet.setERC1155Categories(ticketCategories, { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding ticket categories gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // console.log('Adding Item Types')
  // itemsFacet = await ethers.getContractAt('contracts/Aavegotchi/facets/ItemsFacet.sol:ItemsFacet', bscb20Diamond.address)
  // itemsTransferFacet = await ethers.getContractAt('ItemsTransferFacet', bscb20Diamond.address)

  // const { itemTypes } = require('./itemTypes.js')

  // tx = await daoFacet.addItemTypes(itemTypes.slice(0, itemTypes.length / 4), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice(itemTypes.length / 4, (itemTypes.length / 4) * 2), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 2, (itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }
  // console.log('Adding Item Types gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // tx = await daoFacet.addItemTypes(itemTypes.slice((itemTypes.length / 4) * 3), { gasLimit: gasLimit })
  // receipt = await tx.wait()
  // if (!receipt.status) {
  //   throw Error(`Error:: ${tx.hash}`)
  // }

  // // add wearable types info
  // console.log('Adding Wearable Sets')
  // tx = await daoFacet.addWearableSets(wearableSets.slice(0, wearableSets.length / 2))
  // receipt = await tx.wait()
  // console.log('Adding Wearable Sets gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // add wearable types info
  // console.log('Adding Wearable Sets')
  // tx = await daoFacet.addWearableSets(wearableSets.slice(wearableSets.length / 2))
  // receipt = await tx.wait()
  // console.log('Adding Wearable Sets gas used::' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)

  // // ----------------------------------------------------------------
  // // Upload Svg layers
  // svgFacet = await ethers.getContractAt('SvgFacet', bscb20Diamond.address)

  // function setupSvg (...svgData) {
  //   const svgTypesAndSizes = []
  //   const svgs = []
  //   for (const [svgType, svg] of svgData) {
  //     svgs.push(svg.join(''))
  //     svgTypesAndSizes.push([ethers.utils.formatBytes32String(svgType), svg.map(value => value.length)])
  //   }
  //   return [svgs.join(''), svgTypesAndSizes]
  // }

  // // eslint-disable-next-line no-unused-vars
  // function printSizeInfo (svgTypesAndSizes) {
  //   console.log('------------- SVG Size Info ---------------')
  //   let sizes = 0
  //   for (const [svgType, size] of svgTypesAndSizes) {
  //     console.log(ethers.utils.parseBytes32String(svgType) + ':' + size)
  //     for (const nextSize of size) {
  //       sizes += nextSize
  //     }
  //   }
  //   console.log('Total sizes:' + sizes)
  // }
  // console.log('Uploading Wearable Svgs')
  // let svg, svgTypesAndSizes
  // console.log('Number of wearables:' + wearablesSvgs.length)
  // let svgItemsStart = 0
  // let svgItemsEnd = 0
  // while (true) {
  //   let itemsSize = 0
  //   while (true) {
  //     if (svgItemsEnd === wearablesSvgs.length) {
  //       break
  //     }
  //     itemsSize += wearablesSvgs[svgItemsEnd].length
  //     if (itemsSize > 24576) {
  //       break
  //     }
  //     svgItemsEnd++
  //   }
  //   ;[svg, svgTypesAndSizes] = setupSvg(
  //     ['wearables', wearablesSvgs.slice(svgItemsStart, svgItemsEnd)]
  //   )
  //   console.log(`Uploading ${svgItemsStart} to ${svgItemsEnd} wearable SVGs`)
  //   printSizeInfo(svgTypesAndSizes)
  //   tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  //   receipt = await tx.wait()
  //   console.log('Gas used:' + strDisplay(receipt.gasUsed))
  //   console.log('-------------------------------------------')
  //   totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  //   if (svgItemsEnd === wearablesSvgs.length) {
  //     break
  //   }
  //   svgItemsStart = svgItemsEnd
  // }

  // // --------------------------------
  // console.log('Uploading aavegotchi SVGs')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['aavegotchi', aavegotchiSvgs]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // console.log('Uploading collaterals and eyeShapes')
  // ;[svg, svgTypesAndSizes] = setupSvg(
  //   ['collaterals', collateralsSvgs],
  //   ['eyeShapes', eyeShapeSvgs]
  // )
  // printSizeInfo(svgTypesAndSizes)
  // tx = await svgFacet.storeSvg(svg, svgTypesAndSizes)
  // console.log('Uploaded SVGs')
  // receipt = await tx.wait()
  // console.log('Gas used:' + strDisplay(receipt.gasUsed))
  // totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // console.log('-------------------------------------------')

  // // if (hre.network.name === 'matic') {
  //   // transfer ownership
  //   const newOwner = '0x94cb5C277FCC64C274Bd30847f0821077B231022'
  //   console.log('Transferring ownership of diamond: ' + bscb20Diamond.address)
  //   const diamond = await ethers.getContractAt('OwnershipFacet', bscb20Diamond.address)
  //   const tx = await diamond.transferOwnership(newOwner)
  //   console.log('Transaction hash: ' + tx.hash)
  //   receipt = await tx.wait()
  //   console.log('Transfer Transaction complete')
  //   console.log('Gas used:' + strDisplay(receipt.gasUsed))
  //   totalGasUsed = totalGasUsed.add(receipt.gasUsed)
  // // }

  console.log('Total gas used: ' + strDisplay(totalGasUsed))
  return {
    account: account,
    bscb20Diamond: bscb20Diamond,
    diamondLoupeFacet: diamondLoupeFacet,
    bscb20facet: bscb20facet
    // bridgeFacet: bridgeFacet,
    // ghstTokenContract: ghstTokenContract,
    // itemsFacet: itemsFacet,
    // itemsTransferFacet: itemsTransferFacet,
    // aavegotchiFacet: aavegotchiFacet,
    // aavegotchiGameFacet: aavegotchiGameFacet,
    // collateralFacet: collateralFacet,
    // vrfFacet: vrfFacet,
    // daoFacet: daoFacet,
    // svgFacet: svgFacet,
    // erc1155MarketplaceFacet: erc1155MarketplaceFacet,
    // erc721MarketplaceFacet: erc721MarketplaceFacet,
    // shopFacet: shopFacet,
    // linkAddress: linkAddress,
    // linkContract: linkContract
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}

exports.deployProject = main
