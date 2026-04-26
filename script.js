// Mobile navbar toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

if (burger) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Storage keys
const CONTACT_KEY = 'akot_contacts';
const DONATION_KEY = 'akot_donations';

// Helper: load data
function loadContacts() {
  return JSON.parse(localStorage.getItem(CONTACT_KEY) || '[]');
}

function loadDonations() {
  return JSON.parse(localStorage.getItem(DONATION_KEY) || '[]');
}

function saveContacts(data) {
  localStorage.setItem(CONTACT_KEY, JSON.stringify(data));
}

function saveDonations(data) {
  localStorage.setItem(DONATION_KEY, JSON.stringify(data));
}

// Contact form handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const phone = document.getElementById('contactPhone')?.value;
    const message = document.getElementById('contactMsg')?.value;
    
    if (!name || !email || !message) {
      alert('Please fill in all required fields (Name, Email, Message)');
      return;
    }
    
    const contacts = loadContacts();
    contacts.push({
      name,
      email,
      phone: phone || '',
      message,
      date: new Date().toLocaleString(),
      type: 'contact'
    });
    saveContacts(contacts);
    alert('Message sent successfully! Admin will review your inquiry.');
    contactForm.reset();
  });
}

// Donation form handler
const donationForm = document.getElementById('donationForm');
if (donationForm) {
  donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('donName')?.value;
    const email = document.getElementById('donEmail')?.value;
    const phone = document.getElementById('donPhone')?.value;
    const address = document.getElementById('donAddress')?.value;
    const amount = document.getElementById('donAmount')?.value;
    const message = document.getElementById('donMsg')?.value;
    
    if (!name || !email || !amount) {
      alert('Please fill in all required fields (Name, Email, Amount)');
      return;
    }
    
    if (parseFloat(amount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }
    
    const donations = loadDonations();
    donations.push({
      name,
      email,
      phone: phone || '',
      address: address || '',
      amount: parseFloat(amount),
      message: message || '',
      date: new Date().toLocaleString()
    });
    saveDonations(donations);
    alert('Thank you for your generous donation! God bless you abundantly.');
    donationForm.reset();
  });
}

// Newsletter subscription
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]')?.value;
    if (email) {
      // Store newsletter subscribers (for demo purposes)
      let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      alert('Thank you for subscribing to our newsletter!');
      newsletterForm.reset();
    }
  });
}

// Admin dashboard render
function renderAdmin() {
  const contacts = loadContacts();
  const donations = loadDonations();
  
  const contactsBody = document.getElementById('contactsBody');
  const donationsBody = document.getElementById('donationsBody');
  const totalContactsEl = document.getElementById('totalContacts');
  const totalDonationsEl = document.getElementById('totalDonations');
  const totalAmountEl = document.getElementById('totalAmount');
  
  if (contactsBody) {
    if (contacts.length === 0) {
      contactsBody.innerHTML = '<tr><td colspan="5" class="no-data">No messages yet</td></tr>';
    } else {
      contactsBody.innerHTML = contacts.map(c => `
        <tr>
          <td>${escapeHtml(c.name)}</td>
          <td>${escapeHtml(c.email)}</td>
          <td>${escapeHtml(c.phone || '-')}</td>
          <td>${escapeHtml(c.message.substring(0, 100))}${c.message.length > 100 ? '...' : ''}</td>
          <td>${escapeHtml(c.date)}</td>
        </tr>
      `).join('');
    }
  }
  
  if (donationsBody) {
    if (donations.length === 0) {
      donationsBody.innerHTML = '<tr><td colspan="7" class="no-data">No donations yet</td></tr>';
    } else {
      donationsBody.innerHTML = donations.map(d => `
        <tr>
          <td>${escapeHtml(d.name)}</td>
          <td>${escapeHtml(d.email)}</td>
          <td>${escapeHtml(d.phone || '-')}</td>
          <td>${escapeHtml(d.address || '-')}</td>
          <td>$${d.amount.toFixed(2)}</td>
          <td>${escapeHtml(d.message.substring(0, 80))}${d.message.length > 80 ? '...' : ''}</td>
          <td>${escapeHtml(d.date)}</td>
        </tr>
      `).join('');
    }
  }
  
  // Update statistics
  if (totalContactsEl) {
    totalContactsEl.textContent = contacts.length;
  }
  if (totalDonationsEl) {
    totalDonationsEl.textContent = donations.length;
  }
  if (totalAmountEl) {
    const total = donations.reduce((sum, d) => sum + d.amount, 0);
    totalAmountEl.textContent = `$${total.toFixed(2)}`;
  }
}

// Clear data function
const clearDataBtn = document.getElementById('clearDataBtn');
if (clearDataBtn) {
  clearDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete ALL contact messages and donation records? This action cannot be undone.')) {
      localStorage.removeItem(CONTACT_KEY);
      localStorage.removeItem(DONATION_KEY);
      renderAdmin();
      alert('All data has been cleared successfully.');
    }
  });
}

// Export data function
const exportDataBtn = document.getElementById('exportDataBtn');
if (exportDataBtn) {
  exportDataBtn.addEventListener('click', () => {
    const contacts = loadContacts();
    const donations = loadDonations();
    const exportData = {
      exportDate: new Date().toLocaleString(),
      contacts: contacts,
      donations: donations,
      totalContacts: contacts.length,
      totalDonations: donations.length,
      totalAmount: donations.reduce((sum, d) => sum + d.amount, 0)
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `akot-diocese-data-${new Date().toISOString().slice(0,19)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  });
}

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Initialize admin panel if on admin page
if (window.location.pathname.includes('admin.html')) {
  renderAdmin();
}

// Scroll to top functionality
function addScrollToTop() {
  const scrollBtn = document.createElement('div');
  scrollBtn.className = 'scroll-top';
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(scrollBtn);
  
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  });
  
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Add scroll to top button
addScrollToTop();

// Set active navigation link
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// News hover effect - already handled by CSS, but ensure smooth behavior
const newsCards = document.querySelectorAll('.hover-news');
if (newsCards.length > 0) {
  newsCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      // CSS handles the expansion
    });
  });
}