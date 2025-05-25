// --- Data Structure (Simulated Data using localStorage) ---
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
let connections = JSON.parse(localStorage.getItem('connections')) || {};
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let boardPosts = JSON.parse(localStorage.getItem('boardPosts')) || [];

// --- Mock Data Definitions (only if localStorage is truly empty for first ever run) ---
const mockUsers = [
    {
        id: 'user1',
        username: 'john.doe',
        password: 'password123', // In real app, never store plain passwords!
        name: 'John Doe',
        university: 'University XYZ',
        course: 'Computer Science',
        year: 'Junior',
        bio: 'Passionate full-stack developer with a keen interest in AI/ML and open-source contributions. Always eager to learn and collaborate!',
        skills: ['React', 'Node.js', 'Python', 'Machine Learning', 'Cloud Computing'],
        projects: ['CampusConnect (Frontend)', 'AI Chatbot', 'E-commerce API'],
        linkedin: 'https://linkedin.com/in/johndoe',
        github: 'https://github.com/johndoe',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    {
        id: 'user2',
        username: 'jane.smith',
        password: 'password123',
        name: 'Jane Smith',
        university: 'University ABC',
        course: 'Design',
        year: 'Senior',
        bio: 'UI/UX designer with a passion for creating intuitive and beautiful interfaces. Experienced in Figma, Adobe XD, and user research.',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        projects: ['CampusConnect (UI/UX)', 'Mobile App Redesign', 'Brand Identity Kit'],
        linkedin: 'https://linkedin.com/in/janesmith',
        github: 'https://github.com/janesmith',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    {
        id: 'user3',
        username: 'alice.wong',
        password: 'password123',
        name: 'Alice Wong',
        university: 'State University',
        course: 'Electrical Engineering',
        year: 'Freshman',
        bio: 'New to EE, but fascinated by robotics and embedded systems. Looking for peers to learn with and explore new technologies.',
        skills: ['Arduino', 'C++', 'Basic Robotics'],
        projects: ['Line Following Robot'],
        linkedin: '',
        github: '',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    {
        id: 'user4',
        username: 'bob.johnson',
        password: 'password123',
        name: 'Bob Johnson',
        university: 'Tech Institute',
        course: 'Computer Science',
        year: 'Junior',
        bio: 'Backend developer specializing in Node.js and database management. Loves competitive programming and contributing to open source.',
        skills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JavaScript'],
        projects: ['RESTful API', 'Real-time Chat App'],
        linkedin: '',
        github: '',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    // Add more mock users as needed
];

const mockBoardPosts = [
    {
        id: 'post1',
        title: 'Looking for a React Native Dev for Campus Navigation App',
        description: 'I have an idea for a campus navigation app and need a React Native developer to help build it. Basic UI is done, need help with backend integration and advanced features.',
        tags: ['Mobile', 'React Native', 'App Dev'],
        authorId: 'user2',
        authorName: 'Jane Smith',
        timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
        id: 'post2',
        title: 'Study Group for Data Structures & Algorithms',
        description: 'Starting a study group for DSA. We\'ll cover common algorithms, data structures, and practice LeetCode. All years welcome!',
        tags: ['DSA', 'Study Group', 'Algorithms'],
        authorId: 'user4',
        authorName: 'Bob Johnson',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    }
];

// --- Initialize Data if localStorage is empty ---
// This ensures mock data is only added once on the very first load
// or if localStorage is completely cleared.
if (allUsers.length === 0 && localStorage.getItem('hasInitializedMockData') === null) {
    allUsers.push(...mockUsers);
    boardPosts.push(...mockBoardPosts);
    localStorage.setItem('hasInitializedMockData', 'true'); // Flag to prevent re-initialization
    saveState(); // Save the initial state immediately
}


// Ensure connections object exists for all users, even newly signed up ones
allUsers.forEach(user => {
    if (!connections[user.id]) {
        connections[user.id] = [];
    }
});
saveState(); // Save after ensuring all users have a connections array (important for newly registered users)


// --- DOM Elements ---
const loginSignupPage = document.getElementById('login-signup-page');
const discoverPage = document.getElementById('discover-page');
const myProfilePage = document.getElementById('my-profile-page');
const editProfilePage = document.getElementById('edit-profile-page');
const connectionsPage = document.getElementById('connections-page');
const boardPage = document.getElementById('board-page');
const peerProfileViewPage = document.getElementById('peer-profile-view-page');
const chatModal = document.getElementById('chat-modal');

const loginBtn = document.getElementById('login-btn');
const signupLink = document.getElementById('signup-link');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

const discoverSearchInput = document.getElementById('discover-search');
const filterCourseSelect = document.getElementById('filter-course');
const filterYearSelect = document.getElementById('filter-year');
const filterSkillsInput = document.getElementById('filter-skills');
const applyFiltersBtn = document.getElementById('apply-filters-btn');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const peerList = document.getElementById('peer-list');

const myProfileAvatarHeader = document.getElementById('my-profile-avatar-header');
const myProfileAvatar = document.getElementById('my-profile-avatar');
const myProfileName = document.getElementById('my-profile-name');
const myProfileDetails = document.getElementById('my-profile-details');
const myProfileBio = document.getElementById('my-profile-bio');
const myProfileProjects = document.getElementById('my-profile-projects');
const editProfileBtn = document.getElementById('edit-profile-btn');

const editProfileForm = document.getElementById('edit-profile-form');
const editNameInput = document.getElementById('edit-name');
const editUniversityInput = document.getElementById('edit-university');
const editCourseInput = document.getElementById('edit-course');
const editYearSelect = document.getElementById('edit-year');
const editBioTextarea = document.getElementById('edit-bio');
const editSkillsInput = document.getElementById('edit-skills');
const editProjectsInput = document.getElementById('edit-projects');
const editLinkedinInput = document.getElementById('edit-linkedin');
const editGithubInput = document.getElementById('edit-github');
const editProfilePictureInput = document.getElementById('edit-profile-picture');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const closePeerProfileBtn = document.getElementById('close-peer-profile-btn');
const viewProfileAvatar = document.getElementById('view-profile-avatar');
const viewProfileName = document.getElementById('view-profile-name');
const viewProfileDetails = document.getElementById('view-profile-details');
const viewProfileSkillsTags = document.getElementById('view-profile-skills-tags');
const viewProfileBio = document.getElementById('view-profile-bio');
const viewProfileProjects = document.getElementById('view-profile-projects');
const viewProfileLinkedin = document.getElementById('view-profile-linkedin');
const viewProfileGithub = document.getElementById('view-profile-github');
const viewProfileConnectBtn = document.getElementById('view-profile-connect-btn');
const viewProfileMessageBtn = document.getElementById('view-profile-message-btn');


const connectionList = document.getElementById('connection-list');
const noConnectionsMessage = document.getElementById('no-connections-message');

const postTitleInput = document.getElementById('post-title');
const postDescriptionInput = document.getElementById('post-description');
const postTagsInput = document.getElementById('post-tags');
const submitPostBtn = document.getElementById('submit-post-btn');
const boardPostsContainer = document.getElementById('board-posts');

const chatHeaderName = document.getElementById('chat-header-name');
const chatMessagesContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendMessageBtn = document.getElementById('send-message-btn');
const closeChatModalBtn = document.getElementById('close-chat-modal');

const darkModeToggle = document.getElementById('dark-mode-toggle');
const notificationsBtn = document.getElementById('notifications-btn');
const notificationBadge = document.getElementById('notification-badge');
const notificationsDropdown = document.getElementById('notifications-dropdown');
const profileMenuBtn = document.getElementById('profile-menu-btn');
const profileMenuDropdown = document.getElementById('profile-menu-dropdown');
const logoutBtn = document.getElementById('logout-btn');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
const mobileLogoutBtn = document.getElementById('mobile-logout-btn');


// --- Utility Functions ---

function saveState() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    localStorage.setItem('connections', JSON.stringify(connections));
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('boardPosts', JSON.stringify(boardPosts));
}

function showPage(pageId) {
    document.querySelectorAll('[data-page]').forEach(page => {
        page.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');
    // Close any open modals/drawers
    profileMenuDropdown.classList.add('hidden');
    notificationsDropdown.classList.add('hidden');
    mobileMenuDrawer.classList.remove('translate-x-0'); // Hide mobile drawer
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => (n.to === (currentUser ? currentUser.id : null) || !n.to) && !n.read).length; // Filter for current user and unread
    if (unreadCount > 0) {
        notificationBadge.textContent = unreadCount;
        notificationBadge.classList.remove('hidden');
    } else {
        notificationBadge.classList.add('hidden');
    }
}

function renderSkills(skills, container) {
    container.innerHTML = '';
    skills.forEach(skill => {
        const span = document.createElement('span');
        span.className = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 text-xs font-medium px-2.5 py-0.5 rounded-full';
        span.textContent = `#${skill}`;
        container.appendChild(span);
    });
}

// --- Login/Signup Logic ---
function handleLogin() {
    const username = usernameInput.value;
    const password = passwordInput.value;
    const user = allUsers.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        saveState();
        renderMyProfile(); // Render current user's profile on login
        renderDiscoverPage(); // Render discover page after login
        updateNotificationBadge(); // Update badge on login
        showPage('discover-page'); // Show discover page
        alert('Login successful!');
    } else {
        alert('Invalid username or password.');
    }
}

function handleSignup() {
    const newUsername = prompt('Enter a new username:');
    if (!newUsername) return;
    const newPassword = prompt('Enter a password:');
    if (!newPassword) return;

    if (allUsers.some(u => u.username === newUsername)) {
        alert('Username already taken.');
        return;
    }

    const newUserId = `user${Math.floor(Math.random() * 100000)}`; // More robust ID
    const newUser = {
        id: newUserId,
        username: newUsername,
        password: newPassword,
        name: newUsername.split('.')[0].charAt(0).toUpperCase() + newUsername.split('.')[0].slice(1) + ' ' + (newUsername.includes('.') ? newUsername.split('.')[1].charAt(0).toUpperCase() + newUsername.split('.')[1].slice(1) : ''),
        university: 'Your University',
        course: 'Your Course',
        year: 'Freshman',
        bio: 'Hello! This is my new CampusConnect profile. Looking to connect!',
        skills: [],
        projects: [],
        linkedin: '',
        github: '',
        avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg` // Random avatar
    };
    allUsers.push(newUser);
    connections[newUserId] = []; // Initialize connections for new user
    saveState();
    alert('Account created successfully! Please log in.');
    usernameInput.value = newUsername;
    passwordInput.value = newPassword;
}

// --- Page Rendering Functions ---

function renderMyProfile() {
    if (!currentUser) return; // Should not happen if logic is correct

    myProfileAvatarHeader.src = currentUser.avatar;
    myProfileAvatar.src = currentUser.avatar;
    myProfileName.textContent = currentUser.name;
    myProfileDetails.textContent = `${currentUser.course}, ${currentUser.year} at ${currentUser.university}`;
    myProfileBio.textContent = currentUser.bio;

    myProfileProjects.innerHTML = '';
    if (currentUser.projects && currentUser.projects.length > 0) {
        currentUser.projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project;
            myProfileProjects.appendChild(li);
        });
    } else {
        myProfileProjects.innerHTML = '<li class="text-gray-500 dark:text-gray-400">No projects added yet.</li>';
    }

    // Skills
    const myProfileSkillsContainer = myProfileName.nextElementSibling.nextElementSibling; // Get the div after details and below name
    myProfileSkillsContainer.innerHTML = '';
    renderSkills(currentUser.skills, myProfileSkillsContainer);

    // Social Handles (mock links)
    const socialLinksDiv = myProfileSkillsContainer.nextElementSibling;
    socialLinksDiv.innerHTML = '';
    let socialLinksAdded = false;
    if (currentUser.linkedin) {
        const linkedinLink = document.createElement('a');
        linkedinLink.href = currentUser.linkedin;
        linkedinLink.target = '_blank';
        linkedinLink.className = 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400';
        linkedinLink.innerHTML = '🔗 LinkedIn';
        socialLinksDiv.appendChild(linkedinLink);
        socialLinksAdded = true;
    }
    if (currentUser.github) {
        const githubLink = document.createElement('a');
        githubLink.href = currentUser.github;
        githubLink.target = '_blank';
        githubLink.className = 'text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400';
        githubLink.innerHTML = '💻 GitHub';
        socialLinksDiv.appendChild(githubLink);
        socialLinksAdded = true;
    }
    if (!socialLinksAdded) {
        socialLinksDiv.textContent = 'No social links added.';
        socialLinksDiv.classList.add('text-gray-500', 'dark:text-gray-400');
    } else {
         socialLinksDiv.classList.remove('text-gray-500', 'dark:text-gray-400');
    }
}

function fillEditProfileForm() {
    if (!currentUser) return;
    editNameInput.value = currentUser.name || '';
    editUniversityInput.value = currentUser.university || '';
    editCourseInput.value = currentUser.course || '';
    editYearSelect.value = currentUser.year || 'Freshman';
    editBioTextarea.value = currentUser.bio || '';
    editSkillsInput.value = (currentUser.skills || []).join(', ');
    editProjectsInput.value = (currentUser.projects || []).join(', ');
    editLinkedinInput.value = currentUser.linkedin || '';
    editGithubInput.value = currentUser.github || '';
    editProfilePictureInput.value = currentUser.avatar || '';
    profilePicturePreview.src = currentUser.avatar || 'https://via.placeholder.com/100';
}

function handleEditProfileSubmit(event) {
    event.preventDefault();
    if (!currentUser) return;

    currentUser.name = editNameInput.value;
    currentUser.university = editUniversityInput.value;
    currentUser.course = editCourseInput.value;
    currentUser.year = editYearSelect.value;
    currentUser.bio = editBioTextarea.value;
    currentUser.skills = editSkillsInput.value.split(',').map(s => s.trim()).filter(s => s);
    currentUser.projects = editProjectsInput.value.split(',').map(p => p.trim()).filter(p => p);
    currentUser.linkedin = editLinkedinInput.value;
    currentUser.github = editGithubInput.value;
    currentUser.avatar = editProfilePictureInput.value;

    // Update the user in allUsers array
    const userIndex = allUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        allUsers[userIndex] = currentUser;
    }

    saveState();
    renderMyProfile(); // Re-render My Profile with new data
    alert('Profile updated successfully!');
    showPage('my-profile-page'); // Go back to profile view
}


function renderPeerCards(usersToDisplay) {
    peerList.innerHTML = '';
    if (usersToDisplay.length === 0) {
        peerList.innerHTML = '<p class="text-center text-gray-600 dark:text-gray-400 col-span-full">No peers found matching your criteria.</p>';
        return;
    }

    usersToDisplay.forEach(user => {
        if (currentUser && user.id === currentUser.id) return; // Don't show current user in discover

        const isConnected = currentUser && connections[currentUser.id] && connections[currentUser.id].includes(user.id);
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200 cursor-pointer peer-card relative';
        card.dataset.userId = user.id; // Store user ID for click handling

        let skillsHtml = '';
        (user.skills || []).slice(0, 3).forEach(skill => { // Show up to 3 skills
            skillsHtml += `<span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 text-xs font-medium px-2.5 py-0.5 rounded-full">${skill}</span>`;
        });

        const connectButtonText = isConnected ? 'Connected' : 'Connect';
        const connectButtonClass = isConnected ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700';

        card.innerHTML = `
            <img src="${user.avatar || 'https://via.placeholder.com/80'}" alt="Profile Picture" class="w-20 h-20 rounded-full mx-auto mb-4 object-cover">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">${user.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.course}, ${user.year}</p>
            <div class="mt-3 flex flex-wrap justify-center gap-2">
                ${skillsHtml}
            </div>
            <button class="mt-4 text-white py-2 px-4 rounded-md transition-colors connect-btn ${connectButtonClass}" data-user-id="${user.id}" ${isConnected ? 'disabled' : ''}>${connectButtonText}</button>
        `;

        // Attach event listener for the connect button directly
        const connectBtn = card.querySelector('.connect-btn');
        connectBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click from triggering
            handleConnectRequest(user.id);
        });

        // Attach event listener for the whole card to view profile
        card.addEventListener('click', () => {
            renderPeerProfileView(user.id);
        });

        peerList.appendChild(card);
    });
}

