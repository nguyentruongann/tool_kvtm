const core = require('./core')
const { PlantSlotList, AchievementKeys, FriendHouseList } = require('./const')

const openGame = async (driver, gameOptions = {}, index) => {
    const { openGame } = gameOptions
    const needOpen = openGame && index == 0
    needOpen ? await core.openGame(driver) : await driver.setCurrentWindowSize()
}

const openChests = async (driver, gameOptions = {}) => {
    const { openChests } = gameOptions
    openChests && (await core.openChests(driver))
}

const produceItems = async (driver, gameOptions = {}, index, auto, gameName, frequencyIndex) => {
    const { runAuto } = gameOptions
    const isLast = index === 9
    const isFirstRun = frequencyIndex === 0 && index === 0

    switch (runAuto) {
        case auto[gameName][0].key:
            await produceItems_1(driver, isLast)
            break

        case auto[gameName][1].key:
            await produceItems_2(driver, isLast)
            break

        case auto[gameName][2].key:
            await produceItems_3(driver, isLast)
            break

        case auto[gameName][3].key:
            await plantEventTree(driver, index)
            break

        case auto[gameName][4].key:
            await buyEventItem8Slot(driver, isFirstRun)
            break

        case auto[gameName][13].key:
            await getAchievement(driver, AchievementKeys.GapNhauMoiNgay)
            break

        case auto[gameName][14].key:
            await produceItems_4(driver, isLast)
            break

        case auto[gameName][15].key:
            await produceItems_5(driver, isLast)
            break

        case auto[gameName][16].key:
            await produceItems_6(driver, isLast)
            break

        case auto[gameName][17].key:
            await produceItems_7(driver, isLast)
            break

        default:
            break
    }
}

const sellItems = async (driver, gameOptions, auto, gameName) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    switch (runAuto) {
        case auto[gameName][0].key:
            await sellItems_1(driver)
            break

        case auto[gameName][1].key:
            await sellItems_2(driver)
            break

        case auto[gameName][2].key:
            await sellAndRemoveItems_3(driver)
            break

        case auto[gameName][5].key:
            await sellEventItem(driver, EventKeys.ga, false)
            break

        case auto[gameName][6].key:
            await sellEventItem(driver, EventKeys.bo, false)
            break

        case auto[gameName][7].key:
            await sellEventItem(driver, EventKeys.heo, false)
            break

        case auto[gameName][8].key:
            await sellEventItem(driver, EventKeys.cuu, false)
            break

        case auto[gameName][9].key:
            await sellEventItem(driver, EventKeys.ga)
            break

        case auto[gameName][10].key:
            await sellEventItem(driver, EventKeys.bo)
            break

        case auto[gameName][11].key:
            await sellEventItem(driver, EventKeys.heo)
            break

        case auto[gameName][12].key:
            await sellEventItem(driver, EventKeys.cuu)
            break

        case auto[gameName][14].key:
            await sellItems_4(driver)
            break

        case auto[gameName][15].key:
            await sellItems_5(driver)
            break

        case auto[gameName][16].key:
            await sellItems_6(driver)
            break

        case auto[gameName][17].key:
            await sellItems_7(driver)
            break

        default:
            break
    }
}

module.exports = {
    openGame,
    openChests,
    produceItems,
    sellItems,
}

// define auto function

const { SellItemOptions, ProductKeys, TreeKeys, EventKeys } = require('./const')

//#region HongSay-NuocTao
const sellItems_1 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.hongSay, value: 8 },
        { key: ProductKeys.nuocTao, value: 6 },
    ])
}
const produceItems_1 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
            await sellItems_1(driver);
            // await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            // await sellItems_5(driver);
            await core.goUp(driver);
            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goDownLast(driver);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");
            // Bắt đầu quy trình sản xuất
            for (let a = 1; a < 999; a++) {
                for (let j = 0; j < 5; j++) {
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 0, 8);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 0, 6);
                    await driver.sleep(1);
                    await core.goDownLast(driver);

                    for (let i = 0; i < 2; i++) {
                        await core.goUp(driver);
                        let slotTree = await core.findTreeOnScreen(driver, TreeKeys.hong);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.tao, false);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        
                        await core.goDownLast(driver);
                        await driver.sleep(1);
                    }

                    if (j != 4) {
                        await driver.sleep(5);
                    } else {
                        await sellItems_1(driver);
                        await driver.sleep(2);
                    }
                }
                if(a%4==0){
                    await core.openGame(driver);
                }
                 
            }
            // Nếu không có lỗi, thoát vòng lặp
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
}




