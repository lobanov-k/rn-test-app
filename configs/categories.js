export default [
    {
        name: "Category",
        alias: "category",
        list: "https://firebasestorage.googleapis.com/v0/b/congrat-app.appspot.com/o/configs%2Fcategory.json?alt=media",
        getIcon: () => require("../assets/images/category-icons/496408.png")
    },
    {
        name: "Another Category",
        alias: "category-1",
        list: "https://firebasestorage.googleapis.com/v0/b/congrat-app.appspot.com/o/configs%2Fcategor2.json?alt=media",
        getIcon: () => require("../assets/images/category-icons/320329.png")
    }
];