var currentPage = 'home';
var currentBlogPage = 1;
var currentWallPage = 1;
var currentReaderTheme = 'rich'; // 'rich' or 'basic'
var readerOverlay = null;

function renderHomePage() {
    var homeDiv = document.getElementById('home');
    var html = '<div class="bio">' + SITE_CONFIG.bio + '</div>';
    html += '<h2 class="section-title">Things I am working on</h2>';

    PROJECTS.forEach(function(project) {
        html += '<div class="project">';
        html += '<div class="project-title"><a href="' + project.url + '">' + project.title + '</a></div>';
        html += '<div class="project-description">' + project.description + '</div>';
        html += '</div>';
    });

    homeDiv.innerHTML = html;
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    var truncated = text.substring(0, maxLength);
    var lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > maxLength - 50) {
        truncated = truncated.substring(0, lastSpace);
    }
    return truncated + '...';
}

function renderBlogPage(page) {
    var blogDiv = document.getElementById('blog');
    var itemsPerPage = SITE_CONFIG.itemsPerPage.blog;
    var totalPages = Math.ceil(BLOG_POSTS.length / itemsPerPage);
    var startIdx = (page - 1) * itemsPerPage;
    var endIdx = startIdx + itemsPerPage;
    var postsToShow = BLOG_POSTS.slice(startIdx, endIdx);

    var html = '<h2 class="section-title">Blog</h2>';

    postsToShow.forEach(function(post) {
        var preview = post.preview || truncateText(post.content, 300);
        var hasMoreContent = post.content.length > 300 || post.richFile;

        html += '<article class="blog-post">';
        html += '<div class="post-date">' + post.date + '</div>';
        html += '<h3 class="post-title">' + post.title + '</h3>';
        html += '<div class="post-preview">' + preview + '</div>';
        if (hasMoreContent) {
            html += '<button class="read-more-btn" onclick="openReader(\'' + post.id + '\')">Read more →</button>';
        }
        html += '</article>';
    });

    if (totalPages > 1) {
        html += '<div class="pagination">';
        html += '<button onclick="changeBlogPage(' + (page - 1) + ')" ' + (page === 1 ? 'disabled' : '') + '>← Previous</button>';
        html += '<div class="page-info">Page ' + page + ' of ' + totalPages + '</div>';
        html += '<button onclick="changeBlogPage(' + (page + 1) + ')" ' + (page === totalPages ? 'disabled' : '') + '>Next →</button>';
        html += '</div>';
    }

    blogDiv.innerHTML = html;
}

function renderWallPage(page) {
    var wallDiv = document.getElementById('wall');
    var itemsPerPage = SITE_CONFIG.itemsPerPage.wall;
    var totalPages = Math.ceil(WALL_ITEMS.length / itemsPerPage);
    var startIdx = (page - 1) * itemsPerPage;
    var endIdx = startIdx + itemsPerPage;
    var itemsToShow = WALL_ITEMS.slice(startIdx, endIdx);

    var html = '<h2 class="section-title">Wall</h2>';

    itemsToShow.forEach(function(item) {
        html += '<div class="wall-item">';
        html += '<div class="wall-text">' + item.text + '</div>';
        html += '<div class="wall-date">' + item.date + '</div>';
        html += '</div>';
    });

    if (totalPages > 1) {
        html += '<div class="pagination">';
        html += '<button onclick="changeWallPage(' + (page - 1) + ')" ' + (page === 1 ? 'disabled' : '') + '>← Previous</button>';
        html += '<div class="page-info">Page ' + page + ' of ' + totalPages + '</div>';
        html += '<button onclick="changeWallPage(' + (page + 1) + ')" ' + (page === totalPages ? 'disabled' : '') + '>Next →</button>';
        html += '</div>';
    }

    wallDiv.innerHTML = html;
}

function changeBlogPage(newPage) {
    currentBlogPage = newPage;
    renderBlogPage(newPage);
}

function changeWallPage(newPage) {
    currentWallPage = newPage;
    renderWallPage(newPage);
}

// Navigation
function navigateTo(pageId) {
    if (pageId === 'home') {
        window.location.hash = '';
    } else {
        window.location.hash = '/' + pageId;
    }
}

function showPage(pageId) {
    var navLinks = document.querySelectorAll('.nav-link');
    var pages = document.querySelectorAll('.page');

    navLinks.forEach(function(l) { l.classList.remove('active'); });
    pages.forEach(function(p) { p.classList.remove('active'); });

    var activeLink = document.querySelector('.nav-link[data-page="' + pageId + '"]');
    if (activeLink) activeLink.classList.add('active');

    var activePage = document.getElementById(pageId);
    if (activePage) activePage.classList.add('active');

    currentPage = pageId;
}

