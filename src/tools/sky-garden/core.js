const { KeyCode, SwipeDirection } = require('../../lib/webdriverio')
const {
    DelayTime,
    MakeSlotList,
    FirstRowSlotList,
    SecondRowSlotList,
    DefaultBasket,
    DefaultProduct,
    SellOptions,
    ItemKeys,
    SellItemOptions,
    SellSlotList,
    FriendHouseList,
    PlantSlotList,
    SlotPositions,
} = require('./const')
const backToGame = async (driver) => {
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.tap(56.88, 76.22)
    await driver.sleep(0.5)
}
const openGame = async (driver) => {
    // console.log("Bước 1: Ấn nút HOME và mở lại ứng dụng trò chơi");
    await driver.press(KeyCode.HOME)
    await driver.closeApp(ItemKeys.gameId)
    await driver.openApp(ItemKeys.gameId)
    await driver.sleep(5)

    // console.log("Bước 2: Reset kích thước cửa sổ hiện tại");
    await driver.setCurrentWindowSize()

    let count = 0
    let gamePosition = null
    // console.log("Bước 3: Kiểm tra và tìm vị trí trò chơi trên màn hình");
    while (!gamePosition) {
        if (count > 10) {
            // console.log("Không tìm thấy vị trí trò chơi sau 10 lần thử, thử lại từ đầu");
            return await openGame(driver)
        }
        gamePosition = await driver.getCoordinateItemOnScreen(ItemKeys.game, SlotPositions.p2)
        await driver.sleep(1)
        count++
    }
    // console.log(`Tìm thấy trò chơi tại vị trí: (${gamePosition.x}, ${gamePosition.y})`);

    // console.log("Bước 4: Chạm vào vị trí trò chơi");
    await driver.tap(gamePosition.x, gamePosition.y)
    await driver.sleep(40)

    // console.log("Bước 5: Reset kích thước cửa sổ sau khi mở trò chơi");
    await driver.setCurrentWindowSize()

    // console.log("Bước 6: Quay lại màn hình trước 10 lần");
    for (let i = 0; i < 5; i++) {
        console.log(`Bat dau sau ${4-i}`);
        await driver.press(KeyCode.BACK)
        await driver.sleep(15)
    }
    console.log('go!!')
    await driver.tap(58.75, 71.1)
    await driver.sleep(0.5)

    // console.log("Đã hoàn thành tất cả các bước, trò chơi và cửa hàng đã được mở thành công.");
}
const checkTreeAvailability = async (driver) => {
    try {
        console.log("🔍 Clicking to check if trees are available...");
        
        // Nhấn vào chậu cây để mở chế độ thu hoạch
        await driver.tap(39.27, 87.42);
        await driver.sleep(0.5);

        // Kiểm tra xem giỏ thu hoạch có xuất hiện không
        let basketExists = await driver.haveItemOnScreen(ItemKeys.harvestBasket, SlotPositions.p3);

        // Thoát khỏi chế độ thu hoạch nếu không tìm thấy giỏ
        await driver.press(KeyCode.BACK);
        await driver.sleep(0.5);

        if (basketExists) {
            console.log("✅ Trees are available for harvesting.");
            return true;
        } else {
            console.log("❌ No trees available.");
            return false;
        }
    } catch (error) {
        console.error("❌ Error checking tree availability:", error);
        return false;
    }
};