//#endregion

//#region nuoc chanh- vai tim
const sellItems_2 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.nuocChanh, value: 9 },
        { key: ProductKeys.vaiTim, value: 8 },
    ])
}
const produceItems_2 = async (driver, isLast) => {
    // let slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh);
    // await core.plantTrees(driver, slotTree);
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
            await sellItems_2(driver);
            // await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            // await sellItems_5(driver);
            await core.goUp(driver);
            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(0.4);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goDownLast(driver);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");



            // Bắt đầu quy trình sản xuất
            for (let a = 1; a < 990; a++) {
                for (let j = 0; j < 11; j++) {
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 2, 8);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 3, 9);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 2, 8);
                    await driver.sleep(1); 
                    await driver.sleep(1);
                    await core.goDownLast(driver);

                    for (let i = 0; i < 2; i++) {
                        await core.goUp(driver);
                        let slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.plantTrees(driver, slotTree,1);//chanh
                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.oaiHuong);
                        await core.plantTrees(driver, slotTree);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.bong);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await core.goDownLast(driver);
                        await driver.sleep(1);
                    }

                    if (j != 10) {
                        await driver.sleep(1);
                    } else {
                        await sellItems_2(driver);
                    }
                }
                if(a%10==0){
                    await core.openGame(driver);
                }
                 
            }
            // Nếu không có lỗi, thoát vòng lặp
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
}

//#endregion

//#region nuoc hoa hong
const sellAndRemoveItems_3 = async (driver) => {
    // Sell Goods
    await core.sellAndRemoveItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.nuocHoaHong, value:12}
    ])
}

const produceItems_3 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
            await sellAndRemoveItems_3(driver);
            // await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            // await sellItems_5(driver);
            await core.goUp(driver);
            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                    await core.harvestTrees(driver);
                  
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                  
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                   
                    await core.goDownLast(driver);
                    await driver.sleep(1);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");

            // Hàng 1: Trồng và sản xuất Hồng sấy
            for (let a= 0;a< 999; a++) {
                for (let j = 0; j < 10 ; j++) {
                    // console.log('vp')
                    // await core.goUp(driver);
                    await core.goUp(driver);
                    // await core.makeItems(driver, 1, 3, 9);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 0, 6);
                    await driver.sleep(1); 
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 0, 6);
                    await driver.sleep(1); 
                    // await driver.sleep(1);
                    await core.goDownLast(driver);
                    await driver.sleep(0.75);

                        await core.goUp(driver);
                        let slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.plantTrees(driver, slotTree);//24
                       await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.hong, false);
                        await core.plantTrees(driver, slotTree);
                       await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.plantTrees(driver, slotTree);
                      await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.plantTrees(driver, slotTree,1);//30
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        
                        // await core.plantTrees(driver, slotTree);
                        
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        
                        // await core.plantTrees(driver, slotTree);
                        
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.hong);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await driver.sleep(0.4);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.plantTrees(driver, slotTree);//24
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                    if (j != 9) {
                        await driver.sleep(1);
                    } else {
                        await sellAndRemoveItems_3(driver); 
                        await driver.sleep(1);
                    }
                    
                }
                if (a % 4 == 0) {
                    await core.openGame(driver);
                }
        }
            // Nếu không có lỗi, thoát vòng lặp
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
    }


