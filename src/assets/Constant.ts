const loadScript = (url: string) => {
    const script = document.createElement('script');
    script.src = url;
    script.defer = true;
    document.body.appendChild(script)
}

export {
    loadScript
}
