const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// Added this to allow the user to press enter to search
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

searchButton.addEventListener('click', () => {
    const searchValue = searchInput.value;

    // Use URLSearchParams to make sure that the search value is properly encoded
    const searchParams = new URLSearchParams();
    searchParams.append('q', searchValue);
    
    window.location.replace(`/catalog/search?${searchParams.toString()}`);
});