//#region HongSay-NuocTuyet
const sellItems_4 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.hongSay, value: 8 },
        { key: ProductKeys.nuocTuyet, value: 6 }
    ])
}
const produceItems_4 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
            await sellItems_4(driver);
            await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            // await sellItems_5(driver);

            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        
                        await core.goDownLast(driver);
                        await driver.sleep(1);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");

            // Bắt đầu quy trình sản xuất
            for (let a = 1; a < 99; a++) {
                for (let j = 0; j < 6; j++) {
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 0, 8);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 1, 6);
                    await driver.sleep(1);
                    await core.goDownLast(driver);

                    for (let i = 0; i < 2; i++) {
                        await core.goUp(driver);
                        let slotTree = await core.findTreeOnScreen(driver, TreeKeys.hong);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet, false);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        
                        await core.goDownLast(driver);
                        await driver.sleep(1);
                    }

                    if (j != 5) {
                        await driver.sleep(15);
                    } else {
                        await sellItems_4(driver);
                    }
                }
                if(a%5==0){
                    await core.openGame(driver);
                }
                 
            }
            // Nếu không có lỗi, thoát vòng lặp
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
    }

//#region DuaSay-NuocChanh
const sellItems_5 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.duaSay, value: 8 },
        { key: ProductKeys.nuocChanh, value: 9 }
    ])
}
const produceItems_5 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
            await sellItems_5(driver);
            await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            // await sellItems_5(driver);

            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");

            for (let a = 1; a < 99; a++) {
                for (let j = 0; j < 6; j++) {
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 3, 8);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 3, 9);
                    await driver.sleep(1);
                    await core.goDownLast(driver);
                    await driver.sleep(1);

                    for (let i = 0; i < 2; i++) {
                        await core.goUp(driver);
                        let slotTree = await core.findTreeOnScreen(driver, TreeKeys.dua);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                await core.goUp(driver);
                        slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh, false);
                        await core.plantTrees(driver, slotTree);
                        await driver.sleep(1);
                        await core.goUp(driver);
                await core.goUp(driver);
                        await core.plantTrees(driver, slotTree, 1);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);

                        await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goUp(driver);
                await core.goUp(driver);
                        await core.harvestTrees(driver);
                        await driver.sleep(1);
                        await core.goDownLast(driver);
                        await driver.sleep(1);
                    }

                    if (j != 5) {
                        await driver.sleep(15);
                    } else {
                        await sellItems_5(driver);
                    }
                    
                }
                if(a%7==0){
                    await core.openGame(driver);
                }
                 
            }
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
}


//#region HongSay
const sellItems_6 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.hongSay, value: 8 },

    ])
}

const produceItems_6 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);

            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await driver.sleep(1);
                await core.goDownLast(driver);
                await driver.sleep(1);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");

            // Hàng 1: Trồng và sản xuất Hồng sấy
    for (let a = 1; a < 99; a++) {
        for (let j = 0; j < 5; j++) {
      
            for (let i = 0; i < 2; i++) {
                await core.goUp(driver);
                let slotTree = await core.findTreeOnScreen(driver, TreeKeys.ev);
                await core.plantTrees(driver, slotTree);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.plantTrees(driver, slotTree);
                await driver.sleep(1);
        
                await core.goUp(driver);
                await core.goUp(driver);
                await core.plantTrees(driver, slotTree);
                await driver.sleep(1);
        
                await core.goUp(driver);
                await core.goUp(driver);
                await core.plantTrees(driver, slotTree);await driver.sleep(1);
        
                await core.goUp(driver);
                await core.goUp(driver);
                await core.plantTrees(driver, slotTree);
                await driver.sleep(1);
                await core.goDownLast(driver);
                await driver.sleep(1);

                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await driver.sleep(1);
                await core.goDownLast(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
            }

            
        }

    }
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
};