// Hàm mới để bán và xóa vật phẩm ngay sau khi đặt bán
const sellAndRemoveItems = async (driver, option, items) => {
    const { x: option_x, y: option_y } = SellOptions[option]

    // Mở chợ
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)
    // Xử lý tất cả vật phẩm
    let itemId = _getItemId(items)
    // let count = 0
    await driver.sleep(1)
    while (itemId) {
        var soldSlot = await driver.getCoordinateItemOnScreen(ItemKeys.soldSlot)
        if (soldSlot !== null) {
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            await driver.tap(option_x, option_y)
            const itemFound = await driver.getCoordinateItemOnScreen(itemId)

            if (!itemFound) {
                const item = items.find(x => x.key === itemId)

                if (item) {
                    item.value = 0
                }

                break
            }
            await driver.sleep(0.5)

            // Chọn vật phẩm bằng hình ảnh
            await driver.tapItemOnScreen(itemId)
            await _sell(driver)
            
            itemId = _getItemId(items)
            continue
        }

        // Kiểm tra ô trống để đặt vật phẩm
        var emptySlot = await driver.getCoordinateItemOnScreen(ItemKeys.emptySellSlot)
        if (emptySlot != null) {
            await driver.tap(emptySlot.x, emptySlot.y)
            await driver.sleep(0.3)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.1)
            const itemFound = await driver.getCoordinateItemOnScreen(itemId)

                    if (!itemFound) {
                        const item = items.find(x => x.key === itemId)

                        if (item) {
                            item.value = 0
                        }

                        break
                    }
            // Chọn vật phẩm bằng hình ảnh
            await driver.tapItemOnScreen(itemId)
            await _sell(driver)
            // await driver.sleep(1)
            // Nhấn lại vào ô vừa đặt để chọn vật phẩm (Ảnh 2)
            await driver.tap(emptySlot.x, emptySlot.y)
            // await driver.tapItemOnScreen(itemId)
            await driver.sleep(0.1)

            // Nhấn vào thùng rác để xóa vật phẩm (Ảnh 3)
            await driver.tapItemOnScreen(ItemKeys.thungRac, SlotPositions.p3p4)
            await driver.sleep(0.1)

            // Nhấn "Đồng ý" để xác nhận xóa
            await driver.tapItemOnScreen(ItemKeys.dongY, SlotPositions.p3p4)
            await driver.sleep(0.1)

            itemId = _getItemId(items)
            continue
        }
        
    }

    // Quay lại trò chơi sau khi bán và xóa hết vật phẩm
    await backToGame(driver)
    await driver.tap(58.75, 71.1)
}



const openChests = async (driver) => {
    let isFound = await driver.haveItemOnScreen(ItemKeys.chest, SlotPositions.p1)
    if (isFound) {
        await driver.tap(35.0, 22.22)
        await driver.sleep(0.2)
        await driver.tap(35.0, 22.22)
        await driver.sleep(0.5)
        await driver.tap(21.25, 78.89)
        await driver.sleep(0.2)
        await driver.tap(21.25, 78.89)
        await driver.sleep(0.5)
        for (let i = 0; i < 10; i++) {
            await driver.tap(50.0, 62.22)
            await driver.sleep(0.2)
        }
        //back to game
        await backToGame(driver)
    }
}



const goUp = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.swipe({ x: 50, y: 50 }, { x: 50, y: 90 }, SwipeDirection.DOWN)
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDown = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.swipe({ x: 50, y: 90 }, { x: 50, y: 50 }, SwipeDirection.UP)
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDownLast = async (driver) => {
    await goUp(driver)
    await driver.sleep(0.3)
    await driver.tap(50.63, 95.46)
    await driver.sleep(0.5)
}

const harvestTrees = async (driver) => {
    const { x, y } = DefaultBasket
    const pointList = [{ duration: 0, x: x, y: y }]
    const duration = DelayTime * 1000

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length; i++) {
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length; i++) {
        pointList.push({
            duration: duration,
            x: SecondRowSlotList[i].x,
            y: SecondRowSlotList[i].y,
        })
    }

    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)

    let count = 0
    while (!(await driver.haveItemOnScreen(ItemKeys.harvestBasket, SlotPositions.p3))) {
        if (count > 5) throw new Error(`Screen is not found ${ItemKeys.harvestBasket} item`)
        await driver.tap(37.5, 84.44)
        await driver.sleep(0.5)
        count++
    }

    await driver.action(pointList)
    await driver.sleep(0.5)
}

const plantTrees = async (driver, slotTree, floor = 2, pot = 5) => {
    const pointList = [{ duration: 0, x: slotTree.x, y: slotTree.y }]
    const duration = DelayTime * 1000
    // floor 1
    for (let i = 0; i < FirstRowSlotList.length && floor >= 1; i++) {
        if (i > 2 * pot && floor == 1) break
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length && floor >= 2; i++) {
        pointList.push({
            duration: duration,
            x: SecondRowSlotList[i].x,
            y: SecondRowSlotList[i].y,
        })
        if (i > 2 * pot && floor == 2) break
    }

    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)
    await driver.action(pointList)
    await driver.sleep(0.5)
}

