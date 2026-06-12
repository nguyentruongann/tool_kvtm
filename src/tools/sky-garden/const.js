const DelayTime = 0.005 // 5 ms

const DefaultBasket = { x: 32.41, y: 66.39 }

const DefaultProduct = { x: 41.14, y: 54.84}

const FirstRowSlotList = [
    { x: 36.875, y: 81.23 }, // 0
    { x: 41.375, y: 81.23 },
    { x: 45.875, y: 81.23 }, // 1
    { x: 50.1875, y: 81.23 },
    { x: 54.5, y: 81.23 }, // 2
    { x: 59.0625, y: 81.23 },
    { x: 63.625, y: 81.23 }, // 3
    { x: 68.0625, y: 81.23 },
    { x: 72.5, y: 81.23 }, // 4
    { x: 76.8125, y: 81.23 },
    { x: 81.125, y: 81.23 }, // 5
    { x: 84.0, y: 78.2 },
    { x: 84.0, y: 68.2 },
    { x: 84.0, y: 58.2 },
    { x: 84.0, y: 48.2 },
]

const SecondRowSlotList = [
    { x: 84.0, y: 43.0 },
    { x: 81.125, y: 41.23 }, // 0
    { x: 76.8125, y: 41.23 },
    { x: 72.5, y: 41.23 }, // 1
    { x: 68.0625, y: 41.23 },
    { x: 63.625, y: 41.23 }, // 2
    { x: 59.0625, y: 41.23 },
    { x: 54.5, y: 41.23 }, // 3
    { x: 50.1875, y: 41.23 },
    { x: 45.875, y: 41.23 }, // 4
    { x: 41.375, y: 41.23 },
    { x: 36.875, y: 41.23 }, // 5
    { x: 30.1, y: 43.0 },
]

const PlantSlotList = [
    //[0, 1, 2]
    //[3, 4]
    { x: 22.06, y: 70.1},
    { x: 29.42, y: 70.1 },
    { x: 36.65, y: 70.1 },
    { x: 22.19, y: 82.47 },
    { x: 29.1, y: 82.47 },
]

const MakeSlotList = [
    //[0, 1, 2]
    //   [3, 4]
    { x: 46.63, y: 34.43 },
    { x: 52.36, y: 34.43 },
    { x: 58.6, y: 34.43 },
    { x: 52.36, y: 45.36 },
    { x: 58.6, y: 45.36 },
]

const SellItemOptions = {
    tree: 0,
    goods: 1,
    other: 2,
    mineral: 3,
    events: 4,
}

const SellOptions = [
    { x: 45.26, y: 32.58 }, // Trees
    { x: 45.26, y: 43.711 }, // Goods
    { x: 45.26, y: 55.05 }, // Others
    { x: 45.26, y: 68.08 }, // Mineral
    { x: 45.26, y: 80.82 }, // Events
]

const SellSlotList = [
    // [0, 1, 2, 3]
    // [4, 5, 6, 7]
    { x: 29.67, y: 42.06 },
    { x: 42.64, y: 42.06 },
    { x: 55.86, y: 42.06 },
    { x: 69.32, y: 42.06 },
    { x: 29.67, y: 75.56 },
    { x: 42.64, y: 75.56 },
    { x: 55.86, y: 75.56 },
    { x: 69.32, y: 75.56 },
]

const FriendHouseList = [
    { x: 7.5, y: 61.11 },
    { x: 22.5, y: 61.11 },
    { x: 37.5, y: 61.11 },
    { x: 52.5, y: 61.11 },
    { x: 67.5, y: 61.11 },
]

const ItemKeys = {
    nextOption: 'next-option',
    emptyProductionSlot: 'o-trong-san-xuat',
    emptySellSlot: 'o-trong-ban',
    soldSlot: 'o-da-ban',
    harvestBasket: 'thu-hoach',
    chest: 'ruong-bau',
    game: 'game',
    gameId: 'vn.kvtm.js',
    shopGem: 'shop-gem',
    goDownLast: 'xuong-day',
    friendHouse: 'friend-house',
    myHouse: 'my-house',
    thungRac:'thung-rac',
    dongY:'dong-y',
}

const TreeKeys = {
    tao: 'tao',
    hong: 'hong',
    chanh: 'chanh',
    tuyet: 'tuyet',
    bong: 'bong',
    oaiHuong: 'oai-huong',
    dua: 'dua',
    duaHau: 'dua-hau',
    ev:'event',
}

const ProductKeys = {
    hatDuaSay: 'hat-dua-say',
    vaiTim: 'vai-tim',
    vaiDo: 'vai-do',
    vaiVang: 'vai-vang',
    nuocChanh: 'nuoc-chanh',
    nuocTuyet: 'nuoc-tuyet',
    tinhDauChanh: 'tinh-dau-chanh',
    tinhDauDua: 'tinh-dau-dua',
    tinhDauHoaHong: 'tinh-dau-hoa-hong',
    traHoaHong: 'tra-hoa-hong',
    nuocHoaHuongTao: 'nuoc-hoa-huong-tao',
    vaiXanhLa: 'vai-xanh-la',
    hongSay:'hong-say',
    duaSay:'dua-say',
    nuocTao:'nuoc-tao',
    oaiSay:'oai-say',
    tdTao:'td-tao',
    nuocHoaHong:'nuoc-hoa-hong',
}

const EventKeys = {
    bo: 'event-bo',
    ga: 'event-ga',
    cuu: 'event-cuu',
    heo: 'event-heo',
}

const AchievementKeys = {
    GapNhauMoiNgay: 'gap-nhau-moi-ngay'
}

const SlotPositions = {
    p1: '1',
    p2: '2',
    p3: '3',
    p4: '4',
    p1p2: '12',
    p1p3: '13',
    p2p4: '24',
    p3p4: '34',
}

module.exports = {
    DelayTime,
    DefaultBasket,
    DefaultProduct,
    FirstRowSlotList,
    SecondRowSlotList,
    SellOptions,
    PlantSlotList,
    MakeSlotList,
    SellItemOptions,
    SellSlotList,
    ItemKeys,
    ProductKeys,
    TreeKeys,
    EventKeys,
    AchievementKeys,
    FriendHouseList,
    SlotPositions
}