function renderDiscoverPage() {
    const searchTerm = discoverSearchInput.value.toLowerCase();
    const filterCourse = filterCourseSelect.value;
    const filterYear = filterYearSelect.value;
    const filterSkills = filterSkillsInput.value.toLowerCase().split(',').map(s => s.trim()).filter(s => s);

    let filteredUsers = allUsers.filter(user => {
        // Exclude current user from discover list
        if (currentUser && user.id === currentUser.id) {
            return false;
        }

        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                              (user.skills && user.skills.some(skill => skill.toLowerCase().includes(searchTerm)));
        const matchesCourse = filterCourse === '' || user.course === filterCourse;
        const matchesYear = filterYear === '' || user.year === filterYear;
        const matchesSkills = filterSkills.length === 0 || filterSkills.every(fSkill => user.skills && user.skills.some(uSkill => uSkill.toLowerCase().includes(fSkill)));

        return matchesSearch && matchesCourse && matchesYear && matchesSkills;
    });

    renderPeerCards(filteredUsers);
}

function renderConnectionsPage() {
    if (!currentUser) return;

    connectionList.innerHTML = '';
    const myConnectedUserIds = connections[currentUser.id] || [];

    if (myConnectedUserIds.length === 0) {
        noConnectionsMessage.classList.remove('hidden');
        return;
    } else {
        noConnectionsMessage.classList.add('hidden');
    }

    const connectedUsers = allUsers.filter(user => myConnectedUserIds.includes(user.id));

    connectedUsers.forEach(user => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transform hover:scale-105 transition-transform duration-200 cursor-pointer peer-card';
        card.dataset.userId = user.id;

        let skillsHtml = '';
        (user.skills || []).slice(0, 3).forEach(skill => {
            skillsHtml += `<span class="bg-indigo-100 text-indigo-800 dark:bg-indigo-800 dark:text-indigo-100 text-xs font-medium px-2.5 py-0.5 rounded-full">${skill}</span>`;
        });

        card.innerHTML = `
            <img src="${user.avatar || 'https://via.placeholder.com/80'}" alt="Profile Picture" class="w-20 h-20 rounded-full mx-auto mb-4 object-cover">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">${user.name}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">${user.course}, ${user.year}</p>
            <div class="mt-3 flex flex-wrap justify-center gap-2">
                ${skillsHtml}
            </div>
            <div class="mt-4 flex justify-center space-x-2">
                <button class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors message-btn" data-user-id="${user.id}">Message (Mock)</button>
                <button class="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors disconnect-btn" data-user-id="${user.id}">Disconnect</button>
            </div>
        `;
        // Attach event listener for the whole card to view profile
        card.addEventListener('click', (e) => {
             // Don't open profile if message/disconnect button clicked
            if (!e.target.closest('.message-btn') && !e.target.closest('.disconnect-btn')) {
                renderPeerProfileView(user.id);
            }
        });

        const messageBtn = card.querySelector('.message-btn');
        messageBtn.addEventListener('click', () => openChatModal(user.id));

        const disconnectBtn = card.querySelector('.disconnect-btn');
        disconnectBtn.addEventListener('click', () => handleDisconnect(user.id));

        connectionList.appendChild(card);
    });
}


