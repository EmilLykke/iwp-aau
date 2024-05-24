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

    // Trims the search value and removes any special characters
    const trimmedSearchValue = searchValue.replace(/[^a-zA-Z0-9 ]/g, "");

    // Use URLSearchParams to make sure that the search value is properly encoded
    const searchParams = new URLSearchParams();
    searchParams.append('q', trimmedSearchValue);
    
    window.location.replace(`/catalog/search?${searchParams.toString()}`);
});