const makeItems = async (driver, floor = 1, slot = 0, number = 1) => {
    // open
    const position = { x: 21.875, y: floor == 1 ? 81.11 : 32.22 }

    for (let i = 0; i < 10; i++) {
        await driver.tap(position.x, position.y)
        await driver.sleep(0.2)
    }
    // chan chan mo duoc o san xuat
    let count = 0
    do {
        if (count > 10) throw new Error(`Screen is not found ${ItemKeys.emptyProductionSlot} item`)
        await driver.tap(position.x, position.y)
        await driver.sleep(0.1)
        count++
    } while (!(await driver.haveItemOnScreen(ItemKeys.emptyProductionSlot, SlotPositions.p4)))

    // make goods
    const { x, y } = MakeSlotList[slot]

    for (let i = 0; i < number; i++) {
        await driver.action([
            { duration: 0, x: x, y: y },
            { duration: 100, x: DefaultProduct.x, y: DefaultProduct.y },
        ])
        await driver.sleep(0.4)
    } 
    // fix & close
    // console.log("sua may");
    // await driver.sleep(2)
    await driver.tap(15.47,75.6)
    await driver.sleep(0.5)
    await driver.tap(71.3, 69.07)
    await driver.sleep(0.5)
    await backToGame(driver)
    await driver.tap(58.75, 71.1)
}

const sellItems = async (driver, option, items) => {
    const { x: option_x, y: option_y } = SellOptions[option]

    // open
    await driver.tap(63.59, 75.25)
    await driver.sleep(1)

    // back front market
    await driver.action([
        { duration: 0, x: 21.5, y: 61.85 },
        { duration: 200, x: 74.5, y: 61.85 },
    ])
    await driver.sleep(0.5)

    // back front market
    await driver.action([
        { duration: 0, x: 21.5, y: 61.85 },
        { duration: 200, x: 74.5, y: 61.85 },
    ])
    await driver.sleep(0.5)

    // buy all items
    let itemId = _getItemId(items)
    let count = 0
    await driver.sleep(1);
    while (itemId) {
        var soldSlot = await driver.getCoordinateItemOnScreen(ItemKeys.soldSlot)
        if (soldSlot !== null) {
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            // await driver.tap(option_x, option_y)
            // await driver.sleep(0.5)

            // // choose item by image
            // await driver.tapItemOnScreen(itemId, SlotPositions.p1p3)
            // await _sell(driver)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            const itemFound = await driver.getCoordinateItemOnScreen(
                itemId,
                SlotPositions.p1p3
            )

            if (!itemFound) {
                const item = items.find(x => x.key === itemId)

                if (item) {
                    item.value = 0
                }

                itemId = _getItemId(items)
                continue
            }

            // choose item by image
            await driver.tapItemOnScreen(itemId, SlotPositions.p1p3)
            await _sell(driver)
            //
            itemId = _getItemId(items)

            continue
        }

        var emptySlot = await driver.getCoordinateItemOnScreen(ItemKeys.emptySellSlot)

        if (emptySlot != null) {
            await driver.tap(emptySlot.x, emptySlot.y)
            await driver.sleep(0.5)
            // await driver.tap(option_x, option_y)
            // await driver.sleep(0.5)

            // // choose item by image
            // await driver.tapItemOnScreen(itemId, SlotPositions.p1p3)
            // await _sell(driver)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            const itemFound = await driver.getCoordinateItemOnScreen(
                itemId,
                SlotPositions.p1p3
            )

            if (!itemFound) {
                const item = items.find(x => x.key === itemId)

                if (item) {
                    item.value = 0
                }

                itemId = _getItemId(items)
                continue
            }

            // choose item by image
            await driver.tapItemOnScreen(itemId, SlotPositions.p1p3)
            await _sell(driver)
            //
            itemId = _getItemId(items)
            continue
        }

        await driver.action([
            { duration: 0, x: 74.5, y: 61.85 },
            { duration: 3 * 1000, x: 21.5, y: 61.85 },
        ])
        await driver.sleep(0.5)
        count++

        if (count > 2) {
            // click ads
            await driver.tap(26.5, 42.26) // click first slot
            await driver.sleep(0.5)
            await driver.tap(47.26, 85.56)
            await driver.sleep(0.5)
            await backToGame(driver)
            await driver.tap(58.75, 71.1)
            await driver.sleep(0.5)
            await driver.tap(63.59, 75.25)
            await driver.sleep(1)
            // setup item
            _rollbackItem(items, itemId)
            return await sellItems(driver, option, items)
        }
    }
    await backToGame(driver)
    await driver.tap(58.75, 71.1)
}