function renderPeerProfileView(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return; // User not found

    viewProfileAvatar.src = user.avatar || 'https://via.placeholder.com/150';
    viewProfileName.textContent = user.name;
    viewProfileDetails.textContent = `${user.course}, ${user.year} at ${user.university}`;
    viewProfileBio.textContent = user.bio;

    viewProfileProjects.innerHTML = '';
    if (user.projects && user.projects.length > 0) {
        user.projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project;
            viewProfileProjects.appendChild(li);
        });
    } else {
        viewProfileProjects.innerHTML = '<li class="text-gray-500 dark:text-gray-400">No projects added yet.</li>';
    }

    renderSkills(user.skills || [], viewProfileSkillsTags);

    if (user.linkedin) {
        viewProfileLinkedin.href = user.linkedin;
        viewProfileLinkedin.classList.remove('hidden');
        viewProfileLinkedin.parentNode.classList.remove('hidden'); // Show parent div if links exist
    } else {
        viewProfileLinkedin.classList.add('hidden');
    }
    if (user.github) {
        viewProfileGithub.href = user.github;
        viewProfileGithub.classList.remove('hidden');
        viewProfileGithub.parentNode.classList.remove('hidden'); // Show parent div if links exist
    } else {
        viewProfileGithub.classList.add('hidden');
    }

    // Hide/show connect button based on connection status
    const isConnected = currentUser && connections[currentUser.id] && connections[currentUser.id].includes(userId);
    if (currentUser && userId === currentUser.id) { // If viewing own profile
        viewProfileConnectBtn.classList.add('hidden');
        viewProfileMessageBtn.classList.add('hidden');
    } else if (isConnected) {
        viewProfileConnectBtn.textContent = 'Connected';
        viewProfileConnectBtn.classList.add('bg-gray-400', 'dark:bg-gray-600', 'cursor-not-allowed');
        viewProfileConnectBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        viewProfileConnectBtn.disabled = true;
        viewProfileConnectBtn.classList.remove('hidden');
        viewProfileMessageBtn.classList.remove('hidden'); // Message button always visible if connected
    } else {
        viewProfileConnectBtn.textContent = 'Connect';
        viewProfileConnectBtn.classList.remove('bg-gray-400', 'dark:bg-gray-600', 'cursor-not-allowed');
        viewProfileConnectBtn.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
        viewProfileConnectBtn.disabled = false;
        viewProfileConnectBtn.classList.remove('hidden');
        viewProfileMessageBtn.classList.remove('hidden'); // Ensure message button is also visible
    }

    viewProfileConnectBtn.dataset.userId = userId;
    viewProfileMessageBtn.dataset.userId = userId;


    showPage('peer-profile-view-page');
}


