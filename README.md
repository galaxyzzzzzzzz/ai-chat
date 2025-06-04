# Floating AI Chat (OpenRouter)

A lightweight floating AI chat window you can use on any webpage using a bookmarklet.

## How to Use

1. Host on GitHub Pages
2. Create a bookmarklet like this:

```js
javascript:(async()=>{const p=prompt("Enter passkey");if(p!=='2012')return;let s=document.createElement('script');s.src='https://YOUR_GITHUB_USERNAME.github.io/REPO_NAME/chat.js';document.body.appendChild(s);})()
```

3. Replace the placeholder URL with your GitHub Pages link.