// E-Reader Functions
function createReaderOverlay() {
    if (readerOverlay) return;

    readerOverlay = document.createElement('div');
    readerOverlay.className = 'reader-overlay';
    readerOverlay.id = 'reader-overlay';
    readerOverlay.innerHTML = [
        '<div class="reader-header">',
        '  <button class="reader-back-btn" onclick="closeReader()">← Back</button>',
        '  <span class="reader-title" id="reader-title"></span>',
        '  <button class="reader-theme-toggle" id="reader-theme-toggle" onclick="toggleReaderTheme()">Simple View</button>',
        '</div>',
        '<div class="reader-content" id="reader-content"></div>'
    ].join('');

    document.body.appendChild(readerOverlay);
}

function findPostById(id) {
    return BLOG_POSTS.find(function(post) {
        return post.id === id;
    });
}

function openReader(postId) {
    window.location.hash = '/post/' + postId;
}

function closeReader() {
    window.location.hash = '/blog';
}

function showReader(postId) {
    createReaderOverlay();

    var post = findPostById(postId);
    if (!post) {
        console.error('Post not found:', postId);
        closeReader();
        return;
    }

    document.getElementById('reader-title').textContent = post.title;

    // Reset to rich theme if available, otherwise basic
    currentReaderTheme = post.richFile ? 'rich' : 'basic';
    updateThemeToggleVisibility(post);

    renderReaderContent(post);

    readerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideReader() {
    if (readerOverlay) {
        readerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateThemeToggleVisibility(post) {
    var toggle = document.getElementById('reader-theme-toggle');
    if (!toggle) return;

    if (post.richFile) {
        toggle.style.display = 'block';
        toggle.textContent = currentReaderTheme === 'rich' ? 'Simple View' : 'Magazine View';
    } else {
        toggle.style.display = 'none';
    }
}

function toggleReaderTheme() {
    var hash = window.location.hash;
    var match = hash.match(/^#\/post\/(.+)$/);
    if (!match) return;

    var post = findPostById(match[1]);
    if (!post || !post.richFile) return;

    currentReaderTheme = currentReaderTheme === 'rich' ? 'basic' : 'rich';
    updateThemeToggleVisibility(post);
    renderReaderContent(post);
}

function renderReaderContent(post) {
    var contentDiv = document.getElementById('reader-content');
    if (!contentDiv) return;

    if (currentReaderTheme === 'rich' && post.richFile) {
        renderRichContent(post, contentDiv);
    } else {
        renderBasicContent(post, contentDiv);
    }
}

function renderBasicContent(post, contentDiv) {
    contentDiv.className = 'reader-content basic-theme';
    contentDiv.innerHTML = [
        '<h1>' + post.title + '</h1>',
        '<div class="reader-date">' + post.date + '</div>',
        '<div>' + post.content + '</div>'
    ].join('');
}

function renderRichContent(post, contentDiv) {
    contentDiv.className = 'reader-content';
    contentDiv.innerHTML = '<div class="reader-rich-container" id="rich-container">Loading...</div>';

    fetch(post.richFile)
        .then(function(response) {
            if (!response.ok) throw new Error('Failed to load rich content');
            return response.text();
        })
        .then(function(html) {
            var container = document.getElementById('rich-container');
            if (!container) return;

            // Create shadow DOM for style isolation
            var shadow = container.attachShadow({ mode: 'open' });
            shadow.innerHTML = html;
        })
        .catch(function(error) {
            console.error('Error loading rich content:', error);
            // Fall back to basic theme
            currentReaderTheme = 'basic';
            renderBasicContent(post, contentDiv);
        });
}

function handleHashChange() {
    var hash = window.location.hash;

    // Check for post reader
    var postMatch = hash.match(/^#\/post\/(.+)$/);
    if (postMatch) {
        showPage('blog');
        showReader(postMatch[1]);
        return;
    }

    // Hide reader if open
    hideReader();

    // Check for page navigation
    var pageMatch = hash.match(/^#\/(\w+)$/);
    if (pageMatch) {
        var pageId = pageMatch[1];
        if (['home', 'blog', 'wall'].indexOf(pageId) !== -1) {
            showPage(pageId);
            return;
        }
    }

    // Default to home
    showPage('home');
}

function initSite() {
    document.getElementById('site-name').textContent = SITE_CONFIG.name;
    document.getElementById('footer-name').textContent = SITE_CONFIG.name;
    document.getElementById('year').textContent = new Date().getFullYear();

    renderHomePage();
    renderBlogPage(1);
    renderWallPage(1);

    // Set up nav link click handlers
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var pageId = link.getAttribute('data-page');
            navigateTo(pageId);
        });
    });

    // Handle hash-based routing
    window.addEventListener('hashchange', handleHashChange);

    // Check initial hash
    handleHashChange();
}

document.addEventListener('DOMContentLoaded', initSite);