function renderBoardPosts() {
    boardPostsContainer.innerHTML = '';
    if (boardPosts.length === 0) {
        boardPostsContainer.innerHTML = '<p class="text-center text-gray-600 dark:text-gray-400">No collaboration opportunities posted yet.</p>';
        return;
    }

    boardPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

    boardPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'bg-white dark:bg-gray-800 shadow rounded-lg p-6';

        let tagsHtml = '';
        (post.tags || []).forEach(tag => {
            tagsHtml += `<span class="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs font-medium px-2.5 py-0.5 rounded-full">${tag}</span>`;
        });

        const authorUser = allUsers.find(u => u.id === post.authorId);
        const authorAvatar = authorUser ? authorUser.avatar : 'https://via.placeholder.com/30';
        const authorName = authorUser ? authorUser.name : 'Unknown User';

        const timeAgo = new Date(post.timestamp).toLocaleString(); // Simple timestamp for demo

        postElement.innerHTML = `
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100">${post.title}</h3>
            <p class="text-gray-700 dark:text-gray-300 mt-2 mb-3">${post.description}</p>
            <div class="flex flex-wrap gap-2 mb-3">
                ${tagsHtml}
            </div>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <img src="${authorAvatar}" alt="Poster" class="w-6 h-6 rounded-full mr-2">
                <span>Posted by <a href="#" class="text-indigo-600 dark:text-indigo-400 hover:underline" data-user-id="${post.authorId}" data-action="view-profile">${authorName}</a> • ${timeAgo}</span>
                <button class="ml-auto bg-indigo-500 text-white text-sm py-1 px-3 rounded-md hover:bg-indigo-600 transition-colors message-btn" data-user-id="${post.authorId}">Contact Poster</button>
            </div>
        `;
        // Add event listener to "Contact Poster" button
        postElement.querySelector('.message-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent parent clicks
            openChatModal(post.authorId);
        });

        // Add event listener to author name for profile view
        postElement.querySelector('[data-action="view-profile"]').addEventListener('click', (e) => {
            e.preventDefault();
            renderPeerProfileView(post.authorId);
        });


        boardPostsContainer.appendChild(postElement);
    });
}

