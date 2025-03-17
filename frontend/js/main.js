document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const contentType = document.getElementById('content-type');
    const searchBtn = document.getElementById('search-btn');
    const resultsTab = document.getElementById('results-tab');
    const favoritesTab = document.getElementById('favorites-tab');
    const resultsContainer = document.getElementById('results-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const paginationContainer = document.getElementById('pagination');

    // State variables
    let token = localStorage.getItem('token');
    
    // Search state
    let searchCurrentPage = 1;
    let searchTotalPages = 1;
    let currentQuery = '';
    let currentType = 'photo';
    
    // Favorites state
    let favoritesCurrentPage = 1;
    let favoritesTotalPages = 1;
    
    // Track active tab for pagination
    let activeTab = 'results';
    
    // Store favorited content IDs
    let favoritedIds = [];

    // Check if user is authenticated
    if (token) {
        showApp();
    } else {
        showAuth();
    }

    // Tab switching
    loginTab.addEventListener('click', function() {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', function() {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    resultsTab.addEventListener('click', function() {
        resultsTab.classList.add('active');
        favoritesTab.classList.remove('active');
        resultsContainer.style.display = 'grid';
        favoritesContainer.style.display = 'none';
        
        // Set active tab
        activeTab = 'results';
        
        // Show pagination for search results
        updatePaginationDisplay();
        
        // Update pagination info based on search state
        updatePaginationInfo(searchCurrentPage, searchTotalPages);
    });

    favoritesTab.addEventListener('click', function() {
        favoritesTab.classList.add('active');
        resultsTab.classList.remove('active');
        favoritesContainer.style.display = 'grid';
        resultsContainer.style.display = 'none';
        
        // Set active tab
        activeTab = 'favorites';
        
        // Reset favorites page if needed
        if (favoritesCurrentPage > favoritesTotalPages && favoritesTotalPages > 0) {
            favoritesCurrentPage = 1;
        }
        
        // Fetch favorites with current page
        fetchFavorites();
        
        // Update pagination info based on favorites state
        updatePaginationInfo(favoritesCurrentPage, favoritesTotalPages);
        
        // Show pagination only if we have results
        updatePaginationDisplay();
    });

    // Login functionality
    loginBtn.addEventListener('click', function() {
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        if (!email || !password) {
            loginError.textContent = 'Email and password are required';
            return;
        }
        
        fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                token = data.token;
                showApp();
                loginError.textContent = '';
                loginEmail.value = '';
                loginPassword.value = '';
            } else {
                loginError.textContent = data.message || 'Login failed';
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            loginError.textContent = 'An error occurred during login';
        });
    });

    // Register functionality
    registerBtn.addEventListener('click', function() {
        const email = registerEmail.value.trim();
        const password = registerPassword.value;
        
        if (!email || !password) {
            registerError.textContent = 'Email and password are required';
            return;
        }
        
        
        // Password validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            registerError.textContent = 'Password must be at least 8 characters and include lowercase, uppercase, number, and special character';
            return;
        }
        
        fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                token = data.token;
                showApp();
                registerError.textContent = '';
                registerEmail.value = '';
                registerPassword.value = '';
            } else {
                registerError.textContent = data.message || 'Registration failed';
            }
        })
        .catch(error => {
            console.error('Registration error:', error);
            registerError.textContent = 'An error occurred during registration';
        });
    });

    // Logout functionality
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('token');
        token = null;
        showAuth();
        resultsContainer.innerHTML = '';
        favoritesContainer.innerHTML = '';
        
        // Reset state variables
        searchCurrentPage = 1;
        searchTotalPages = 1;
        favoritesCurrentPage = 1;
        favoritesTotalPages = 1;
        currentQuery = '';
        currentType = 'photo';
        favoritedIds = [];
    });

    // Search functionality
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        const type = contentType.value;
        
        if (!query) {
            return;
        }
        
        currentQuery = query;
        currentType = type;
        searchCurrentPage = 1;
        
        // Fetch favorited IDs before showing search results
        fetchFavoritedIds().then(() => {
            fetchSearchResults();
        });
        
        // Switch to results tab
        resultsTab.click();
    });

    // Pagination
    prevPageBtn.addEventListener('click', function() {
        if (activeTab === 'results' && searchCurrentPage > 1) {
            searchCurrentPage--;
            fetchSearchResults();
        } else if (activeTab === 'favorites' && favoritesCurrentPage > 1) {
            favoritesCurrentPage--;
            fetchFavorites();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        if (activeTab === 'results' && searchCurrentPage < searchTotalPages) {
            searchCurrentPage++;
            fetchSearchResults();
        } else if (activeTab === 'favorites' && favoritesCurrentPage < favoritesTotalPages) {
            favoritesCurrentPage++;
            fetchFavorites();
        }
    });
    
    // Fetch favorited IDs
    async function fetchFavoritedIds() {
        try {
            const response = await fetch('/api/favorites/ids', {
                headers: {
                    'x-auth-token': token
                }
            });
            
            const data = await response.json();
            
            if (data.favoritedIds) {
                favoritedIds = data.favoritedIds;
            }
        } catch (error) {
            console.error('Fetch favorited IDs error:', error);
        }
    }

    // Fetch search results
    function fetchSearchResults() {
        resultsContainer.innerHTML = '<p>Loading...</p>';
        
        fetch(`/api/search?query=${encodeURIComponent(currentQuery)}&type=${currentType}&page=${searchCurrentPage}&per_page=20`, {
            headers: {
                'x-auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                displaySearchResults(data);
                searchTotalPages = data.totalPages;
                updatePaginationInfo(searchCurrentPage, searchTotalPages);
                updatePaginationDisplay();
            } else {
                resultsContainer.innerHTML = `<p>${data.message || 'Error fetching results'}</p>`;
                updatePaginationDisplay();
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p>An error occurred while fetching results</p>';
            updatePaginationDisplay();
        });
    }

    // Display search results
    function displaySearchResults(data) {
        resultsContainer.innerHTML = '';
        
        if (data.results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found</p>';
            return;
        }
        
        data.results.forEach(item => {
            const element = document.createElement('div');
            element.className = 'content-item';
            
            let mediaElement = '';
            if (item.type === 'photo') {
                mediaElement = `<img src="${item.fullSize}" alt="Photo">`;
            } else {
                mediaElement = `<video src="${item.fullSize}" poster="${item.thumbnail}" controls></video>`;
            }
            
            // Check if item is already favorited
            const isAlreadyFavorited = favoritedIds.includes(item.id.toString());
            
            let buttonsHtml = '';
            if (isAlreadyFavorited) {
                // Already favorited: show disabled "Added to Favorites" button and a "Remove from Favorites" button
                buttonsHtml = `
                    <button class="favorite-btn" disabled>Added to Favorites</button>
                    <button class="remove-btn" data-id="${item.id}">Remove from Favorites</button>
                `;
            } else {
                // Not favorited: show normal "Add to Favorites" button
                buttonsHtml = `<button class="favorite-btn" data-id="${item.id}" data-type="${item.type}">Add to Favorites</button>`;
            }
            
            element.innerHTML = `
                ${mediaElement}
                <div class="content-info">
                    <p>By: ${item.user}</p>
                    <p>Tags: ${item.tags.join(', ')}</p>
                    ${buttonsHtml}
                </div>
            `;
            
            resultsContainer.appendChild(element);
            
            // Add event listeners to buttons
            if (!isAlreadyFavorited) {
                // If not favorited, add event listener to favorite button
                const favoriteBtn = element.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', function() {
                    addToFavorites(item);
                    
                    // Update UI without reloading
                    favoriteBtn.textContent = 'Added to Favorites';
                    favoriteBtn.disabled = true;
                    
                    // Add remove button
                    const removeBtn = document.createElement('button');
                    removeBtn.className = 'remove-btn';
                    removeBtn.dataset.id = item.id;
                    removeBtn.textContent = 'Remove from Favorites';
                    favoriteBtn.parentNode.appendChild(removeBtn);
                    
                    // Add event listener to the new remove button
                    removeBtn.addEventListener('click', function() {
                        removeFromFavorites(item.id.toString());
                        
                        // We'll refresh the search results after removing
                        fetchFavoritedIds().then(() => {
                            fetchSearchResults();
                        });
                    });
                    
                    // Add to favorited IDs
                    favoritedIds.push(item.id.toString());
                });
            } else {
                // If already favorited, add event listener to remove button
                const removeBtn = element.querySelector('.remove-btn');
                removeBtn.addEventListener('click', function() {
                    removeFromFavorites(item.id.toString());
                    
                    // We'll refresh the search results after removing
                    fetchFavoritedIds().then(() => {
                        fetchSearchResults();
                    });
                });
            }
        });
    }

    // Update pagination controls
    function updatePaginationInfo(currentPage, totalPages) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    }
    
    // Show/hide pagination based on content
    function updatePaginationDisplay() {
        if ((activeTab === 'results' && searchTotalPages > 1) || 
            (activeTab === 'favorites' && favoritesTotalPages > 1)) {
            paginationContainer.style.display = 'flex';
        } else if ((activeTab === 'results' && !currentQuery) || 
                  (activeTab === 'favorites' && favoritesTotalPages <= 1)) {
            paginationContainer.style.display = 'none';
        }
    }

    // Add to favorites
    function addToFavorites(item) {
        fetch('/api/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                contentId: item.id.toString(),
                contentType: item.type,
                contentData: item
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.message) {
                // If favorites tab is active, refresh it
                if (activeTab === 'favorites') {
                    fetchFavorites();
                }
            }
        })
        .catch(error => {
            console.error('Add favorite error:', error);
        });
    }

    // Fetch favorites with pagination
    function fetchFavorites() {
        favoritesContainer.innerHTML = '<p>Loading...</p>';
        
        fetch(`/api/favorites?page=${favoritesCurrentPage}&per_page=20`, {
            headers: {
                'x-auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.results) {
                displayFavorites(data.results);
                favoritesTotalPages = data.totalPages;
                updatePaginationInfo(favoritesCurrentPage, favoritesTotalPages);
                updatePaginationDisplay();
            } else {
                favoritesContainer.innerHTML = '<p>Error fetching favorites</p>';
                updatePaginationDisplay();
            }
        })
        .catch(error => {
            console.error('Fetch favorites error:', error);
            favoritesContainer.innerHTML = '<p>An error occurred while fetching favorites</p>';
            updatePaginationDisplay();
        });
    }

    // Display favorites
    function displayFavorites(favorites) {
        favoritesContainer.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorites yet</p>';
            return;
        }
        
        favorites.forEach(fav => {
            const item = fav.contentData;
            const element = document.createElement('div');
            element.className = 'content-item';
            
            let mediaElement = '';
            if (fav.contentType === 'photo') {
                mediaElement = `<img src="${item.fullSize}" alt="Photo">`;
            } else {
                mediaElement = `<video src="${item.fullSize}" poster="${item.thumbnail}" controls></video>`;
            }
            
            element.innerHTML = `
                ${mediaElement}
                <div class="content-info">
                    <p>By: ${item.user}</p>
                    <p>Tags: ${item.tags.join(', ')}</p>
                    <button class="remove-btn" data-id="${fav.contentId}">Remove from Favorites</button>
                </div>
            `;
            
            favoritesContainer.appendChild(element);
            
            // Add remove button event listener
            const removeBtn = element.querySelector('.remove-btn');
            removeBtn.addEventListener('click', function() {
                removeFromFavorites(fav.contentId);
            });
        });
    }

    // Remove from favorites
    function removeFromFavorites(contentId) {
        fetch(`/api/favorites/${contentId}`, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Favorite removed successfully') {
                // Remove from favorited IDs array
                const index = favoritedIds.indexOf(contentId);
                if (index !== -1) {
                    favoritedIds.splice(index, 1);
                }
                
                // Refresh favorites tab content if active
                if (activeTab === 'favorites') {
                    fetchFavorites();
                }
            }
        })
        .catch(error => {
            console.error('Remove favorite error:', error);
        });
    }

    // Helper functions
    function showAuth() {
        authContainer.style.display = 'block';
        appContainer.style.display = 'none';
    }

    function showApp() {
        authContainer.style.display = 'none';
        appContainer.style.display = 'block';
        
        // Initially hide pagination if no content
        paginationContainer.style.display = 'none';
        
        // Set default active tab
        activeTab = 'results';
        
        // Fetch favorited IDs when app loads
        fetchFavoritedIds();
    }
});