const sellItems_7 = async (driver) => {
    // Sell Goods
    await core.sellAndRemoveItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.tdTao, value: 6 }
    ])
}
//#region nuocChanh-TDTAo
const produceItems_7 = async (driver, isLast) => {
    let attempt = 0;
    const maxAttempts = 2; // Giới hạn số lần thử lại để tránh vòng lặp vô hạn
    
    while (true) {
        try {
            console.log(`🔄 Starting produceItems_5 attempt ${attempt + 1}`);
            await core.openGame(driver); // Mở lại game trước mỗi vòng lặp
            await driver.sleep(5);
           
            await sellItems_2(driver);
            await sellItems_7(driver);
            await core.goDownLast(driver); // Lướt xuống 1 lần để về giao diện chính
            await driver.sleep(2);
            await sellItems_5(driver);

            console.log("🔍 Checking tree availability...");
            let treesAvailable = await core.checkTreeAvailability(driver);
            console.log(`✅ Tree check result: ${treesAvailable ? "Trees found" : "No trees found"}`);

            if (treesAvailable) {
                console.log("🌳 Trees found. Proceeding with harvesting...");
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await driver.sleep(1);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await core.goUp(driver);
                await core.goUp(driver);
                await core.harvestTrees(driver);
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            } else {
                console.log("❌ No trees available. Returning to start screen...");
                await core.goDownLast(driver);
                await driver.sleep(0.4);
            }

            console.log("⚙️ Starting production loop...");

            for (let a = 1; a < 9999; a++) {
                for (let j = 0; j < 6; j++) {
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 3, 9);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.makeItems(driver, 1, 1, 6);
                    await driver.sleep(1);
                    await core.goDownLast(driver);
                    await driver.sleep(1);

                    await core.goUp(driver);
                    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet);
                    await core.plantTrees(driver, slotTree);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.plantTrees(driver, slotTree);//24
                    await core.goUp(driver);
                    await core.goUp(driver);
                    slotTree = await core.findTreeOnScreen(driver, TreeKeys.tao, false);
                    await core.plantTrees(driver, slotTree);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.plantTrees(driver, slotTree);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.plantTrees(driver, slotTree,1);//30
                    await driver.sleep(1);
                    await core.goDownLast(driver);

                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goDownLast(driver);
                    await driver.sleep(0.4);

                    await core.goUp(driver);
                    slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh, false);
                    await core.plantTrees(driver, slotTree);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.plantTrees(driver, slotTree);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.plantTrees(driver, slotTree);
                    await core.goDownLast(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await driver.sleep(1);
                    await core.goUp(driver);
                    await core.goUp(driver);
                    await core.harvestTrees(driver);
                    await core.goDownLast(driver);
                    if (j != 5) {
                        await driver.sleep(10);
                    } else {
                        
                        await sellItems_2(driver);
                        await sellItems_7(driver);
                    }
                    
                }
                if(a%9==0){
                    await core.openGame(driver);
                }
                 
            }
        } catch (error) {
            console.error(`⚠️ Error in produceItems_5: ${error.message}`);
            attempt++;
            if (attempt < maxAttempts) {
                console.log("🔄 Restarting game and retrying...");
                await core.openGame(driver);
                await driver.sleep(5);
            } else {
                console.log("🚨 Max retry attempts reached. Continuing execution...");
                attempt = 0;
            }
        }
    }
}


const plantEventTree = async (driver, index) => {
    const slotTree = PlantSlotList[4]

    if (index == 0) {
        await core.goUp(driver)
        // chac chan reset ve ban dau
        await core.findTreeOnScreen(driver, TreeKeys.hong)
        // trong cay
        for (let j = 0; j < 4; j++) {
            await core.plantTrees(driver, slotTree, 4)
            await core.goUp(driver, 2)
        }
        await core.plantTrees(driver, slotTree, 4)
        await core.goDownLast(driver)
        await driver.sleep(1)
    } else {
        await core.goUp(driver)
        // thu hoach cay
        for (let j = 0; j < 4; j++) {
            await core.harvestTrees(driver)
            await core.plantTrees(driver, slotTree, 4)
            await core.goUp(driver, 2)
        }
        await core.harvestTrees(driver)
        await core.plantTrees(driver, slotTree, 4)
        await core.goDownLast(driver)
    }

    if (index == 9) {
        await core.goUp(driver)
        // thu hoach cay
        for (let j = 0; j < 4; j++) {
            await core.harvestTrees(driver)
            await core.goUp(driver, 2)
        }
        await core.harvestTrees(driver)
        await core.goDownLast(driver)
    }
}

const sellEventItem = async (driver, itemKey, isAds = true) => {
    await core.sellEventItems(driver, itemKey, isAds)
}

const buyEventItem8Slot = async (driver, isFirst) => {
    isFirst && (await core.goFriendHouse(driver))
    await core.buy8SlotItem(driver)
}

const getAchievement = async (driver, key) => {
    switch (key) {
        case AchievementKeys.GapNhauMoiNgay:
            for (let i = 0; i < FriendHouseList.length; i++) {
                await core.goFriendHouse(driver, i)
            }
            break
        default:
            break
    }
}