// --- Connection Logic ---
function handleConnectRequest(targetUserId) {
    if (!currentUser) {
        alert('Please log in to send a connection request.');
        return;
    }
    if (targetUserId === currentUser.id) {
        alert('You cannot connect with yourself.');
        return;
    }
    if (connections[currentUser.id] && connections[currentUser.id].includes(targetUserId)) {
        alert('Already connected!');
        return;
    }

    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) {
        alert('Target user not found.');
        return;
    }

    // Simulate sending a connection request notification to the target user
    const newNotification = {
        id: `notif${notifications.length + 1}-${Date.now()}`, // Unique ID
        type: 'connection_request',
        from: currentUser.id,
        fromName: currentUser.name,
        to: targetUserId,
        status: 'pending',
        read: false,
        timestamp: new Date().toISOString()
    };
    notifications.push(newNotification);
    saveState();

    // Simulate auto-acceptance for the demo (you can change this to a real pending state)
    if (!connections[currentUser.id]) {
        connections[currentUser.id] = [];
    }
    connections[currentUser.id].push(targetUserId);

    if (!connections[targetUserId]) { // Ensure target user also has a connections array
        connections[targetUserId] = [];
    }
    connections[targetUserId].push(currentUser.id);

    saveState();
    alert(`Connection request sent to ${targetUser.name}! (Simulated auto-accepted for demo)`);
    renderDiscoverPage(); // Update UI to show "Connected" status
    renderPeerProfileView(targetUserId); // Update the viewed profile's button
    updateNotificationBadge();
}

