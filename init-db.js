db = db.getSiblingDB('loves-db');  // Switch to the cosmetic-store DB


// Insert initial products
db.products.insertMany([
    {
        name: "Cosmetic Pencil (Black brown), AS company",
        price: 5.00,
        image: "/shop-pencil.png",
        description: "Cosmetic Pencil (Black brown), AS company",
        category: "brows",
        colors: ["#CDC4C4", "#19191A", "#DBA683", "#793757", "#002E65", "#653F2A", "#0D0D0D", "#D38A57", "#404D43", "#78272D"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Green soap with disinfecting property (skin antiseptic)",
        price: 10.00,
        image: "/shop-spray.png",
        description: "Green soap with disinfecting property (skin antiseptic)",
        category: "care",
        colors: [],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Concentrate cherry lip pigment, 12ml",
        price: 39.80,
        image: "/shop-cherry.png",
        description: "Concentrate cherry lip pigment",
        category: "lips",
        colors: ["#7A1F26", "#B35560", "#690D0E", "#8C2631", "#D61111", "#CF0205", "#5E1625", "#B00731", "#C97E6D", "#F03A2C"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Eyeshadow Pencil, AS company",
        price: 8.00,
        image: "/shop-eyeshadow.jpeg",
        description: "Eyeshadow Pencil, AS company",
        category: "eyeshadow",
        colors: ["#EDB789", "#A5A3A4", "#B24A2F", "#DEA98C", "#786834", "#266467", "#8E3F44", "#211F22", "#B73B6F", "#1E1B1B"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Blushes Pencil, AS company",
        price: 4.00,
        image: "/shop-blushes.jpg",
        description: "Blushes Pencil, AS company",
        category: "blushes",
        colors: ["#D8867B", "#D897B2", "#EF2B41", "#F48E7F", "#A13555", "#E7756B", "#EB4A6C", "#DA8A73", "#F25A59", "#F79792"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Lashes Pencil, AS company",
        price: 12.00,
        image: "/shop-lashes.webp",
        description: "Lashes Pencil, AS company",
        category: "lashes",
        colors: ["#FFFFFF", "#000000", "#8B4513"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Eyeliner, AS company",
        price: 14.00,
        image: "/shop-eyeliner.jpg",
        description: "Eyeliner, AS company",
        category: "eyeliner",
        colors: ["#FFFFFF", "#000000", "#8B4513"],
        created_at: new Date(),
        updated_at: new Date()
    }
]);
