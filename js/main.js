// Shared functions: performSearch, contact submit, English->Bangla translator (demo)
(function(){

    // Simple performSearch: find elements containing the query and scroll to first match.
    window.performSearch = function() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        const q = input.value.trim().toLowerCase();
        if (!q) {
            alert('Please enter something to search.');
            return;
        }

        // Clear previous highlights
        document.querySelectorAll('.ra-highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
        });

        // Search across text nodes in main content areas
        const selectors = ['.home-page', '.about', '.services', '.order-page', '.join-page', '.signin-page', '.member-page', '.contact-page'];
        let found = false;
        for (const sel of selectors) {
            const root = document.querySelector(sel);
            if (!root) continue;
            // Find matching text nodes
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            while(walker.nextNode()){
                const node = walker.currentNode;
                const text = node.nodeValue.toLowerCase();
                if (text.includes(q)){
                    found = true;
                    // Highlight by wrapping parent with span
                    const span = document.createElement('span');
                    span.className = 'ra-highlight';
                    span.textContent = node.nodeValue;
                    node.parentNode.replaceChild(span, node);
                    // Scroll to highlighted element
                    span.scrollIntoView({behavior:'smooth', block:'center'});
                    return; // stop at first match
                }
            }
        }

        if (!found) alert('Sorry, no matching result found.');
    };

    // Contact form submit handler (demo only)
    window.submitContact = function(e){
        e.preventDefault();
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const msg = document.getElementById('contactMessage').value.trim();
        if(!name || !email || !msg){
            document.getElementById('contactStatus').innerText = 'Please fill in all fields.';
            return;
        }
        // Save to localStorage as demo storage
        const submissions = JSON.parse(localStorage.getItem('rahmanMessages')||'[]');
        submissions.push({name,email,msg,date:new Date().toLocaleString()});
        localStorage.setItem('rahmanMessages', JSON.stringify(submissions));
        document.getElementById('contactStatus').innerText = 'Message sent. Thank you!';
        e.target.reset();
    };

    javascript
// =====================================================
// AUTOMATIC ENGLISH -> BANGLA TRANSLATOR
// =====================================================

window._gimini = {
    active: false
};

window.toggleGimini = function () {

    const select = document.querySelector('.goog-te-combo');

    if (!select) {
        alert('Translator is loading. Please wait a moment and try again.');
        return;
    }

    if (!window._gimini.active) {

        // Translate to Bangla
        select.value = 'bn';
        select.dispatchEvent(new Event('change'));

        window._gimini.active = true;

        document.querySelectorAll('.translator-toggle').forEach(function (button) {
            button.innerText = 'Show English';
        });

    } else {

        // Return to English
        select.value = 'en';
        select.dispatchEvent(new Event('change'));

        window._gimini.active = false;

        document.querySelectorAll('.translator-toggle').forEach(function (button) {
            button.innerText = 'Translate BN';
        });
    }
};


// Google Translate initialization
function googleTranslateElementInit() {

    new google.translate.TranslateElement(
        {
            pageLanguage: 'en',
            includedLanguages: 'en,bn',
            autoDisplay: false
        },
        'google_translate_element'
    );

}


})();
