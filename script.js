var currentPage = 'home';
var currentBlogPage = 1;
var currentWallPage = 1;

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

function renderBlogPage(page) {
    var blogDiv = document.getElementById('blog');
    var itemsPerPage = SITE_CONFIG.itemsPerPage.blog;
    var totalPages = Math.ceil(BLOG_POSTS.length / itemsPerPage);
    var startIdx = (page - 1) * itemsPerPage;
    var endIdx = startIdx + itemsPerPage;
    var postsToShow = BLOG_POSTS.slice(startIdx, endIdx);
    
    var html = '<h2 class="section-title">Blog</h2>';
    
    postsToShow.forEach(function(post) {
        html += '<article class="blog-post">';
        html += '<div class="post-date">' + post.date + '</div>';
        html += '<h3 class="post-title">' + post.title + '</h3>';
        html += '<div class="post-content">' + post.content + '</div>';
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

function initSite() {
    document.getElementById('site-name').textContent = SITE_CONFIG.name;
    document.getElementById('footer-name').textContent = SITE_CONFIG.name;
    document.getElementById('year').textContent = new Date().getFullYear();
    
    renderHomePage();
    renderBlogPage(1);
    renderWallPage(1);
    
    var navLinks = document.querySelectorAll('.nav-link');
    var pages = document.querySelectorAll('.page');
    
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(function(l) { l.classList.remove('active'); });
            pages.forEach(function(p) { p.classList.remove('active'); });
            link.classList.add('active');
            var pageId = link.getAttribute('data-page');
            document.getElementById(pageId).classList.add('active');
            currentPage = pageId;
        });
    });
}

document.addEventListener('DOMContentLoaded', initSite);