function handleDisconnect(targetUserId) {
    if (!currentUser || !confirm(`Are you sure you want to disconnect from ${allUsers.find(u => u.id === targetUserId)?.name}?`)) {
        return;
    }

    // Remove from current user's connections
    if (connections[currentUser.id]) {
        connections[currentUser.id] = connections[currentUser.id].filter(id => id !== targetUserId);
    }
    // Remove current user from target user's connections (simulated symmetric connection)
    if (connections[targetUserId]) {
        connections[targetUserId] = connections[targetUserId].filter(id => id !== currentUser.id);
    }
    saveState();
    alert('Disconnected.');
    renderConnectionsPage(); // Re-render connections
    renderDiscoverPage(); // Update discover page if needed
}

// --- Notification Logic ---
function renderNotifications() {
    notificationsDropdown.innerHTML = '';
    const userNotifications = notifications.filter(n => n.to === (currentUser ? currentUser.id : null)); // Filter notifications relevant to current user
    userNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first

    if (userNotifications.length === 0) {
        const item = document.createElement('div');
        item.className = 'px-4 py-2 text-sm text-gray-700 dark:text-gray-200';
        item.textContent = 'No new notifications.';
        notificationsDropdown.appendChild(item);
    } else {
        userNotifications.forEach(notif => {
            const item = document.createElement('a');
            item.href = '#'; // Or a more specific link if you implement deep linking
            item.className = `block px-4 py-2 text-sm ${notif.read ? 'text-gray-500' : 'font-semibold text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600`;
            item.innerHTML = `
                ${notif.type === 'connection_request' ? `<b>${notif.fromName}</b> sent you a connection request.` : 'New activity.'}
                <span class="block text-xs text-gray-400">${new Date(notif.timestamp).toLocaleString()}</span>
            `;
            item.addEventListener('click', () => {
                notif.read = true;
                saveState();
                updateNotificationBadge();
                renderNotifications(); // Re-render dropdown
                // Add specific action based on notification type if needed
                // e.g., if (notif.type === 'connection_request') renderPeerProfileView(notif.from);
            });
            notificationsDropdown.appendChild(item);
        });

        // Add Clear All button
        const hr = document.createElement('hr');
        hr.className = 'border-gray-200 dark:border-gray-600 my-1';
        notificationsDropdown.appendChild(hr);

        const clearBtn = document.createElement('button');
        clearBtn.className = 'w-full text-center py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600';
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => {
            notifications = notifications.filter(n => n.to !== (currentUser ? currentUser.id : null) || n.read); // Only clear read ones for current user
            // Or if you want to clear ALL user notifications:
            // notifications = notifications.filter(n => n.to !== currentUser.id);
            saveState();
            updateNotificationBadge();
            renderNotifications();
        });
        notificationsDropdown.appendChild(clearBtn);
    }
}

