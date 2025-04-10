function searchFunction() {
    let input = document.getElementById('search').value.toLowerCase();
    let updateItems = document.querySelectorAll('.update-item');
    let trendingItems = document.querySelectorAll('.trending-item');
    
    function filterItems(items) {  
        items.forEach(item => {
            let text = item.textContent.toLowerCase();
            if (text.includes(input)) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    }
    
    filterItems(updateItems);
    filterItems(trendingItems);
}
