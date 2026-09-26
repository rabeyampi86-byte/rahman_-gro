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

    // Very small English->Bangla dictionary for demo; for larger coverage use API or larger dataset.
    const enToBn = {
        'welcome':'স্বাগতম',
        'farm':'খামার',
        'chicken':'মুরগি',
        'broiler':'ব্রয়লার',
        'sonali':'সোনালি',
        'order':'অর্ডার',
        'contact':'যোগাযোগ',
        'services':'সেবা',
        'about':'সম্পর্কিত'
    };

    window.giminiTranslate = function(toLang){
        // only supports 'bn' for Bangla in this demo
        if(toLang !== 'bn') return;
        // Walk text nodes and replace words from dictionary
        const selectors = ['body'];
        for(const sel of selectors){
            const root = document.querySelector(sel);
            if(!root) continue;
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
            const nodes = [];
            while(walker.nextNode()) nodes.push(walker.currentNode);
            for(const node of nodes){
                let text = node.nodeValue;
                // avoid translating inside inputs, script, style
                if(node.parentNode && ['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.parentNode.tagName)) continue;
                // simple whole-word replacement
                Object.keys(enToBn).forEach(en => {
                    const re = new RegExp('\\b'+en+'\\b','gi');
                    text = text.replace(re, function(m){
                        // preserve case
                        const bn = enToBn[en];
                        return bn;
                    });
                });
                if(text !== node.nodeValue) node.nodeValue = text;
            }
        }
    };

    // Toggle translator with ability to restore original text
    window._gimini = { active: false, originals: [] };
    window.toggleGimini = function(){
        if(!window._gimini.active){
            // store original text nodes and translate
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            const nodes = [];
            while(walker.nextNode()){
                const n = walker.currentNode;
                if(n.parentNode && ['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(n.parentNode.tagName)) continue;
                nodes.push(n);
            }
            nodes.forEach(n => window._gimini.originals.push({node: n, text: n.nodeValue}));
            window.giminiTranslate('bn');
            window._gimini.active = true;
            document.querySelectorAll('.translator-toggle').forEach(b=> b.innerText = 'Show English');
        } else {
            // restore
            window._gimini.originals.forEach(item => { try{ item.node.nodeValue = item.text } catch(e){} });
            window._gimini.originals = [];
            window._gimini.active = false;
            document.querySelectorAll('.translator-toggle').forEach(b=> b.innerText = 'Translate BN');
        }
    };

})();