// --- Board Logic ---
function handleSubmitPost(event) {
    event.preventDefault();
    if (!currentUser) {
        alert('Please log in to post an opportunity.');
        return;
    }

    const title = postTitleInput.value.trim();
    const description = postDescriptionInput.value.trim();
    const tags = postTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (!title || !description) {
        alert('Title and description cannot be empty.');
        return;
    }

    const newPost = {
        id: `post${boardPosts.length + 1}-${Date.now()}`, // Unique ID
        title,
        description,
        tags,
        authorId: currentUser.id,
        authorName: currentUser.name,
        timestamp: new Date().toISOString()
    };
    boardPosts.push(newPost);
    saveState();
    renderBoardPosts();
    postTitleInput.value = '';
    postDescriptionInput.value = '';
    postTagsInput.value = '';
    alert('Opportunity posted successfully!');
}

// --- Chat Logic (Simulated) ---
let currentChattingWith = null; // Store the ID of the user currently being chatted with

function openChatModal(userId) {
    if (!currentUser) {
        alert('Please log in to chat.');
        return;
    }
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    currentChattingWith = userId;
    chatHeaderName.textContent = `Chat with ${user.name}`;
    chatMessagesContainer.innerHTML = ''; // Clear previous messages

    // Simulate some chat history
    // In a real app, this would load actual messages between the two users
    const simulatedMessages = [
        { sender: user.id, message: `Hey ${currentUser.name}! How are you doing?` },
        { sender: currentUser.id, message: `Hi ${user.name}! I'm good, thanks! How can I help?` },
        { sender: user.id, message: `I saw your profile, interested in connecting for a project.` }
    ];

    simulatedMessages.forEach(msg => {
        addMessageToChat(msg.message, msg.sender === currentUser.id);
    });

    chatModal.classList.remove('hidden');
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
}

function addMessageToChat(message, isMe) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${isMe ? 'justify-end' : 'justify-start'}`;
    messageDiv.innerHTML = `
        <div class="${isMe ? 'bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'} p-3 rounded-lg max-w-[70%]">
            <p class="text-sm">${message}</p>
            <span class="text-xs text-gray-500 dark:text-gray-400 block mt-1 ${isMe ? 'text-right' : ''}">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    `;
    chatMessagesContainer.appendChild(messageDiv);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll to bottom
}

function handleSendMessage() {
    const message = chatInput.value.trim();
    if (message) {
        addMessageToChat(message, true); // True for current user
        chatInput.value = '';

        // Simulate a reply after a short delay
        setTimeout(() => {
            const replyingUser = allUsers.find(u => u.id === currentChattingWith);
            const replyName = replyingUser ? replyingUser.name : 'The other user';
            addMessageToChat(`(Simulated reply from ${replyName}): Got it! Let's connect on that.`, false);
        }, 1500);
    }
}


// --- Dark Mode Logic ---
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        darkModeToggle.innerHTML = '🌙';
    } else {
        localStorage.setItem('theme', 'light');
        darkModeToggle.innerHTML = '☀️';
    }
}

// Apply theme on load
if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    darkModeToggle.innerHTML = '🌙';
} else {
    darkModeToggle.innerHTML = '☀️';
}

// --- Event Listeners ---