const findTreeOnScreen = async (driver, treeKey, isFindNext = true) => {
    // while(1){
    //     await driver.tap(16.66, 74.63)
    // }
    await driver.tap(37.5, 88.04)
    await driver.sleep(0.5)

    let slotItem = await driver.getCoordinateItemOnScreen(treeKey, SlotPositions.p3)
    let retryCount = 0
    // console.log(`slotItem = ${slotItem}`);
    while (!slotItem) {
        isFindNext ? await driver.tap(41.42, 74.63) : await driver.tap(16.66, 74.63)
        await driver.sleep(0.5)

        slotItem = await driver.getCoordinateItemOnScreen(treeKey, SlotPositions.p3)
        retryCount++
        // console.log(`retryCoun = ${retryCount}`);
    }
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)

    return _getSlotNearest(slotItem)
}

const sellEventItems = async (driver, itemKey, isAds) => {
    const { x: option_x, y: option_y } = SellOptions[SellItemOptions.events] // event item
    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    for (let i = 0; i < SellSlotList.length; i++) {
        const slot = SellSlotList[i]
        // double tap on slot
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.1)
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.5)
        // switch to event item
        await driver.tap(option_x, option_y)
        await driver.sleep(0.5)

        const eventItemSlot = await driver.getCoordinateItemOnScreen(itemKey, SlotPositions.p1p3)
        if (!eventItemSlot) throw new Error(`Screen is not found ${itemKey} item`)

        await driver.tap(eventItemSlot.x, eventItemSlot.y)
        await _sell(driver, isAds)
    }
}

const buy8SlotItem = async (driver) => {
    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    for (let i = 0; i < SellSlotList.length; i++) {
        const slot = SellSlotList[i]
        // double tap on slot for buy
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.1)
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.5)
    }

    for (let i = 0; i < SellSlotList.length; i++) {
        const slot = SellSlotList[i]
        // double tap on slot for buy
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.1)
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.1)
    }

    await backToGame(driver)
}

const goFriendHouse = async (driver, index) => {
    const { x, y } = FriendHouseList[index]
    await driver.tapItemOnScreen(ItemKeys.friendHouse, SlotPositions.p4)
    await driver.sleep(0.5)
    await driver.tap(x, y)
    await driver.sleep(2)
}

const goMyHouse = async (driver) => {
    await driver.tapItemOnScreen(ItemKeys.myHouse, SlotPositions.p3)
    await driver.sleep(2)
}

module.exports = {
    openGame,
    openChests,
    goDown,
    goUp,
    goDownLast,
    backToGame,
    harvestTrees,
    plantTrees,
    makeItems,
    sellItems,
    sellAndRemoveItems,
    findTreeOnScreen,
    sellEventItems,
    buy8SlotItem,
    goFriendHouse,
    goMyHouse,
    checkTreeAvailability, // Đảm bảo hàm này được export
};



// private method

const _getItemId = (items) => {
    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.value > 0)
        if (foundIndex >= 0) {
            items[foundIndex].value--
            return items[foundIndex].key
        }
        return null
    }

    return null
}

const _rollbackItem = (items, key) => {
    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.key == key)
        if (foundIndex >= 0) {
            items[foundIndex].value++
        }
    }
}

const _sell = async (driver, isAds = true) => {
    await driver.sleep(0.5)
    // increase price
    for (let i = 0; i < 10; i++) {
        await driver.tap(85.03, 60.41)
        await driver.sleep(DelayTime)
        await driver.tap(85.03, 48.45)
        await driver.sleep(DelayTime)
    }
    await driver.sleep(0.5)
    // stop increase price
    if (!isAds) {
        // disable ads
        await driver.tap(77.3, 75.87)
        await driver.sleep(0.5)
        // click sell
        await driver.tap(78.17, 84.74)
        await driver.sleep(0.5)
        // await driver.tap(62.5, 7.78)
        // await driver.sleep(0.5)
    } else {
        // click sell
        await driver.tap(78.17, 84.74)
        await driver.sleep(0.5)
        // await driver.tap(50.0, 93.33)
        // await driver.sleep(0.5)
        // await driver.tap(62.5, 7.78)
        // await driver.sleep(0.5)
    }
}




const _getSlotNearest = (slotFound) => {
    let min = Number.MAX_VALUE
    let choice = 0
    for (let i = 0; i < PlantSlotList.length; i++) {
        let slot = PlantSlotList[i]
        let value = Math.abs(slot.x - slotFound.x) * Math.abs(slot.x - slotFound.x) + Math.abs(slot.y - slotFound.y) * Math.abs(slot.y - slotFound.y)

        if (value < min) {
            min = value
            choice = i
        }
    }
    return PlantSlotList[choice]
}
