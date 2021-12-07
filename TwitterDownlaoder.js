javascript:
(async function () {
    /**
     * github.com/FarisHijazi/TwitterDownloader
     * JavaScript to download images from twitter bookmarks or likes
     * 
     * will scroll through the feed and grab URLs and download them
     */
    if (location.hostname !== 'twitter.com') {
        alert('this is not twitter.com, please navigate to a twitter likes or bookmarks page.');
        return;
    }
    alert(
        'Downloading images, be sure to allow multiple downloads in your browser. ' +
        'Don\'t interact with anything until the script is done, you\'ll know when it stops scrolling\n' +
        'If facing issues, submit at:\nhttps://github.com/FarisHijazi/TwitterDownloader'
    );
    var urls = [];
    var names = [];
    document.body.scrollIntoView(); /* scroll to top */

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function normalizeUrl(url) {
        return !!url ? url.replace(/\&name=[^&]+/, "") : '';
    }
    function getExtension(url) {
        return new URL(url).searchParams.get('format') || new URL(url).pathname.split('.').pop() || 'gif'
    }
    function download(url, fname) {
        return fetch(url)
            .then(resp => resp.blob())
            .then(blob => {
                const bloburl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = bloburl;
                /* the filename you want */
                if (!fname) {
                    fname = new URL(url).pathname.split('/').pop();
                    var ext = getExtension(url);
                    fname += '.' + ext;
                }
                a.download = fname;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(bloburl);
            })
            .catch(() => alert('oh no!'));
    }

    do {
        var newImgs = Array.from(document.querySelectorAll('img,video')).filter(img => /\.mp4|media/.test(img.src) && !(urls.includes(normalizeUrl(img.src))));

        for (const img of newImgs) {
            var url = normalizeUrl(img.src);
            urls.push(url);
            try {
                var fname = img.closest('[data-testid="tweet"]').innerText.split('\n').slice(0, -3).join(' ') + '.' + getExtension(url);
            } catch (e) {
                var fname = '';
            }
            names.push(fname);
            console.log(urls.length, url, fname);
            img.scrollIntoView();
            download(url, fname);
            await sleep(700);
        }
    } while (newImgs.length);

    console.log(Array.from(urls).join('\n'))
    /* 
    for (i = 0; i < urls.length; i++) {
        download(urls[i], names[i]);
        await sleep(300);
    }
     */
})();