// Global Navigation
document.querySelectorAll('[data-nav-link]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = e.target.dataset.navLink + '-page';
        if (currentUser) {
            if (targetPageId === 'my-profile-page') renderMyProfile();
            if (targetPageId === 'discover-page') renderDiscoverPage();
            if (targetPageId === 'connections-page') renderConnectionsPage();
            if (targetPageId === 'board-page') renderBoardPosts();
            if (targetPageId === 'edit-profile-page') fillEditProfileForm();
            showPage(targetPageId);
        } else {
            alert('Please log in to access this feature.');
            showPage('login-signup-page');
        }
    });
});


// Login/Signup
loginBtn.addEventListener('click', handleLogin);
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    handleSignup();
});


// Discover Page Filters/Search
discoverSearchInput.addEventListener('input', renderDiscoverPage);
filterCourseSelect.addEventListener('change', renderDiscoverPage);
filterYearSelect.addEventListener('change', renderDiscoverPage);
filterSkillsInput.addEventListener('input', renderDiscoverPage);
applyFiltersBtn.addEventListener('click', renderDiscoverPage);
resetFiltersBtn.addEventListener('click', () => {
    discoverSearchInput.value = '';
    filterCourseSelect.value = '';
    filterYearSelect.value = '';
    filterSkillsInput.value = '';
    renderDiscoverPage();
});

// My Profile & Edit Profile
editProfileForm.addEventListener('submit', handleEditProfileSubmit);
profilePicturePreview.addEventListener('click', () => editProfilePictureInput.click());
editProfilePictureInput.addEventListener('input', () => {
    profilePicturePreview.src = editProfilePictureInput.value || 'https://via.placeholder.com/100';
});
cancelEditBtn.addEventListener('click', () => showPage('my-profile-page'));


// Peer Profile View Actions
viewProfileConnectBtn.addEventListener('click', (e) => {
    // Ensure the button itself has the data-user-id
    const targetUserId = e.currentTarget.dataset.userId;
    if (targetUserId) {
        handleConnectRequest(targetUserId);
    }
});
viewProfileMessageBtn.addEventListener('click', (e) => {
    const targetUserId = e.currentTarget.dataset.userId;
    if (targetUserId) {
        openChatModal(targetUserId);
    }
});
closePeerProfileBtn.addEventListener('click', () => {
    peerProfileViewPage.classList.add('hidden');
});


// Board Page
submitPostBtn.addEventListener('click', handleSubmitPost);


// Chat Modal
sendMessageBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
closeChatModalBtn.addEventListener('click', () => chatModal.classList.add('hidden'));


// Header Dropdowns & Toggles
darkModeToggle.addEventListener('click', toggleDarkMode);

notificationsBtn.addEventListener('click', () => {
    notificationsDropdown.classList.toggle('hidden');
    profileMenuDropdown.classList.add('hidden'); // Close other dropdown
    renderNotifications();
});

profileMenuBtn.addEventListener('click', () => {
    profileMenuDropdown.classList.toggle('hidden');
    notificationsDropdown.classList.add('hidden'); // Close other dropdown
});

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    saveState();
    alert('Logged out successfully.');
    showPage('login-signup-page');
    // Clear profile avatar in header
    myProfileAvatarHeader.src = 'https://via.placeholder.com/40';
});

// Mobile menu toggle
mobileMenuButton.addEventListener('click', () => {
    mobileMenuDrawer.classList.toggle('-translate-x-full');
});
// Close mobile menu when a link is clicked
mobileMenuDrawer.querySelectorAll('[data-nav-link]').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('-translate-x-full');
    });
});
mobileLogoutBtn.addEventListener('click', () => {
    currentUser = null;
    saveState();
    alert('Logged out successfully.');
    showPage('login-signup-page');
    mobileMenuDrawer.classList.add('-translate-x-full');
    myProfileAvatarHeader.src = 'https://via.placeholder.com/40';
});


// Close dropdowns/modals if clicked outside
document.addEventListener('click', (e) => {
    if (!notificationsBtn.contains(e.target) && !notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.add('hidden');
    }
    if (!profileMenuBtn.contains(e.target) && !profileMenuDropdown.contains(e.target)) {
        profileMenuDropdown.classList.add('hidden');
    }
    // Don't hide peer-profile-view-page on outside click as it's a modal, use its close button
    // Don't hide chat-modal on outside click either
});


// --- Initial App Load ---
window.addEventListener('load', () => {
    if (currentUser) {
        renderMyProfile();
        renderDiscoverPage();
        updateNotificationBadge();
        showPage('discover-page'); // Start on discover page if logged in
    } else {
        showPage('login-signup-page'); // Show login if not logged in
    }
});